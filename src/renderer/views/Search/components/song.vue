<template>
  <div>
    <a-spin :spinning="spinning">
      <track-list :tracks="songs" @dblclick="play" @download="download"/>
    </a-spin>
    <slot :total="result.songCount"></slot>
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
      songs: []
    }
  },
  methods: {
    normalData () {
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
    },
    async getAvatar (song) {
      let avatar
      if (song.album) {
        let albumId = song.album.id
        console.log(albumId)
        avatar = await getAlbum(albumId)
        avatar = avatar.songs[0].al.picUrl
        console.log(avatar)
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
