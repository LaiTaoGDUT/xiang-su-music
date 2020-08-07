<template>
  <div class="desktop-lyric">
    <div class="playing-lyric" ref="lrc">
      {{current_lyric ? current_lyric : 'PIXEL MUSIC' }}
    </div>
    <div class="playing-trans" ref="lrc" v-show='show_trans'>
      {{current_trans ? current_trans : '像素音乐'}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ls from 'store'
import config from '@/config/defaultSettings'
import { KEEP_SHORT_KEY } from '@/config/config'
import { remote } from 'electron'
export default {
  name: 'DesktopLyric',
  data () {
    return {
      current_lyric: null,
      current_trans: null,
      show_trans: true
    }
  },
  computed: {
    ...mapGetters('App', ['primaryColor']),
    _show_lock () {
      return this.show_lock ? 'show-lock' : 'hide-lock'
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
    this.$electron.ipcRenderer.on('change-lyric', (e, data) => {
      this.current_lyric = data.lyric || null
      this.current_trans = data.trans || null
    })
    this.$electron.ipcRenderer.on('show-trans', (e, data) => {
      this.show_trans = data.value
    })
    this.$electron.ipcRenderer.send('lyric-ready')
  },
  methods: {
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

<style lang='less' scoped>
.desktop-lyric {
  .playing-lyric {
    // margin-top: 32px;
    font-size: 40px;
    color: #fff;
    text-shadow: 1px 1px 5px @primary-color, 1px -1px 3px @primary-color;
    text-align: center;
    font-family: "Source Sans Pro", "明黑", Arial, Helvetica;
    // line-height: 60px;
    text-indent: 2px;
    white-space: nowrap;
    -webkit-app-region: drag;
  }
  .playing-trans {
    font-size: 32px;
    color: #fff;
    text-shadow: 1px 1px 5px @primary-color, 1px -1px 3px @primary-color;
    text-align: center;
    font-family: "Source Sans Pro", "明黑", Arial, Helvetica;
    line-height: 60px;
    text-indent: 2px;
    white-space: nowrap;
    -webkit-app-region: drag;
  }
  .control-wrapper {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    .control-box {
      -webkit-app-region: no-drag;
      .icon {
        color: #fff;
        font-size: 18px;
        &:hover {
          cursor: pointer;
          text-shadow: 1px 1px 5px @primary-color, 1px -1px 3px @primary-color;
        }
      }
    }
  }
}
</style>
