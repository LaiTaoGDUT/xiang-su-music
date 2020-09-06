<template>
  <div class="download" :class="{'dark-back1': isDark}">
    <div class="download-header">
      <a-radio-group buttonStyle="solid" v-model="value">
        <a-radio-button value="downloaded">已下载单曲</a-radio-button>
        <a-radio-button value="downloading">正在下载</a-radio-button>
      </a-radio-group>
    </div>
    <div class="download-body">
      <component :is="value"></component>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const Downloaded = resolve => {
  require(['./components/downloaded.vue'], resolve)
}
const Downloading = resolve => {
  require(['./components/downloading.vue'], resolve)
}
export default {
  name: 'download',
  data () {
    return {
      value: 'downloaded'
    }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  components: {
    Downloaded, Downloading
  }
}
</script>

<style lang="less" scoped>
.download {
  .download-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    /deep/ .ant-radio-button-wrapper {
      height: 28px;
      line-height: 26px;
    }
  }
}
.dark-back1 {
  .download-header {
    .ant-radio-button-wrapper {
      border: none;
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
