import { remote } from 'electron'
import uuid from 'uuid/v1'
import db from './../../datastore'
import { getSearchSuggest, getSearch } from './../../api/search'
import { normalSong } from '../../utils/song'
import { getAlbum } from '@/api/album'
const fs = require('fs')
const path = require('path')
const mm = require('music-metadata')
const avatarIcon = 'images/default_album.jpg'

async function searchMusicFile (folder, songs, localSongs) {
  try {
    const dirs = fs.readdirSync(folder)
    for (let item of dirs) {
      const pathname = path.join(folder, item)
      const stat = fs.statSync(pathname)
      if (stat.isFile()) {
        if (item.endsWith('.mp3') || item.endsWith('.m4a') || item.endsWith('.flac')) { // 在未来增加更多可识别的格式
          let localSong = localSongs.find(song => pathname == song.url)
          if (localSong) { // the song is existed
            songs.push(localSong)
            continue
          }
          const metadata = await mm.parseFile(pathname, {
            duration: true
          })
          let songname = item.substring(0, item.lastIndexOf('.')).trim()
          let artist = [], name = songname, matched = false
          if (songname.split('-')[0] && songname.split('-')[1]) {
            artist = songname.split('-')[0].split('_').map(item => { return { name: item } })
            name = songname.split('-')[1].trim()
            matched = false
          }
          let extraItem = {
            name, matched
          }
          const songItem = {
            id: uuid(),
            avatar: avatarIcon,
            album: metadata.common.album || '',
            artist: metadata.common.artists
              ? metadata.common.artists.map(item => { return { name: item } })
              : artist,
            duration: parseInt(metadata.format.duration) || 0,
            url: pathname,
            folder,
            size: stat.size,
            matched: false
          }
          songs.push(Object.assign(extraItem, songItem))
        }
      } else if (stat.isDirectory()) { // 递归扫描
        await searchMusicFile(pathname, songs, localSongs)
      }
    }
  } catch (err) {
    alert('刷新失败' + err)
  }
}

export default {
  namespaced: true,
  state: {
    localSongs: [],
    exportFolders: [`${remote.app.getPath('music')}`], // 所有导入的文件夹
    needRefreshFolders: [`${remote.app.getPath('music')}`], // 需要扫描的文件夹
    matchSuccessNum: 0, // the number of songs num which matching success
    matchFailedNum: 0, // the number of songs which matching failed
    stopMatching: false // a tag which use to  stop songs matching
  },
  getters: {
    localSongs: state => state.localSongs,
    matchSuccessNum: state => state.matchSuccessNum,
    matchFailedNum: state => state.matchFailedNum,
    matchRepeatNum: state => state.matchRepeatNum,
    stopMatching: state => state.songMatching
  },
  mutations: {
    clear (state) {
      state.localSongs = []
    },
    clearMatchNum (state) {
      state.matchSuccessNum = 0
      state.matchFailedNum = 0
    },
    setStopMatching (state, flag) {
      state.stopMatching = flag
    },
    set (state, songs) {
      state.localSongs = songs
    },
    replace (state, obj) {
      state.localSongs.splice(obj.index, 1, obj.song)
    },
    add (state, song) {
      console.log('insert into localSongs')
      if (state.localSongs.findIndex(_song => _song.url == song.url && _song.size == song.size) < 0) {
        state.localSongs.splice(state.localSongs.length, 0, song)
        console.log('insert success')
      }
    },
    delete (state, songIndexs) {
      state.localSongs = state.localSongs.filter((song, index) => {
        return !songIndexs.includes(index)
      })
    },
    setExportFolders (state, arr) {
      state.exportFolders = arr
    },
    setneedRefreshFolders (state, arr) {
      state.needRefreshFolders = arr
    },
    addSuccessNum (state) {
      state.matchSuccessNum += 1
    },
    addFailedNum (state) {
      state.matchFailedNum += 1
    },
    mutateState (state, payload) {
      for (let k in payload) {
        state[k] = payload[k]
      }
    }
  },
  actions: {
    async match ({ state, commit }, forceMatch = false) {
      let albumAvater = new Map() // 暂存专辑id以免相同专辑的歌曲重复请求
      let localSongs = state.localSongs.slice()
      try {
        for (let i = 0; i < localSongs.length; i++) {
          let song = localSongs[i]
          if (state.stopMatching) {
            const _localSongsCopy = state.localSongs.slice()
            commit('mutateState', { localSongs: _localSongsCopy })
            break
          }
          if (!forceMatch && song.matched) {
            continue
          }
          let res = await getSearchSuggest({ keyword: `${song.name} ${song.artist.length ? song.artist[0].name : ''}`, limit: 5 })
          if (!res.result || !res.result.songs) {
            res = await getSearchSuggest({ keyword: `${song.name}`, limit: 5 })
            if (!res.result || !res.result.songs) {
              commit('addFailedNum')
              continue
            }
          }
          let matchSongs = res.result.songs
          if (matchSongs && matchSongs.length) {
            let suggest = matchSongs.find(item => {
              let artistArr = song.artist.map(art => art.name).join('')
              return item.artists.some(artist => artistArr.indexOf(artist.name) >= 0)
            })
            if (!suggest) {
              commit('addFailedNum')
              continue
            }
            // if local song lists has this song and larger then it
            // if (state.localSongs.slice(0, i).some(song => (suggest.id == song.id && state.localSongs[i].size <= song.size))) {
            //   commit('addRepeatNum')
            //   repeatedSongs.push(i)
            //   continue
            // }
            let avatar
            if (suggest.album) {
              let albumId = suggest.album.id
              if (albumAvater.has(albumId)) {
                avatar = albumAvater.get(albumId)
              } else {
                avatar = await getAlbum(albumId)
                if (avatar.songs) {
                  avatar = avatar.songs[0].al.picUrl
                  albumAvater.set(albumId, avatar)
                } else {
                  avatar = ''
                }
              }
              suggest.avatar = avatar
            }
            suggest = normalSong(suggest)
            let _song = {
              ...song,
              ...suggest,
              url: song.url,
              matched: true
            }
            commit('replace', { index: i, song: _song })
            commit('addSuccessNum')
          }
        }
        commit('setStopMatching', false)
        const _localSongsCopy = state.localSongs.slice()
        commit('mutateState', { localSongs: _localSongsCopy })
      } catch (error) {
        console.log('match error:', error)
        const _localSongsCopy = state.localSongs.slice()
        commit('mutateState', { localSongs: _localSongsCopy })
      }
    },
    async refresh ({ state, commit, dispatch, rootState }, selectedFolders) {
      let folders = selectedFolders && selectedFolders.length ? selectedFolders : state.exportFolders
      let songs = []

      for (let folder of folders) {
        await searchMusicFile(folder, songs, state.localSongs)
      }
      commit('mutateState', { localSongs: songs })
    },
    async add ({ state, commit, dispatch, rootState }, song) {
      let avatar
      if (song.album) {
        let albumId = song.album.id
        avatar = await getAlbum(albumId)
        if (avatar.songs) {
          avatar = avatar.songs[0].al.picUrl
        } else {
          avatar = ''
        }
      }
      song.avatar = avatar
      song.matched = true
      commit('add', song)
    }
  }
}
