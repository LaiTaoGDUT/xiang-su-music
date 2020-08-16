<template>
  <div ref="app" id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <music-viewer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MusicViewer from '@/views/MusicViewer.vue'
import { KEEP_SHORT_KEY } from '@/config/config'
import deepmerge from 'deepmerge'

export default {
  name: 'app',
  components: {
    MusicViewer
  },
  methods: {
    ...mapActions('Download', {
      initDownload: 'init',
      checkDownloaded: 'checkDownloaded'
    }),
    ...mapActions('Localsong', {
      initLocalsong: 'init'
    }),
    handleAppWillClose () {
      if ( this.$route.name !== 'mini' ) {
        this.$store.commit('play/SET_PLAY_STATUS', false)
      }
      // this.$store.commit('play/SET_SHOW_DESKTOP_LYRIC', false)
    },
    handleNetworkChange ({ name, title, message }, status = true) {
      // let networkNotification = new Notification(name, { // 桌面通知太恶心人了
      //   title,
      //   body: message,
      //   icon: 'public/images/logo.ico'
      // })
      this.$store.commit('App/SET_ONLINE', status)
    },
    getState (state) {
      const modules = ['User', 'play', 'Localsong', 'Setting', 'Update']
      if (!modules.length) return state
      let map = {}
      modules.forEach(module => {
        map[module] = state[module] || {}
      })
      return map
    },
    initState () {
      const modules = ['User', 'play', 'Localsong', 'Setting', 'Update']
      let state = JSON.parse(localStorage.getItem(KEEP_SHORT_KEY)) || {}
      let map = {}
      if (modules.length) {
        modules.forEach(module => {
          map[module] = state[module] || {}
        })
      }
      this.$store.replaceState(deepmerge(this.$store.state, map, {   // 用新状态替换根状态
        arrayMerge: function (store, saved) { return saved },
        clone: false
      }))
    }
  },
  created () {
    this.initDownload()
    this.initLocalsong()
  },
  mounted () {
    // this.$electron.ipcRenderer.on('console', (e, data) => {
    //   console.log(data.value)
    // })
    this.initState()
    this.$electron.ipcRenderer.on('will-close', () => {
      this.handleAppWillClose()
      this.$store.commit('App/SET_REDIRECT', '/home')
      localStorage.setItem(KEEP_SHORT_KEY, JSON.stringify(this.getState(this.$store.state)))
      this.$electron.ipcRenderer.send('app-exit')
    })

    window.onunload = () => {
      this.handleAppWillClose()
    }

    window.onoffline = () => {
      this.handleNetworkChange(
        {
          name: '像素音乐',
          title: '像素音乐',
          message: '请检查您的网络连接'
        },
        false
      )
    }
    window.ononline = () => {
      this.handleNetworkChange({
        name: '像素音乐',
        title: '像素音乐',
        message: '网络连接成功'
      })
    }
  }
}
</script>
