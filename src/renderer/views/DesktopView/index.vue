<template>
  <div class="desktop-view">
    <div class="desktop-view-container">
      <canvas id="view-canvas" width="700" height="100"></canvas>
      <audio
        crossOrigin="anonymous"
        :id="sourceCopy"
        ref="audio"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setInterval } from 'timers'
import { remote } from 'electron'
import ls from 'store'
import config from '@/config/defaultSettings'
import { KEEP_SHORT_KEY } from '@/config/config'
export default {
  name: 'desktopView',
  data () {
    return {
      context: null,
      mediaElementSource: null,
      analyser: null,
      dataArray: [],
      gradient: '',
      width: 700,
      height: 100,
      timer: null,
      playing: false,
      showDesktopView: false,
      audioDom: null,
      canvas: null,
      source: '',
      primaryColor: ''
    }
  },
  computed: {
    sourceCopy () {
      return this.source + '2'
    }
  },
  created () {
    let key = process.env.NODE_ENV === 'development'
      ? `${window.location.origin}/less/lysic.less`
      : Object.keys(localStorage).find(item => item.endsWith('lysic.less')) || `app://./less/lysic.less`
    // console.log(key)
    let style = ls.get(key)
    if ( style ) {
      let styleTag = document.createElement('style')
      styleTag.setAttribute('id', 'myTheme')
      styleTag.innerText = style
      document.head.appendChild(styleTag)
    } else {
      // 当主题色不是默认色时，才进行主题编译
      if ( this.primaryColor !== config.primaryColor ) {
        this.updateTheme(this.primaryColor)
      }
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('change-color', (e, data) => {
      this.updateTheme(data.color)
    })
    this.$electron.ipcRenderer.on('change-source', (e, data) => {
      this.source = data.value
      this.$refs.audio.src = data.value
      this.$nextTick(() => {
        this.audioDom = document.getElementById(this.sourceCopy)
      })
    })
    this.$electron.ipcRenderer.on('toggle-desktop-view', (e, data) => {
      this.showDesktopView = data.value
      if (data.value) {
        this.$nextTick(() => {
          this.audioDom = document.getElementById(this.sourceCopy)
          this.init()
        })
      } else {
        this.timer && cancelAnimationFrame(this.timer)
      }
    })
    this.$electron.ipcRenderer.on('toggle-play2', (e, data) => {
      const audio = this.$refs.audio
      if (data.value) {
        this.$nextTick(() => {
          audio.play()
        })
      } else {
        audio.pause()
      }
    })
    this.$electron.ipcRenderer.on('change-media-time', (e, data) => {
      this.$refs.audio.currentTime = data.value
    })
    this.$electron.ipcRenderer.on('change-color', (e, data) => {
      this.primaryColor = data.color
      this.$nextTick(() => {
        this.audioDom = document.getElementById(this.sourceCopy)
        this.init()
      })
    })
    this.$electron.ipcRenderer.on('set-volume', (e, data) => {
      this.$refs.audio.volume = data.value / 2
    })
    this.$electron.ipcRenderer.send('view-ready')
    this.$nextTick(() => {
      this.canvas = document.getElementById('view-canvas')
      if (this.showDesktopView) {
        this.$nextTick(() => {
          this.audioDom = document.getElementById(this.sourceCopy)
          this.init()
        })
      } else {
        this.timer && cancelAnimationFrame(this.timer)
      }
      // this.audioDom = document.getElementById(this.source)
    })
    window.onresize = () => {
        this.init()
    }
  },
  methods: {
    init () {
      let AudioContext = window.AudioContext || window.webkitAudioContext
      let context = new AudioContext()
      if (!this.mediaElementSource) {
        try {
          if (!(this.audioDom instanceof window.Node)) return
          this.mediaElementSource = context.createMediaElementSource(
            this.audioDom
          )

          this.analyser = context.createAnalyser()
          this.mediaElementSource.connect(this.analyser)
          // this.analyser.connect(context.destination)
          this.analyser.fftSize = 1024 / 2
          const length = this.analyser.fftSize
          // 创建数据
          this.dataArray = new Uint8Array(length)
          // console.log(this.dataArray)
        } catch (error) {
          console.log(error)
        }
      }
      this.context = this.canvas.getContext('2d')
      this.context.fillStyle = this.primaryColor
      let _this = this;
      (function draw () {
        _this.analyser.getByteFrequencyData(_this.dataArray)
        _this.context.clearRect(0, 0, _this.width, _this.height)
        _this.context.beginPath()
        _this.context.moveTo(0, _this.height)
        let x = 0
        let step = 10
        let length = Math.ceil(_this.width / step)
        // _this.context.fillStyle = _this.gradient
        for (let i = 1; i <= length; i++) {
          let lineHeight = ((_this.dataArray[i] / 256) * _this.height)
          _this.context.beginPath()
          _this.context.arc(step / 4 + x, _this.height - step / 4, step / 4, 0, 2 * Math.PI)
          _this.context.fill()
          if (lineHeight > 0) {
            _this.context.beginPath()
            _this.context.arc(step / 4 + x, _this.height - lineHeight, step / 4, 0, 2 * Math.PI)
            _this.context.fill()
            _this.context.fillRect(x, _this.height - lineHeight, step / 2, lineHeight - step / 4)
          }
          x += step
        }
        // _this.context.closePath()
        _this.timer = requestAnimationFrame(draw)
      })()
    },
    updateTheme (primaryColor) {
      if ( !primaryColor ) {
        return
      }
      let _this = this

      function buildIt () {
        if ( !window.less ) {
          return
        }
        setTimeout(() => {
          // 编译前删除之前保存的样式
          Object.keys(localStorage).forEach(item => {
            if ( item.endsWith('lysic.less') || item.endsWith('lysic.less:timestamp') || item.endsWith('lysic.less:vars') ) {
              localStorage.removeItem(item)
            }
          })
          window.less
            .modifyVars({
              '@primary-color': primaryColor
            })
            .then(() => {
              let myTheme = document.getElementById('myTheme')
              if ( myTheme ) {
                document.head.removeChild(myTheme)
              }
            })
            .catch((e) => {
              _this.$message.error('主题更新失败!')
            })
        }, 200)
      }

      if ( !this.lessNodesAppended ) {
        // insert less.js and color.less
        let lessStyleNode = document.createElement('link')
        let lessConfigNode = document.createElement('script')
        let lessScriptNode = document.createElement('script')
        lessStyleNode.setAttribute('rel', 'stylesheet/less')
        lessStyleNode.setAttribute('href', `less/lysic.less`)
        lessConfigNode.innerHTML = `
          window.less = {
            async: true,
            env: 'production',
            javascriptEnabled: true
          };
        `
        lessScriptNode.src = 'js/less.min.js'
        lessScriptNode.async = true
        lessScriptNode.onload = () => {
          buildIt()
          lessScriptNode.onload = null
        }

        let myTheme = document.getElementById('myTheme')
        if ( myTheme ) {
          document.head.insertBefore(lessStyleNode, myTheme)
          document.head.insertBefore(lessConfigNode, myTheme)
          document.head.insertBefore(lessScriptNode, myTheme)
        } else {
          document.head.appendChild(lessStyleNode)
          document.head.appendChild(lessConfigNode)
          document.head.appendChild(lessScriptNode)
        }

        this.lessNodesAppended = true
      } else {
        buildIt()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.desktop-view {
  // position: relative;
  .desktop-view-container {
    position: relative;
    height: 100vh;
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    #view-canvas {
      position: absolute;
      bottom: 0;
      -webkit-app-region: drag;
    }
  }
}
</style>
