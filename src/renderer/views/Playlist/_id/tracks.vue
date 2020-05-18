<template>
  <div class="tracks">
    <loading v-show="loading" />
    <track-list @reloading="reloading" @reloaded="reloaded" :limit="limit" :tracks="tracks" @dblclick="play" @download="download" />
  </div>
</template>

<script>
import TrackList from '@/components/Common/track-list/index.js'
import playMixin from '@/mixins/Play'
import Loading from '@/components/Common/loading'
export default {
  name: 'playlist_id_tracks',
  mixins: [
    playMixin
  ],
  components: {
    TrackList, Loading
  },
  data () {
    return {
      limit: 100,
      loading: false
    }
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
    }
  }
}
</script>

<style scoped>
.virtual-list-item__cell {
  line-height: 32px;
}
.tracks {
  margin-top: -1px;
}
</style>
