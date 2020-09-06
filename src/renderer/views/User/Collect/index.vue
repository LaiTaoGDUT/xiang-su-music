<template>
  <div class="collect" :class="{'dark-back1': isDark}">
    <div class="collect-header">
      <a-radio-group buttonStyle="solid" v-model="value">
        <a-radio-button value="collect-album">专辑</a-radio-button>
        <a-radio-button value="collect-artist">歌手</a-radio-button>
        <a-radio-button value="collect-video">视频</a-radio-button>
      </a-radio-group>
    </div>
    <div class="collect-body">
      <component :is="value"></component>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const CollectAlbum = resolve => {
  require(['./components/Album.vue'], resolve)
}
const CollectArtist = resolve => {
  require(['./components/Artist.vue'], resolve)
}
const CollectVideo = resolve => {
  require(['./components/Video.vue'], resolve)
}
export default {
  name: 'collect',
  data () {
    return {
      value: 'collect-album'
    }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  components: {
    CollectAlbum, CollectArtist, CollectVideo
  }
}
</script>

<style lang="less" scoped>
.collect {
  .collect-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ddd;
  }
  .collect-body {
    padding: 16px;
  }
}
.dark-back1 {
  .collect-header {
    .ant-radio-button-wrapper {
      border: none !important;
      background: #222225;
      color: #ffffff;
    }
    .ant-radio-button-wrapper-checked {
      background: #ffffff !important;
      color: #222225 !important;
    }
  }
}
</style>
