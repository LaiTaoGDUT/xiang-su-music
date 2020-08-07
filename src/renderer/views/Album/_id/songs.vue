<template>
  <div class="tracks">
    <loading v-show="loading" />
    <track-list @reloading="reloading" @reloaded="reloaded" :limit="limit" :tracks="tracks" @dblclick="play" @download="download" />
  </div>
</template>

<script>
import { getSongUrl, getLyric } from '@/api/song'
import TrackList from '@/components/Common/track-list/index.js'
import Artists from '@/components/Common/artists'
import Loading from '@/components/Common/loading'
export default {
  name: 'album_id_songs',
  data () {
    return {
      songUrl: '',
      currentTime: 0,
      buffered: 0,
      limit: 100,
      loading: false
    }
  },
  components: {
    TrackList,
    Artists,
    Loading
  },
  props: {
    tracks: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    reloaded () {
      this.loading = false
    },
    reloading () {
      this.loading = true
    },
    play (tracks, index) {
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    download (song) {
      this.$store.dispatch('Download/download', song)
    }
  }
}
</script>

<style scoped>
.tracks {
  margin-top: -1px;
}
</style>
