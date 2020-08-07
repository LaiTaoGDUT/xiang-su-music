<template>
  <div class="play-cur-table">
    <loading v-show="loading" />
    <track-list @reloading="reloading" @reloaded="reloaded" :limit="limit" :isShowHead="false" :isShowActions="false" :tracks="current_play_list" @dblclick="play" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TrackList from '@/components/Common/track-list/index.js'
import Loading from '@/components/Common/loading'
export default {
  components: { TrackList, Loading },
  computed: {
    ...mapGetters('play', [
      'current_play_list'
    ])
  },
  data () {
    return {
      limit: 100,
      loading: false
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
    }
  }
}
</script>
