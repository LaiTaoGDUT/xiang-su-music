<template>
  <div class="play-table">
    <loading v-show="loading" />
    <track-list @reloading="reloading" @reloaded="reloaded" :limit="limit" :isShowHead="false" :isShowActions="false" :tracks="play_list" @dblclick="play" />
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
      'history_play_list'
    ])
  },
  data () {
    return {
      play_list: this.history_play_list,
      limit: 100,
      loading: false
    }
  },
  watch: {
    history_play_list: function (newVal) {
      this.play_list = newVal
    }
  },
  activated () {
    this.$message.success('历史已激活')
    this.play_list = this.history_play_list
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
