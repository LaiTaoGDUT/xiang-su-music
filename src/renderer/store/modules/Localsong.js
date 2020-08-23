import { remote, ipcRenderer } from 'electron'

import { getSearchSuggest, getSearch } from './../../api/search'
import { normalSong } from '../../utils/song'
import { getAlbum } from '@/api/album'

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
    updateSongInfo (state, obj) {
      state.localSongs[obj.index].size = obj.size
      state.localSongs[obj.index].url = obj.url
    },
    add (state, song) {
      if (state.localSongs.findIndex(_song => _song.url == song.url && _song.size == song.size) < 0) {
        song.matched = true
        state.localSongs.push(song)
      }
    },
    delete (state, songIndex) {
      state.localSongs.splice(songIndex, 1)
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
    async init ({ dispatch, commit, state, rootState }) {
      ipcRenderer.on('refresh-complete', (event, songs) => {
        commit('mutateState', { localSongs: songs })
      })
    },
    async match ({ state, commit }, forceMatch = false) {
      let albumAvater = new Map() // 暂存专辑id以免相同专辑的歌曲重复请求
      let localSongs = state.localSongs.slice()
      try {
        for (let i = 0; i < localSongs.length; i++) {
          let song = localSongs[i]
          if (state.stopMatching) {
            commit('mutateState', { localSongs: localSongs })
            break
          }
          if (!forceMatch && song.matched) {
            continue
          }
          let res
          try {
            res = await getSearchSuggest({ keyword: (`${song.name}`).slice(0, 22), limit: 5 })
          } catch (err) {
            commit('addFailedNum')
            continue
          }
          if (!res.result || !res.result.songs) {
            commit('addFailedNum')
            continue
          }
          let matchSongs = res.result.songs
          if (matchSongs && matchSongs.length) {
            let suggest = matchSongs.find(item => {
              let artistArr = song.artist.map(art => art.name).join('')
              return item.artists.some(artist => artistArr.indexOf(artist.name) >= 0)
            })
            if (!suggest) {
              suggest = matchSongs.find(item => {
                return item.album.name == song.album
              })
              if (!suggest) {
                commit('addFailedNum')
                continue
              }
            }
            // if local song lists has this song and larger then it
            let repeatIndex = localSongs.slice(0, i).findIndex(song => (suggest.id == song.id))
            if (repeatIndex != -1) {
              if (localSongs[repeatIndex].size <= song.size) {
                localSongs[repeatIndex].size = song.size
                localSongs[repeatIndex].url = song.url
                // commit('updateSongInfo', { index: repeatIndex, size: song.size, url: song.url })
              }
              // commit('delete', i)
              localSongs.splice(i, 1)
              i--
              continue
            }
            let avatar
            if (suggest.album) {
              let albumId = suggest.album.id
              if (albumAvater.has(albumId)) {
                avatar = albumAvater.get(albumId)
              } else {
                avatar = await getAlbum(albumId, suggest.platform)
                if (avatar.songs && avatar.songs.length > 0) {
                  avatar = avatar.songs[0].al.picUrl
                  albumAvater.set(albumId, avatar)
                } else if (avatar.album) {
                  avatar = avatar.album.picUrl
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
            // commit('replace', { index: i, song: _song })
            localSongs.splice(i, 1, _song)
            commit('addSuccessNum')
          }
        }
        commit('setStopMatching', false)
        // const _localSongsCopy = state.localSongs.slice()
        commit('mutateState', { localSongs: localSongs })
      } catch (error) {
        console.log('match error:', error)
        commit('mutateState', { localSongs: localSongs })
      }
    },
    async refresh ({ state, commit, dispatch, rootState }, selectedFolders) {
      let folders = selectedFolders && selectedFolders.length ? selectedFolders : state.exportFolders
      ipcRenderer.send('refresh-folders', {
        folders: folders,
        localSongs: state.localSongs
      })
    },
    async add ({ state, commit, dispatch, rootState }, song) {
      let avatar
      if (song.album) {
        let albumId = song.album.id
        avatar = await getAlbum(albumId)
        if (avatar.songs && avatar.songs.length > 0) {
          avatar = avatar.songs[0].al.picUrl
        } else if (avatar.album) {
          avatar = avatar.album.picUrl
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
