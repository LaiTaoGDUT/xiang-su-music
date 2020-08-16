import { ipcRenderer } from 'electron'
import Message from 'ant-design-vue/es/message'
import { getUrl, generateName } from './../../utils/song'
import { uniqueData } from './../../utils/assist'
import throttle from 'lodash/throttle'
import db from './../../datastore'
import { getLyric } from './../../api/song'

let state = {
  downloaded: [],
  downloading: [],
  queue: []
}

let getters = {
  queueIds: state => state.queue.map(item => item.id),
  downloaded: state => state.downloaded
}

let mutations = {
  SET_QUEUE (state, songs) {
    state.queue = songs
  },
  REMOVE_QUEUE (state, song) {
    let index = state.queue.findIndex(item => item.id === song.id)
    state.queue.splice(index, 1)
  },
  SET_DOWNLOADED (state, songs) {
    state.downloaded = songs
  },
  REMOVE_DOWNLOADED (state, index) {
    db.download.remove({ id: state.downloaded[index].id }, (err, doc) => {
      if (err) {
        console.log('删除下载歌曲失败:', err)
      }
    })
    state.downloaded.splice(index, 1)
  },
  ADD_DOWNLOADING (state, song) {
    state.downloading.push(song)
  },
  REMOVE_DOWNLOADING (state, song) {
    let index = state.downloading.findIndex(item => item.id === song.id)
    state.downloading.splice(index, 1)
  },
  UPDATE_DOWNLOADING_PROGRESS (state, { id, progress }) {
    let index = state.downloading.findIndex(item => item.id === id)
    state.downloading[index] && (state.downloading[index].downloadPercent = progress)
  },
  CHANGE_TO_DOWNLOADED (state, { song, index } ) {
    state.downloaded.splice(0, 0, song)
    state.downloaded = uniqueData(state.downloaded)
    state.downloading.splice(index, 1)
    db.download.findOne({ id: song.id }, (err, doc) => {
      if (err) {
        console.log('保存下载歌曲失败:', err)
        return
      }
      if (!doc) {
        db.download.insert(song, (insertErr, downloadItem) => {
          if (!insertErr) {
            console.log('保存下载歌曲成功')
          } else {
            console.log('保存下载歌曲失败:' + insertErr)
          }
        })
      }
    })
  }
}

let actions = {
  init ({ dispatch, commit, state, rootState }) {
    db.download.find({}, (err, docs) => {
      if (!err) {
        commit('SET_DOWNLOADED', docs)
      } else {
        console.log('get downloaded error:' + err)
      }
    })
    ipcRenderer.on('download-onStarted', (event, data) => {
      let { song, totalBytes } = data

      commit('ADD_DOWNLOADING', {
        ...song,
        downloadPercent: 0,
        totalBytes
      })
    })

    ipcRenderer.on('download-onProgress', throttle((event, data) => {
      let { id, progress } = data
      commit('UPDATE_DOWNLOADING_PROGRESS', { id, progress })
    }, 1000, { leading: true }))

    ipcRenderer.on('download-success', (event, data) => {
      let { id, song, downloadFolder } = data
      let index = state.downloading.findIndex(item => item.id === id)
      let filename = generateName(song)
      song.url = `${downloadFolder}\\${filename}`
      song.folder = downloadFolder
      song.size = state.downloading[index].totalBytes
      commit('CHANGE_TO_DOWNLOADED', { song, index })
      dispatch('addLocalMusic', song)
      dispatch('download')
      // 歌曲下载成功尝试下载歌词
      db.lyric.findOne({ songId: id }, (err, doc) => {
        if (err) return
        if (!doc) {    // 内存里面没有歌词
          getLyric(id).then(res => {
            let lyric = ''
            let trans = ''
            if (res.nolyric) {
              lyric = '[00:00.000] 此歌曲为纯音乐，请您欣赏'
            } else {
              lyric = (res.lrc && res.lrc.lyric) || '[00:00.000] 此歌曲为纯音乐，请您欣赏'
              trans = res.tlyric.lyric || ''
            }
            let record = {
              songId: id,
              name: song.name,
              lyric,
              trans
            }
            db.lyric.insert(record, (err, doc) => {
              if (!err) {
                console.log('歌词下载成功')
              } else {
                console.log('歌词下载失败')
              }
            })
          })
        }
      })
    })
  },
  async download ({ dispatch, commit, state, rootState }) {
    if (!state.queue.length) {
      Message.success('全部歌曲下载完毕!')
      return
    }
    let queue = state.queue
    let song = queue.shift()
    let { id, name } = song
    let filename = generateName(song)
    try {
      let downloadUrl = await getUrl(id)
      if (downloadUrl) {
        ipcRenderer.send('download-start', {
          url: downloadUrl,
          filename,
          id,
          song,
          downloadFolder: rootState.Setting.downloadSongsFolders[0]
        })
      } else {
        Message.error(`歌曲${name}无下载资源!`)
        dispatch('download')
      }
    } catch (err) {
      Message.error('下载失败' + err)
      dispatch('download')
    }
  },
  adddownloadQueue ({ commit, dispatch, state }, songs) {
    let queue = [...state.queue]
    songs = songs.filter(song => {   // 过滤已经在queue里面的歌曲
      return !queue.some(item => item.id === song.id)
    })
    if (songs.length) {
      queue.push(...songs)
      commit('SET_QUEUE', queue)
      Message.success(`添加${songs.length}首歌到下载列表`)
    }
    if (state.queue.length > 0 && !state.downloading.length) {
      dispatch('download')
    }
  },
  addLocalMusic ({ commit, dispatch, state, rootState }, song) {
    // 如果本地音乐目录包含下载目录，则在下载完成后自动加入本地歌曲
    if (rootState.Localsong.needRefreshFolders.indexOf(rootState.Setting.downloadSongsFolders[0]) >= 0) {
      commit('Localsong/add', song, { root: true })
      console.log('add', song)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
