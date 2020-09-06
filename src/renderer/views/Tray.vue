<template>
  <div class="tray">
    <div class="tray-box">
      <div class="control-box">
        <img src="./../assets/images/next_icon.png" title="上一曲" @click="backward" class="control-icon step" style="transform:rotate(180deg)"/>
        <img src="./../assets/images/pause_icon.png" @click="togglePlay" class="control-icon" v-show='playing' />
        <img src="./../assets/images/play_icon.png" @click="togglePlay" class="control-icon" v-show='!playing' />
        <img src="./../assets/images/next_icon.png" title="下一曲" @click="forward" class="control-icon step"/>
        <!-- <a-icon type="step-backward" class="control-icon step" title="上一曲" @click="backward" />
        <a-icon :type="playIcon" theme="filled" class="control-icon" :title="playTitle" @click="togglePlay" />
        <a-icon type="step-forward" class="control-icon step" title="下一曲" @click="forward" /> -->
      </div>

      <div class="volume-box" :title="`音量:${isMuted ? 0 : volume*100}%`">
        <z-icon
          :type="mutedIcon"
          @click.native="onMuted"
          title="静音"
          style="cursor: pointer;margin-right:4px;"
        />
        <progress-bar
          :percent="volume"
          size="small"
          @percentChanged="onvolumeChanged"
          class="bar-volume"
        />
      </div>

      <div class="song-box">
        <span class="song-name" v-if="current_song && current_song.name">{{ current_song.name }}</span>
        <span class="song-name" v-else>PIXEL MUSIC</span>
        <span class="play-mode" :title="modeTitle" @click="changeMode">
          <svg style="vertical-align: sub;" v-show="modeIcon == 'liebiaoxunhuan'" t="1597065220042" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1666" width="20" height="20"><path d="M905.615621 524.965532c0-132.931319-65.364876-256.560237-174.885151-331.940698v-0.031008c-1.24032-0.868224-2.356608-1.922496-3.627936-2.790721l-0.248064 0.403105a30.573893 30.573893 0 0 0-18.480771-5.891522 31.256069 31.256069 0 0 0-29.953734 32.465382 30.635909 30.635909 0 0 0 14.232675 24.341284l-0.124032 0.186049a340.839996 340.839996 0 0 1 151.071002 283.289137c0 185.272833-148.559354 336.188795-332.777914 340.653948l39.194119-39.194119a30.759941 30.759941 0 0 0 11.752034-22.821892 31.225061 31.225061 0 0 0-29.953734-32.465381 30.728933 30.728933 0 0 0-23.876164 10.356673l-0.372096-0.372096-116.5901 116.652117 116.90018 113.582324 0.31008-0.31008a30.697925 30.697925 0 0 0 23.6281 13.147394 31.256069 31.256069 0 0 0 32.403366-30.015749 30.914981 30.914981 0 0 0-13.860578-26.542853l0.744192-0.7752-40.341415-39.225127c218.451398-4.434145 394.855941-183.164288 394.855941-402.669959M487.410652 184.652672l-38.139847 37.085575 0.744192 0.7752a30.759941 30.759941 0 0 0-13.860578 26.542853c0.682176 17.240451 15.162915 30.697925 32.403365 29.984741a30.697925 30.697925 0 0 0 23.628101-13.116386l0.279072 0.31008 116.869172-113.582324-116.528084-116.590101-0.372096 0.31008a30.697925 30.697925 0 0 0-23.907173-10.325665c-17.209443 0.651168-30.604901 15.193923-29.953733 32.434373a30.945989 30.945989 0 0 0 11.876066 22.883908l41.054599 41.085608C274.323638 128.373143 99.407479 306.42111 99.407479 524.99654c0 134.109624 66.450156 259.071886 177.675872 334.266299l34.728966-51.411273a340.964028 340.964028 0 0 1-150.388827-282.855026c0-182.947232 144.931417-332.343802 325.987162-340.343868" p-id="1667" fill="#696a6a"></path></svg>
          <svg style="vertical-align: sub;" v-show="modeIcon == 'danquxunhuan1'" t="1597065180245" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1184" width="20" height="20"><path d="M773.597867 203.776l-0.273067 0.443733a33.621333 33.621333 0 0 0-20.343467-6.485333c-18.978133 0.785067-33.723733 16.725333-32.9728 35.771733a33.826133 33.826133 0 0 0 15.633067 26.794667l-0.1024 0.170667a375.227733 375.227733 0 0 1 166.2976 311.876266c0 207.018667-168.448 375.466667-375.466667 375.466667-27.818667 0-27.818667 0-54.340266-2.901333-90.453333-9.898667-152.610133-58.9824-155.5456-61.201067a375.330133 375.330133 0 0 1-165.5808-311.364267c0-201.4208 159.5392-365.841067 358.843733-374.647466l-41.984 40.823466 0.8192 0.853334a33.860267 33.860267 0 0 0-15.2576 29.218133c0.750933 18.978133 16.725333 33.757867 35.669333 33.041067a33.792 33.792 0 0 0 26.0096-14.472534l0.3072 0.341334 128.648534-124.996267L515.6864 34.0992l-0.4096 0.4096a33.6896 33.6896 0 0 0-26.3168-11.400533c-18.944 0.750933-33.6896 16.725333-32.9728 35.703466a33.8944 33.8944 0 0 0 13.038933 25.156267l45.226667 45.2608C275.182933 135.714133 82.602667 331.741867 82.602667 572.347733c0 147.626667 73.1136 285.149867 193.194666 366.114134 3.072 2.56 77.550933 62.190933 188.757334 74.308266 29.422933 3.208533 31.1296 3.310933 61.781333 3.310934 244.667733 0 443.733333-199.0656 443.733333-443.733334A443.392 443.392 0 0 0 773.597867 203.776" p-id="1185" fill="#696a6a"></path><path d="M542.071467 400.827733a33.28 33.28 0 0 0-17.134934 6.075734l-0.170666-0.3072-106.8032 69.700266 0.170666 0.273067a33.9968 33.9968 0 0 0-15.837866 29.696c0.750933 18.944 16.725333 33.723733 35.669333 32.9728a33.109333 33.109333 0 0 0 17.1008-6.0416l0.2048 0.273067 53.998933-35.259734v249.856h0.034134c0 0.477867-0.238933 0.887467-0.2048 1.365334a34.2016 34.2016 0 1 0 68.4032-1.365334h0.034133v-0.170666c0-0.4096 0.2048-0.750933 0.2048-1.160534 0-0.273067-0.170667-0.477867-0.2048-0.785066V435.2c0-0.477867 0.2048-0.887467 0.2048-1.3312a34.4064 34.4064 0 0 0-35.669333-33.041067" p-id="1186" fill="#696a6a"></path></svg>
          <svg style="vertical-align: sub;" v-show="modeIcon == 'suijibofang'" t="1597065107946" class="icon" viewBox="0 0 1063 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="894" width="20" height="20"><path d="M911.478154 682.653538a38.990769 38.990769 0 0 0-30.326154-13.115076c-21.897846 0.827077-38.912 19.298462-38.084923 41.196307 0.472615 11.933538 6.380308 22.055385 14.966154 28.987077l47.182769 47.222154a289.201231 289.201231 0 0 1-139.264-61.794462L331.697231 257.063385A369.388308 369.388308 0 0 0 53.956923 131.150769a39.384615 39.384615 0 1 0 0 78.769231h0.039385c83.652923 0 163.249231 36.115692 219.214769 99.879385l433.624615 468.007384 8.27077 7.483077a369.664 369.664 0 0 0 194.048 81.762462l-52.539077 51.081846 0.984615 0.945231a39.069538 39.069538 0 0 0-17.604923 33.71323c0.866462 21.897846 19.298462 38.990769 41.156923 38.124308a38.912 38.912 0 0 0 29.971692-16.699077l0.393846 0.393846 148.48-144.226461-148.046769-148.204308-0.472615 0.472615z" p-id="895" fill="#696a6a"></path><path d="M911.163077 30.759385a38.990769 38.990769 0 0 0-30.011077-16.699077 39.660308 39.660308 0 0 0-41.117538 38.124307 38.990769 38.990769 0 0 0 17.604923 33.673847l-0.984616 1.024 48.600616 47.261538a366.08 366.08 0 0 0-217.481847 106.259692l-128.551384 139.34277 0.196923 0.196923a38.990769 38.990769 0 0 0-10.633846 26.505846 39.384615 39.384615 0 0 0 39.384615 39.384615 38.990769 38.990769 0 0 0 28.750769-12.878769l0.196923 0.196923 126.582154-137.294769a287.665231 287.665231 0 0 1 166.675693-82.944l-52.224 52.302769a39.108923 39.108923 0 0 0-15.044923 29.026462c-0.866462 21.897846 16.147692 40.329846 38.045538 41.196307a38.990769 38.990769 0 0 0 30.326154-13.115077l0.472615 0.433231 148.046769-148.164923-148.48-144.226462-0.393846 0.393847zM415.783385 554.889846a38.872615 38.872615 0 0 0-28.672 12.760616l-0.196923-0.157539-133.750154 144.265846A289.201231 289.201231 0 0 1 53.956923 790.843077v0.472615c-0.866462-0.039385-1.575385-0.472615-2.441846-0.472615a39.384615 39.384615 0 1 0 0 78.769231c0.866462 0 1.575385-0.472615 2.441846-0.472616v0.472616c94.562462 0 184.516923-35.721846 255.094154-102.4l135.601231-146.156308-0.196923-0.157538a38.872615 38.872615 0 0 0 10.712615-26.624 39.384615 39.384615 0 0 0-39.384615-39.384616" p-id="896" fill="#696a6a"></path></svg>
        </span>
      </div>

      <ul>
        <li class="menu-item" @click="showMain">
          <a-icon type="desktop" />
          <span>显示主界面</span>
        </li>
        <li class="menu-item" :class="{'disabled' : !showDesktoplyric}" @click="doLyric(false)" v-if="isFixed">
          <z-icon type="geci" />
          <span>解锁桌面歌词</span>
        </li>
        <li class="menu-item" :class="{'disabled' : !showDesktoplyric}" @click="doLyric(true)" v-else>
          <z-icon type="geci" />
          <span>锁定桌面歌词</span>
        </li>
        <li class="menu-item" :class="{'disabled' : !showDesktopView}" @click="doView(false)" v-if="viewIsFixed">
          <z-icon type="geci" />
          <span>解锁桌面动效</span>
        </li>
        <li class="menu-item" :class="{'disabled' : !showDesktopView}" @click="doView(true)" v-else>
          <z-icon type="geci" />
          <span>锁定桌面动效</span>
        </li>
        <li class="menu-item" @click="restart">
          <a-icon type="sync" />
          <span>重启</span>
        </li>
        <li class="menu-item quit" @click="quit">
          <a-icon type="poweroff" />
          <span>退出像素音乐</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ZIcon from '@/components/ZIcon'
import ProgressBar from '@/components/Common/progressBar'
import ls from 'store'
import { playMode } from '@/config/config'
import config from '@/config/defaultSettings'
export default {
  name: 'tray',
  data () {
    return {
      isFixed: false,
      curVolume: 0,   // 暂存当前音量，用于从静音开启时的初始音量
      playing: false,
      current_song_index: 0,
      isMuted: false,
      showDesktoplyric: false,
      volume: 1,
      mode: playMode.sequence,
      current_play_list: [],
      viewIsFixed: false,
      showDesktopView: false
    }
  },
  components: { ZIcon, ProgressBar },
  mounted () {
    this.curVolume = this.volume
    this.$electron.ipcRenderer.on('change-color', (e, data) => {
      if (data.color == '#222225') { // 酷黑皮肤
        this.updateTheme(data.color, '#ba8622')
      } else {
        this.updateTheme(data.color)
      }
    })
    this.$electron.ipcRenderer.on('toggle-play2', (e, data) => {
      this.playing = data.value
    })
    this.$electron.ipcRenderer.on('change-play-index', (e, data) => {
      this.current_song_index = data.index
    })
    this.$electron.ipcRenderer.on('set-muted', (e, data) => {
      this.isMuted = data.value
    })
    this.$electron.ipcRenderer.on('toggle-desktop-lyric', (e, data) => {
      this.showDesktoplyric = data.value
    })
    this.$electron.ipcRenderer.on('toggle-desktop-view', (e, data) => {
      this.showDesktopView = data.value
    })
    this.$electron.ipcRenderer.on('set-volume', (e, data) => {
      this.volume = data.value
    })
    this.$electron.ipcRenderer.on('set-mode', (e, data) => {
      this.mode = data.value
    })
    this.$electron.ipcRenderer.on('set-play-list', (e, data) => {
      this.current_play_list = data.value
    })
    this.$electron.ipcRenderer.on('fix-desktop-view', (e, data) => {
      this.viewIsFixed = data
    })
    this.$electron.ipcRenderer.on('fix-desktop-lyric', (e, data) => {
      this.isFixed = data
    })
    this.$electron.ipcRenderer.send('tray-ready')
  },
  created () {
    let key = process.env.NODE_ENV === 'development'
      ? `${window.location.origin}/less/color.less`
      : Object.keys(localStorage).find(item => item.endsWith('color.less')) || `app://./less/color.less`
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
        if (this.primaryColor == '#222225') { // 酷黑皮肤
          this.updateTheme(this.primaryColor, '#ba8622')
        } else {
          this.updateTheme(this.primaryColor)
        }
      }
    }
  },
  computed: {
    current_song () {
      return this.current_play_list[ this.current_song_index ] || {}
    },
    playIcon () {
      return this.playing ? 'pause-circle' : 'play-circle'
    },
    mutedIcon () {
      return this.isMuted ? 'muted' : 'no-muted'
    },
    modeIcon () {
      return this.mode === playMode.sequence
        ? 'liebiaoxunhuan'
        : this.mode === playMode.loop
          ? 'danquxunhuan1'
          : 'suijibofang'
    },
    modeTitle () {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.loop
          ? '循环播放'
          : '随机播放'
    },
    playTitle () {
      return this.playing ? '暂停' : '播放'
    }
  },
  methods: {
    onMuted () {
      this.volume = !this.isMuted ? 0 : this.curVolume
      this.$electron.ipcRenderer.send('set-volume', {
        value: this.volume
      })
      this.$electron.ipcRenderer.send('set-muted', {
        value: !this.isMuted
      })
      this.isMuted = !this.isMuted
    },
    onvolumeChanged (persent) {
      if (persent <= 0) { // 音量调整至0或以下时
        persent = 0
        // 改变静音状态为true
        this.isMuted = true
        this.$electron.ipcRenderer.send('set-muted', {
          value: true
        })
      } else { // 音量调整至0以上时
        if (persent > 1) persent = 1
        this.curVolume = Number(persent)
        // 改变静音状态为false
        this.isMuted = false
        this.$electron.ipcRenderer.send('set-muted', {
          value: false
        })
      }
      this.volume = Number(persent)
      this.$electron.ipcRenderer.send('set-volume', {
        value: Number(persent)
      })
    },
    backward () {
      this.$electron.ipcRenderer.send('prev-play', {
        value: this.current_song_index
      })
    },
    forward () {
      this.$electron.ipcRenderer.send('next-play', {
        value: this.current_song_index
      })
    },
    togglePlay () {
      this.$electron.ipcRenderer.send('toggle-play', {
        value: !this.playing
      })
      this.playing = !this.playing
    },
    restart () {
      this.$electron.ipcRenderer.send('restart')
    },
    quit () {
      this.$electron.ipcRenderer.send('window-close')
    },
    showMain () {
      this.$electron.ipcRenderer.send('show-window')
    },
    changeMode () {
      let mode = this.mode
      mode = ++mode % Object.keys(playMode).length
      this.mode = mode
      this.$electron.ipcRenderer.send('set-mode', {
        value: mode
      })
    },
    doLyric (flag) {
      if (!this.showDesktoplyric) return
      this.isFixed = flag
      this.$electron.ipcRenderer.send('fix-desktop-lyric', this.isFixed)
    },
    doView (flag) {
      if (!this.showDesktopView) return
      this.viewIsFixed = flag
      this.$electron.ipcRenderer.send('fix-desktop-view', this.viewIsFixed)
    },
    updateTheme (primaryColor, textColor = '#000') {
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
            if ( item.endsWith('color.less') || item.endsWith('color.less:timestamp') || item.endsWith('color.less:vars') ) {
              localStorage.removeItem(item)
            }
          })
          window.less
            .modifyVars({
              '@primary-color': primaryColor,
              '@text-color': textColor
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
        lessStyleNode.setAttribute('href', `less/color.less`)
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
.tray {
  position: relative;
  width: 200px;
  height: 390px;
  z-index: 9999999;
  opacity: .97;
  .tray-box {
    position: absolute;
    left: 8px;
    top: 8px;
    right: 8px;
    bottom: 8px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    .control-box {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      padding: 0 15px;
      .control-icon {
        background: @primary-color;
        width: 36px;
        height: 36px;
        font-size: 44px;
        color: rgba(0, 0, 0, 0.7);
        cursor: pointer;
        &:hover {
          color: rgba(0, 0, 0, 1);
        }
        &.step {
          width: 32px;
          height: 32px;
          font-size: 18px;
        }
      }
    }
    .song-box {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      .song-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #222;
        font-size: 14px;
      }
      .play-mode {
        flex: 0 0 24px;
        color: #666;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .volume-box {
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      .bar-volume {
        margin-left: 4px;
      }
    }
    .menu-item {
      height: 42px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      color: #222;
      font-size: 14px;
      cursor: pointer;
      &.disabled {
        color: #999;
      }
      &:hover {
        background: #f3f5f9;
      }
      &.quit {
        border-top: 1px solid #ddd;
        margin: 4px 0;
      }
      .anticon {
        margin-right: 15px;
      }
    }
  }
}
</style>
