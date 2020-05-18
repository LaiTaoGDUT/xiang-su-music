<template>
  <div class="local-music_home">
    <loading v-show="loading" />
    <keep-alive>
      <router-view @loaded="loaded" @reloading ="reloading"/>
    </keep-alive>
  </div>
</template>

<script>
import Loading from '@/components/Common/loading'
export default {
  name: 'local_music_home',
  data () {
    return {
      loading: false
    }
  },
  components: {
    Loading
  },
  methods: {
    loaded () {
      this.loading = false
    },
    reloading () {
      this.loading = true
    }
  }
}
</script>

<style lang="less">
</style>
