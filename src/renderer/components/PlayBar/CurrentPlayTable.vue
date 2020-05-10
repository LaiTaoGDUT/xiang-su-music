<template>
  <div class="play-table">
    <track-list :isShowHead="false" :isShowActions="false" :tracks="play_list" @dblclick="play" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TrackList from '@/components/Common/track-list/index.js'
export default {
  components: { TrackList },
  computed: {
    ...mapGetters('play', [
      'current_play_list'
    ])
  },
  data () {
    return {
      play_list: this.current_play_list
    }
  },
  watch: {
    current_play_list: function (newVal) {
      this.play_list = newVal
    }
  },
  methods: {
    play (tracks, index) {
      this.$store.dispatch('play/selectPlay', { tracks, index })
    }
  }
}
</script>
