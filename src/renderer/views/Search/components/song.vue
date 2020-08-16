<template>
  <div>
    <a-spin :spinning="spinning">
      <track-list :tracks="songs" @dblclick="play" @download="download"/>
    </a-spin>
    <slot :total="total"></slot>
  </div>
</template>

<script>
import searchMixin from '@/mixins/Search'
import { normalSong } from '@/utils/song'
import TrackList from '@/components/Common/track-list/index.js'
import { getAlbum } from '@/api/album'
export default {
  mixins: [
    searchMixin
  ],
  data () {
    return {
      songs: [],
      total: 0
    }
  },
  methods: {
    normalData () {
      if (this.result.songCount > this.total) {
        this.total = this.result.songCount
      }
      if (this.result.songs && this.result.songs.length) {
        this.songs = this.result.songs.map(song => {
          return normalSong(song)
        })
      }
      this.spinning = false
    },
    async play (tracks, index) {
      let song = tracks[index]
      console.log(song.id)
      song.avatar = await this.getAvatar(song)
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    async getAvatar (song) {
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
        return avatar
      }
    },
    download (song) {
      this.$store.dispatch('Download/download', song)
    }
  },
  components: { TrackList }
}
</script>

<style scoped></style>
