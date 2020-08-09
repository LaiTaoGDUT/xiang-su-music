import { remote } from 'electron'
import uuid from 'uuid/v1'
import db from './../../datastore'
import { getSearchSuggest, getSearch } from './../../api/search'
import { normalSong } from '../../utils/song'
import { getAlbum } from '@/api/album'
import { nextTick } from 'process'
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
          let localSong = localSongs.find(song => pathname.substring(0, pathname.lastIndexOf('.')).trim() == song.url.substring(0, song.url.lastIndexOf('.')).trim())
          if (localSong) { // the song is existed
            if (localSong.url == pathname) {
              await Promise.resolve()
              songs.push(localSong)
              continue
            } else {
              continue
            }
          }
          const metadata = await mm.parseFile(pathname, {
            duration: true
          })
          let songname = item.substring(0, item.lastIndexOf('.')).trim()
          let artist = [], name = songname
          let nameArr = songname.split(' - ')
          if (nameArr[0] && nameArr[1]) {
            artist = nameArr[0].split('_').map(item => { return { name: item } })
            name = nameArr[1].trim()
          }
          let extraItem = {
            name
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
          // let localSong = localSongs.find(song => pathname == song.url)
          // if (localSong) { // the song is existed
          //   songs.push(Object.assign(extraItem, songItem, localSong))
          //   continue
          // } else {
          //   songs.push(Object.assign(extraItem, songItem))
          // }
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
    updateSongInfo (state, obj) {
      state.localSongs[obj.index].size = obj.size
      state.localSongs[obj.index].url = obj.url
    },
    add (state, song) {
      if (state.localSongs.findIndex(_song => _song.url == song.url && _song.size == song.size) < 0) {
        song.matched = true
        state.localSongs.splice(0, 0, song)
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
              suggest = matchSongs.find(item => {
                return item.album.name == song.album
              })
              if (!suggest) {
                suggest = matchSongs.find(item => {
                  return item.name == song.name
                })
                if (!suggest) {
                  commit('addFailedNum')
                  continue
                }
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
