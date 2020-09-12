<template>
  <div>
  </div>
</template>

<script>
import { shell, remote, ipcRenderer } from 'electron'
import uuid from 'uuid/v1'
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
          // if (localSong) { // the song is existed
          //   if (localSong.url == pathname) {
          //     Promise.resolve()
          //     songs.push(localSong)
          //     continue
          //   } else {
          //     continue
          //   }
          // }
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
  name: 'music_refresh',
  data () {
    return {
    }
  },
  created () {
    ipcRenderer.on('refresh-folders', (e, data) => {
        const { folders, localSongs } = data
        this.refreshMusicFile(folders, localSongs)
    })
  },
  methods: {
      async refreshMusicFile (folders, localSongs) {
        let songs = []
        for (let folder of folders) {
            await searchMusicFile(folder, songs, localSongs)
        }
        ipcRenderer.send('refresh-complete', songs)
      }
  }
}
</script>

<style lang="less">
</style>
