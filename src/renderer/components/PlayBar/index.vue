<template>
  <div class="player" :class="{ 'dark-back1': isDark }">
    <div class="bar1" :class="disableCls">
      <template v-if="!isDark">
        <img src="./../../assets/images/next_icon.png" @click="backward" class="step-icon" style="transform:rotate(180deg)"/>
        <img src="./../../assets/images/pause_icon.png" @click="togglePlay" class="play-icon" v-show='playing' />
        <img src="./../../assets/images/play_icon.png" @click="togglePlay" class="play-icon" v-show='!playing' />
        <img src="./../../assets/images/next_icon.png" @click="forward" class="step-icon"/>
      </template>
      <template v-else>
        <img src="./../../assets/images/next_icon_dark.png" @click="backward" class="step-icon" style="transform:rotate(180deg)"/>
        <img src="./../../assets/images/pause_icon_dark.png" @click="togglePlay" class="play-icon" v-show='playing' />
        <img src="./../../assets/images/play_icon_dark.png" @click="togglePlay" class="play-icon" v-show='!playing' />
        <img src="./../../assets/images/next_icon_dark.png" @click="forward" class="step-icon"/>
      </template>
    </div>
    <div class="bar2">
      <time class="time">{{currentTime | duration}}</time>
      <progress-bar
        :percent="percent"
        :waiting="waiting"
        @percentChanged="onpercentChanged"
        @percentChanging="onpercentChanged"
        @virtualBarMove="onVirtualBarMove"
        @virtualBarLeave="onVirtualBarLeave"
      />
      <time class="time">{{current_song.duration | duration}}</time>
    </div>
    <div class="bar3">
      <z-icon :type="mutedIcon" @click.native="onMuted" :title="mutedTitle" class="playbar-vloumn_icon" />
      <progress-bar :percent="volume" size="small" @percentChanged="onvolumeChanged" class="bar-volume"/>
      <audio
        crossOrigin="anonymous"
        :id="source"
        ref="audio"
        preload="auto"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnd"
        @timeupdate="updateTime"
        @waiting="onWaiting"
        @playing="onPlaying"
        @error="onError"
      />
    </div>
    <div class="bar4">
      <a-tooltip :title="modeText">
        <a @click="changeMode" style="color: #fff">
          <svg style="vertical-align: middle" v-show="modeIcon == 'liebiaoxunhuan'" t="1597065220042" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1666" width="20" height="20"><path d="M905.615621 524.965532c0-132.931319-65.364876-256.560237-174.885151-331.940698v-0.031008c-1.24032-0.868224-2.356608-1.922496-3.627936-2.790721l-0.248064 0.403105a30.573893 30.573893 0 0 0-18.480771-5.891522 31.256069 31.256069 0 0 0-29.953734 32.465382 30.635909 30.635909 0 0 0 14.232675 24.341284l-0.124032 0.186049a340.839996 340.839996 0 0 1 151.071002 283.289137c0 185.272833-148.559354 336.188795-332.777914 340.653948l39.194119-39.194119a30.759941 30.759941 0 0 0 11.752034-22.821892 31.225061 31.225061 0 0 0-29.953734-32.465381 30.728933 30.728933 0 0 0-23.876164 10.356673l-0.372096-0.372096-116.5901 116.652117 116.90018 113.582324 0.31008-0.31008a30.697925 30.697925 0 0 0 23.6281 13.147394 31.256069 31.256069 0 0 0 32.403366-30.015749 30.914981 30.914981 0 0 0-13.860578-26.542853l0.744192-0.7752-40.341415-39.225127c218.451398-4.434145 394.855941-183.164288 394.855941-402.669959M487.410652 184.652672l-38.139847 37.085575 0.744192 0.7752a30.759941 30.759941 0 0 0-13.860578 26.542853c0.682176 17.240451 15.162915 30.697925 32.403365 29.984741a30.697925 30.697925 0 0 0 23.628101-13.116386l0.279072 0.31008 116.869172-113.582324-116.528084-116.590101-0.372096 0.31008a30.697925 30.697925 0 0 0-23.907173-10.325665c-17.209443 0.651168-30.604901 15.193923-29.953733 32.434373a30.945989 30.945989 0 0 0 11.876066 22.883908l41.054599 41.085608C274.323638 128.373143 99.407479 306.42111 99.407479 524.99654c0 134.109624 66.450156 259.071886 177.675872 334.266299l34.728966-51.411273a340.964028 340.964028 0 0 1-150.388827-282.855026c0-182.947232 144.931417-332.343802 325.987162-340.343868" p-id="1667" :fill="darkIconColor"></path></svg>
          <svg style="vertical-align: middle;" v-show="modeIcon == 'danquxunhuan1'" t="1597065180245" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1184" width="20" height="20"><path d="M773.597867 203.776l-0.273067 0.443733a33.621333 33.621333 0 0 0-20.343467-6.485333c-18.978133 0.785067-33.723733 16.725333-32.9728 35.771733a33.826133 33.826133 0 0 0 15.633067 26.794667l-0.1024 0.170667a375.227733 375.227733 0 0 1 166.2976 311.876266c0 207.018667-168.448 375.466667-375.466667 375.466667-27.818667 0-27.818667 0-54.340266-2.901333-90.453333-9.898667-152.610133-58.9824-155.5456-61.201067a375.330133 375.330133 0 0 1-165.5808-311.364267c0-201.4208 159.5392-365.841067 358.843733-374.647466l-41.984 40.823466 0.8192 0.853334a33.860267 33.860267 0 0 0-15.2576 29.218133c0.750933 18.978133 16.725333 33.757867 35.669333 33.041067a33.792 33.792 0 0 0 26.0096-14.472534l0.3072 0.341334 128.648534-124.996267L515.6864 34.0992l-0.4096 0.4096a33.6896 33.6896 0 0 0-26.3168-11.400533c-18.944 0.750933-33.6896 16.725333-32.9728 35.703466a33.8944 33.8944 0 0 0 13.038933 25.156267l45.226667 45.2608C275.182933 135.714133 82.602667 331.741867 82.602667 572.347733c0 147.626667 73.1136 285.149867 193.194666 366.114134 3.072 2.56 77.550933 62.190933 188.757334 74.308266 29.422933 3.208533 31.1296 3.310933 61.781333 3.310934 244.667733 0 443.733333-199.0656 443.733333-443.733334A443.392 443.392 0 0 0 773.597867 203.776" p-id="1185" :fill="darkIconColor"></path><path d="M542.071467 400.827733a33.28 33.28 0 0 0-17.134934 6.075734l-0.170666-0.3072-106.8032 69.700266 0.170666 0.273067a33.9968 33.9968 0 0 0-15.837866 29.696c0.750933 18.944 16.725333 33.723733 35.669333 32.9728a33.109333 33.109333 0 0 0 17.1008-6.0416l0.2048 0.273067 53.998933-35.259734v249.856h0.034134c0 0.477867-0.238933 0.887467-0.2048 1.365334a34.2016 34.2016 0 1 0 68.4032-1.365334h0.034133v-0.170666c0-0.4096 0.2048-0.750933 0.2048-1.160534 0-0.273067-0.170667-0.477867-0.2048-0.785066V435.2c0-0.477867 0.2048-0.887467 0.2048-1.3312a34.4064 34.4064 0 0 0-35.669333-33.041067" p-id="1186" :fill="darkIconColor"></path></svg>
          <svg style="vertical-align: middle;" v-show="modeIcon == 'suijibofang'" t="1597065107946" class="icon" viewBox="0 0 1063 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="894" width="20" height="20"><path d="M911.478154 682.653538a38.990769 38.990769 0 0 0-30.326154-13.115076c-21.897846 0.827077-38.912 19.298462-38.084923 41.196307 0.472615 11.933538 6.380308 22.055385 14.966154 28.987077l47.182769 47.222154a289.201231 289.201231 0 0 1-139.264-61.794462L331.697231 257.063385A369.388308 369.388308 0 0 0 53.956923 131.150769a39.384615 39.384615 0 1 0 0 78.769231h0.039385c83.652923 0 163.249231 36.115692 219.214769 99.879385l433.624615 468.007384 8.27077 7.483077a369.664 369.664 0 0 0 194.048 81.762462l-52.539077 51.081846 0.984615 0.945231a39.069538 39.069538 0 0 0-17.604923 33.71323c0.866462 21.897846 19.298462 38.990769 41.156923 38.124308a38.912 38.912 0 0 0 29.971692-16.699077l0.393846 0.393846 148.48-144.226461-148.046769-148.204308-0.472615 0.472615z" p-id="895" :fill="darkIconColor"></path><path d="M911.163077 30.759385a38.990769 38.990769 0 0 0-30.011077-16.699077 39.660308 39.660308 0 0 0-41.117538 38.124307 38.990769 38.990769 0 0 0 17.604923 33.673847l-0.984616 1.024 48.600616 47.261538a366.08 366.08 0 0 0-217.481847 106.259692l-128.551384 139.34277 0.196923 0.196923a38.990769 38.990769 0 0 0-10.633846 26.505846 39.384615 39.384615 0 0 0 39.384615 39.384615 38.990769 38.990769 0 0 0 28.750769-12.878769l0.196923 0.196923 126.582154-137.294769a287.665231 287.665231 0 0 1 166.675693-82.944l-52.224 52.302769a39.108923 39.108923 0 0 0-15.044923 29.026462c-0.866462 21.897846 16.147692 40.329846 38.045538 41.196307a38.990769 38.990769 0 0 0 30.326154-13.115077l0.472615 0.433231 148.046769-148.164923-148.48-144.226462-0.393846 0.393847zM415.783385 554.889846a38.872615 38.872615 0 0 0-28.672 12.760616l-0.196923-0.157539-133.750154 144.265846A289.201231 289.201231 0 0 1 53.956923 790.843077v0.472615c-0.866462-0.039385-1.575385-0.472615-2.441846-0.472615a39.384615 39.384615 0 1 0 0 78.769231c0.866462 0 1.575385-0.472615 2.441846-0.472616v0.472616c94.562462 0 184.516923-35.721846 255.094154-102.4l135.601231-146.156308-0.196923-0.157538a38.872615 38.872615 0 0 0 10.712615-26.624 39.384615 39.384615 0 0 0-39.384615-39.384616" p-id="896" :fill="darkIconColor"></path></svg>
        </a>
      </a-tooltip>
      <a @click="showMusicView" title="沉浸模式">
        <img src="./../../assets/images/inView.png" />
      </a>
      <a @click="toggleCurrentLyric"  class="lrc" :title="showDesktoplyric ? '桌面歌词：开' : '桌面歌词：关'">
        <img src="./../../assets/images/lyric.png"  v-show='!showDesktoplyric' />
        <img src="./../../assets/images/lyric2.png" v-show='showDesktoplyric' class="background-active" />
      </a>
      <a @click="toggleTransShow"  class="tran" :title="show_trans ? '翻译：开' : '翻译：关'">
        <img src="./../../assets/images/trans.png"  v-show='!show_trans' />
        <img src="./../../assets/images/trans2.png" v-show='show_trans' class="background-active" />
      </a>
      <a @click="toggleDesktopView"  class="view" :title="showDesktopView ? '桌面动效：开' : '桌面动效：关'">
        <img src="./../../assets/images/view.png"  v-show='!showDesktopView' />
        <img src="./../../assets/images/view2.png" v-show='showDesktopView' class="background-active" />
      </a>
      <a @click="showDrawer"  class="count-wrapper" title="播放列表">
        <img src="./../../assets/images/list.png" />
      </a>
    </div>

    <span class="resize"></span>

    <a-drawer placement="right" wrapClassName="play-history" :width="550" :closable="false" :visible="visible" @close="closeDrawer">
      <div class="play-history-title" slot="title" :class="{ 'dark-back2': isDark }">
        <a-radio-group v-model="playComponent" buttonStyle="solid">
          <a-radio-button value="current-play-table">播放列表</a-radio-button>
          <a-radio-button value="history-play-table">历史记录</a-radio-button>
        </a-radio-group>
      </div>
      <component :is="playComponent"></component>
    </a-drawer>
  </div>
</template>

<script>
import fs from 'fs'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/config/config'
import { getRandomInt } from '@/utils/calculate.js'
import { getUrl } from '@/utils/song'
import { getLyric } from '@/api/song'
import Lyric from '@/utils/class/Lyric.js'
import ProgressBar from '@/components/Common/progressBar'
import TrackList from '@/components/Common/track-list/index.js'
import ZIcon from '@/components/ZIcon'
import Drag from '@/components/Common/drag'
import CurrentPlayTable from './CurrentPlayTable'
import HistoryPlayTable from './HistoryPlayTable'

export default {
  name: 'player',
  data () {
    return {
      currentTime: 0,
      visible: false,
      lyricInstance: null,
      buffered: 0,
      playComponent: 'current-play-table',
      autoplay: false,
      // isMuted: false,
      isSongReady: false,
      isFirstPlay: false,
      waiting: false,
      curVolume: 0,
      randomHistoryIndexArr: [], // 在随机模式下存储历史记录，用于歌曲播放回退时寻路
      needSync: true // 标识是否需要同步播放器状态，当状态改变的来源是其他窗口时不能同步，否则会造成死循环
    }
  },
  components: {
    ProgressBar,
    Drag,
    ZIcon,
    TrackList,
    HistoryPlayTable,
    CurrentPlayTable
  },
  computed: {
    ...mapState(['play']),
    ...mapGetters('play', [
      'mode',
      'current_song_index',
      'current_play_list',
      'playing',
      'current_song',
      'history_play_list',
      'fullscreen',
      'lyric',
      'trans',
      'source',
      'volume',
      'isMuted',
      'show_trans',
      'showDesktoplyric',
      'showDesktopView',
      'privateFm'
    ]),
    ...mapGetters('App', ['isOnliline', 'isDark']),
    ...mapGetters('Localsong', ['localSongs']),
    ...mapGetters('Download', ['downloaded']),
    playIcon () {
      return this.playing ? './../../assets/images/pause_icon.png' : './../../assets/images/play_icon.png'
    },
    mutedIcon () {
      return this.isMuted ? 'muted' : 'no-muted'
    },
    mutedTitle () {
      return this.isMuted ? '取消静音' : '静音'
    },
    modeIcon () {
      return this.mode === playMode.sequence
        ? 'liebiaoxunhuan'
        : this.mode === playMode.loop
          ? 'danquxunhuan1'
          : 'suijibofang'
    },
    modeText () {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.loop
          ? '循环播放'
          : '随机播放'
    },
    percent () {
      return this.currentTime / this.current_song.duration
    },
    // bufferedPercent () {
    //   return this.buffered / this.current_song.duration
    // },
    disableCls () {
      return this.isSongReady ? '' : 'disable'
    },
    darkIconColor () {
      return this.isDark ? '#7a7a7c' : '#545456'
    }
  },
  watch: {
    playing (newVal, oldVal) {
      const audio = this.$refs.audio

      // 通知主进程,同步任务栏控制按钮的状态
      this.$electron.ipcRenderer.send('thumbar-buttons', {
        playing: newVal
      })
      if (newVal) {
        this.$nextTick(() => {
          audio.play()
        })
        if (!this.lyricInstance) {
          if (this.current_song.folder) {
            this.getLocalLyric(this.current_song)
          } else {
            this.getOnlineLyric(this.current_song)
          }
        }
        this.lyricInstance && this.lyricInstance.play()
      } else {
        audio.pause()
        this.lyricInstance && this.lyricInstance.stop()
      }
    },
    volume (newVal) {
      const audio = this.$refs.audio
      newVal = Number(newVal)
      if (newVal == 0) {
        this.$store.commit('play/SET_MUTED', true)
        this.$electron.ipcRenderer.send('set-muted', {
          value: true
        })
      }
      this.$nextTick(() => {
        audio.volume = newVal
      })
    },
    isMuted (newVal) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        if (newVal) {
          audio.volume = 0
        } else {
          audio.volume = this.volume
        }
      })
    },
    source (newVal) {
      this.$electron.ipcRenderer.send('change-source', { value: newVal })
    },
    current_song: 'handleSongChange',
    current_play_list () { // 切换列表或双击了本列表的歌曲之后，随机历史都会清空
      this.randomHistoryIndexArr = []
    }
  },
  mounted () {
    this.curVolume = this.volume
    this.$electron.ipcRenderer.on('toggle-play', (e, data) => {
      this.needSync = false
      this.$store.commit('play/SET_PLAY_STATUS', data.value)
      this.lyricInstance && this.lyricInstance.togglePlay()
    })
    this.$electron.ipcRenderer.on('play-song', (e, data) => {
      this.$store.dispatch('play/selectPlay', data.value)
    })
    this.$electron.ipcRenderer.on('prev-play', (e, data) => {
      this.backward()
    })
    this.$electron.ipcRenderer.on('next-play', (e, data) => {
      this.forward()
    })
    this.$electron.ipcRenderer.on('set-muted', (e, data) => {
      this.$store.commit('play/SET_MUTED', data.value)
    })
    this.$electron.ipcRenderer.on('set-volume', (e, data) => {
      this.$store.commit('play/SET_VOLUME', data.value)
    })
    this.$electron.ipcRenderer.on('set-mode', (e, data) => {
      this.$store.commit('play/SET_MODE', data.value)
    })
    this.$electron.ipcRenderer.on('like-song', (e, data) => {
      this.$store.dispatch('User/handleLikeSong', { song: data.song, isLike: data.isLike, self: this })
    })
      // init other window's data
    this.$electron.ipcRenderer.on('view-ready', (e, data) => {
      if (this.$store.getters['play/showDesktopView']) {
        this.$electron.ipcRenderer.send('toggle-desktop-view', this.$store.getters['play/showDesktopView'])
      }
      if (this.showDesktoplyric) {
        this.$electron.ipcRenderer.send('toggle-desktop-lyric', this.showDesktoplyric)
      }
      this.$electron.ipcRenderer.send('change-color2', this.$store.getters['App/primaryColor'])
      this.$electron.ipcRenderer.send('change-source', { value: this.$store.getters['play/source'] })
      this.$electron.ipcRenderer.send('show-trans', { value: this.$store.getters['play/show_trans'] })
      this.$electron.ipcRenderer.send('change-play-index', { index: this.$store.getters['play/current_song_index'] })
      this.$electron.ipcRenderer.send('set-muted', { value: this.$store.getters['play/isMuted'] })
      this.$electron.ipcRenderer.send('set-volume', { value: this.$store.getters['play/volume'] })
      this.$electron.ipcRenderer.send('set-mode', { value: this.$store.getters['play/mode'] })
      this.$electron.ipcRenderer.send('set-play-list', { value: this.$store.getters['play/current_play_list'] })
      this.$electron.ipcRenderer.send('set-like-song-ids', { value: this.$store.getters['User/likedsongIds'] })
    })
    if (Object.keys(this.current_song).length) {
      if (this.current_song.folder && this.current_song.url) { // local song
        this.$refs.audio.src = this.current_song.url
        this.isSongReady = true
      } else {
        if (!this.isOnliline) return
        this.getOnlineSong(this.current_song).then(songUrl => {
          if (songUrl) {
            this.$store.commit('play/SET_SOURCE', songUrl)
            this.$refs.audio.src = songUrl
            this.isSongReady = true
          } else {
            this.$message.error('暂无资源')
            this.$store.commit('play/SET_SOURCE', '')
            this.$store.commit('play/SET_PLAY_STATUS', false)
            this.isSongReady = true
            if (!this.lyricInstance) {
              if (this.current_song.folder) {
                this.getLocalLyric(this.current_song)
              } else {
                this.getOnlineLyric(this.current_song)
              }
            }
            this.lyricInstance && this.resetLyric()
          }
        }).catch( () => {
          this.$message.error('暂无资源')
          this.$store.commit('play/SET_SOURCE', '')
          this.$store.commit('play/SET_PLAY_STATUS', false)
          this.isSongReady = true
          this.lyricInstance && this.resetLyric()
        })
      }
    }
  },
  methods: {
    async handleSongChange (newSong, oldSong) {
      if (!newSong.id || (oldSong && (newSong.id === oldSong.id))) return
      this.isSongReady = false
      if (newSong.folder) { // 如果是本地歌曲
        if (!fs.existsSync(newSong.url)) { // 文件不存在
          this.$message.error(`歌曲文件${newSong.url}已被删除`)
          this.$store.commit('play/SET_SOURCE', '')
          this.$store.commit('play/SET_PLAY_STATUS', false)
          if (this.needSync) {
            this.$electron.ipcRenderer.send('toggle-play2', {
              value: false
            })
          } else {
            this.needSync = true
          }
          this.$store.commit('play/REMOVE_SONG', this.current_song_index)
          this.isSongReady = true
          this.lyricInstance && this.resetLyric()
          return
        }
        this.$store.commit('play/SET_SOURCE', newSong.url)
        // this.$refs.audio.src = ''
        this.$refs.audio.src = newSong.url
        this.$electron.ipcRenderer.send('toggle-play2', {
          value: true
        })
        this.$store.commit('play/SET_PLAY_STATUS', true)
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
        this.getLocalLyric(newSong)
      } else {
        this.$refs.audio.pause()
        this.getOnlineSong(newSong).then(songUrl => {
          if (songUrl) {
            this.$store.commit('play/SET_SOURCE', songUrl)
            // this.$refs.audio.src = ''
            this.$refs.audio.src = songUrl
            this.$electron.ipcRenderer.send('toggle-play2', {
              value: true
            })
            this.$store.commit('play/SET_PLAY_STATUS', true)
            this.$nextTick(() => {
              this.$refs.audio.play()
            })
            this.getOnlineLyric(newSong)
          } else {
            this.$message.error('暂无资源')
            this.$store.commit('play/SET_SOURCE', '')
            this.$store.commit('play/SET_PLAY_STATUS', false)
            if (this.needSync) {
              this.$electron.ipcRenderer.send('toggle-play2', {
                value: false
              })
            } else {
              this.needSync = true
            }
            this.$store.commit('play/REMOVE_SONG', this.current_song_index)
            this.isSongReady = true
            this.lyricInstance && this.resetLyric()
          }
        }).catch(error => {
          console.log(`获取歌曲播放链接失败:${error}`)
          this.$message.error('暂无资源')
          this.$store.commit('play/SET_SOURCE', '')
          this.$store.commit('play/SET_PLAY_STATUS', false)
          if (this.needSync) {
            this.$electron.ipcRenderer.send('toggle-play2', {
              value: false
            })
          } else {
            this.needSync = true
          }
          this.$store.commit('play/REMOVE_SONG', this.current_song_index)
          // this.$store.commit('play/SET_CURRENT_INDEX', this.current_song_index - 1)
          this.isSongReady = true
          this.lyricInstance && this.resetLyric()
        })
      }
    },
    getOnlineSong (song) {
      return new Promise(async (resolve, reject) => {
        // 先从本地音乐中寻找有没有本地的源
        let index = this.localSongs.findIndex(item => {
          return item.id == song.id
        })
        if (index >= 0) {
          resolve(this.localSongs[index].url)
          return
        }
        index = this.downloaded.findIndex(item => {
          return item.id == song.id
        })
        if (index >= 0) {
          resolve(this.downloaded[index].url)
          return
        }
        try {
          let songUrl = await getUrl(song.id)
          resolve(songUrl)
        } catch (error) {
          reject(error)
        }
      })
    },
    // 根据歌名搜索歌词,后期根据检索的本地记录与下载记录匹配出id进行查询
    getLocalLyric (song) {
      this.$db.lyric.findOne({ songId: song.id }, async (err, doc) => {
        if (!err) {
          let lyric = ''
          let trans = ''
          if (!doc) {
            if (song.matched) { // check whether the song is matched online
              console.log('song lyric searching...')
              await this.getOnlineLyric(song, true) // try to get lyric online
              return
            } else {
              lyric = '[00:00.000] 暂无歌词，请尝试匹配音乐' // no lyric until match the song
              trans = ''
            }
          } else {
            lyric = doc.lyric
            trans = doc.trans
          }
          this.lyricInstance && this.resetLyric()
          this.getLyricInstance(trans, lyric)
          if (this.playing) {
            this.lyricInstance.play()
          }
          this.lyricInstance.seek(this.currentTime * 1000)
        }
      })
    },
    async getOnlineLyric (song, flag = false) {
      if (flag) {
            let lyric = ''
            let trans = ''
            try {
              let res = await getLyric(song.id) // try to download lyric online
              if (res.nolyric) { // no tyric
                lyric = '[00:00.000] 此歌曲为纯音乐，请您欣赏'
              } else {
                lyric = (res.lrc && res.lrc.lyric) || '[00:00.000] 此歌曲为纯音乐，请您欣赏'
                trans = res.tlyric.lyric || ''
              }
              this.lyricInstance && this.resetLyric()
              this.getLyricInstance(trans, lyric)
              if (this.playing) {
                this.lyricInstance.play()
              }
              this.lyricInstance.seek(this.currentTime * 1000)
              let record = {
                songId: song.id,
                name: song.name,
                lyric: lyric,
                trans: trans
              }
              this.$db.lyric.insert(record, (err, doc) => {
                if (!err) {
                  console.log('歌词下载成功')
                } else {
                  console.log('歌词下载失败')
                }
              })
            } catch (e) {
              console.log('catch err', e)
              this.lyricInstance = null
              this.$store.commit('play/SET_LYRIC', null)
              this.$store.commit('play/SET_TRANS', null)
              this.$electron.ipcRenderer.send('change-lyric', { lyric: null, trans: null })
              this.$store.commit('play/SET_CURRENT_LYRIC_LINE', 0)
            }
            this.lyricInstance && this.resetLyric()
            this.getLyricInstance(trans, lyric)
            if (this.playing) {
              this.lyricInstance.play()
            }
            this.lyricInstance.seek(this.currentTime * 1000)
            return
      }
      this.$db.lyric.findOne({ songId: song.id }, async (err, doc) => {
        if (!err) {
          let lyric = ''
          let trans = ''
          if (!doc) { // can not find the lyric in db
            try {
              let res = await getLyric(song.id) // try to download lyric online
              if (res.nolyric) { // no tyric
                lyric = '[00:00.000] 此歌曲为纯音乐，请您欣赏'
              } else {
                lyric = (res.lrc && res.lrc.lyric) || '[00:00.000] 此歌曲为纯音乐，请您欣赏'
                trans = res.tlyric.lyric || ''
              }
              this.lyricInstance && this.resetLyric()
              this.getLyricInstance(trans, lyric)
              if (this.playing) {
                this.lyricInstance.play()
              }
              this.lyricInstance.seek(this.currentTime * 1000)
              let record = {
                songId: song.id,
                name: song.name,
                lyric: lyric,
                trans: trans
              }
              this.$db.lyric.insert(record, (err, doc) => {
                if (!err) {
                  console.log('歌词下载成功')
                } else {
                  console.log('歌词下载失败')
                }
              })
            } catch (e) {
              console.log('catch err', e)
              this.lyricInstance = null
              this.$store.commit('play/SET_LYRIC', null)
              this.$store.commit('play/SET_TRANS', null)
              this.$electron.ipcRenderer.send('change-lyric', { lyric: null, trans: null })
              this.$store.commit('play/SET_CURRENT_LYRIC_LINE', 0)
            }
          } else {
            lyric = doc.lyric
            trans = doc.trans
          }
          this.lyricInstance && this.resetLyric()
          this.getLyricInstance(trans, lyric)
          if (this.playing) {
            this.lyricInstance.play()
          }
          this.lyricInstance.seek(this.currentTime * 1000)
        }
      })
    },
    handleLyric ({ lineNum, txt, trans }) {
      this.$store.commit('play/SET_CURRENT_LYRIC_LINE', lineNum)
      if (txt != null) {
        this.$electron.ipcRenderer.send('change-lyric', { lyric: txt, trans: trans })
      }
    },
    getLyricInstance (trans, lyric) {
      this.lyricInstance = new Lyric(trans, lyric, this.handleLyric)
      this.$store.commit('play/SET_LYRIC', this.lyricInstance)
      this.$electron.ipcRenderer.send('change-lyric', { lyric: this.lyricInstance.lines[0].txt, trans: this.lyricInstance.lines[0].trans })
    },
    resetLyric () {
      this.lyricInstance.stop()
      this.lyricInstance = null
      this.currentTime = 0
      this.$store.commit('play/SET_LYRIC', null)
      this.$store.commit('play/SET_TRANS', null)
      this.$electron.ipcRenderer.send('change-lyric', { lyric: null, trans: null })
      this.$store.commit('play/SET_CURRENT_LYRIC_LINE', 0)
    },
    closeDrawer () {
      this.visible = false
    },
    updateTime (e) {
      const audio = this.$refs.audio
      this.$electron.ipcRenderer.send('change-media-time', { value: e.target.currentTime })
      if (this.currentTime == Math.floor(e.target.currentTime)) {
        return
      }
      this.currentTime = Math.floor(e.target.currentTime)
    },
    onPlay () {
      this.isSongReady = true
      let artistStr = this.current_song.artist.length ? this.current_song.artist.map(item => item.name).join(',') : ''
      document.title = `${this.current_song.name} - ${artistStr}` // tray title
      this.$store.commit('play/SET_PLAY_STATUS', true)
      if (this.needSync) {
        this.$electron.ipcRenderer.send('toggle-play2', {
          value: true
        })
      } else {
        this.needSync = true
      }
      if (this.lyricInstance) {
        this.lyricInstance.seek(this.currentTime * 1000)
      }
      this.$store.dispatch('play/addHistorySong', this.current_song)
      const audio = this.$refs.audio
      this.$nextTick(() => {
        if (this.isMuted) {
          audio.volume = 0
        } else {
          audio.volume = this.volume
        }
      })
    },
    onReady () {
      this.isSongReady = true
    },
    onPause () {
      this.$store.commit('play/SET_PLAY_STATUS', false)
      if (this.needSync) {
        this.$electron.ipcRenderer.send('toggle-play2', {
          value: false
        })
      } else {
        this.needSync = true
      }
    },
    onEnd () {
      this.currentTime = 0
      // this.buffered = 0
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.forward()
      }
    },
    onWaiting () {
      this.waiting = true
      // 播放期间如果卡住暂定歌词的滚动
      if (this.lyricInstance) {
        this.lyricInstance.stop()
      }
    },
    onPlaying () {
      this.waiting = false
      if (this.lyricInstance) {
        const currentTime = this.$refs.audio.currentTime
        this.lyricInstance.seek(currentTime * 1000)
      }
    },
    onError () {
      this.isSongReady = true
      this.waiting = false
    },
    onMuted () {
      const _volume = !this.isMuted ? 0 : this.curVolume
      this.$store.commit('play/SET_VOLUME', _volume)
      this.$electron.ipcRenderer.send('set-volume', {
        value: _volume
      })
      this.$electron.ipcRenderer.send('set-muted', {
        value: !this.isMuted
      })
      this.$store.commit('play/SET_MUTED', !this.isMuted)
    },
    changeMode () {
      let mode = this.mode
      mode = ++mode % Object.keys(playMode).length
      this.$store.commit('play/SET_MODE', mode)
      this.$electron.ipcRenderer.send('set-mode', {
        value: mode
      })
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.lyricInstance) {
        this.$electron.ipcRenderer.send('change-lyric', { lyric: this.lyricInstance.lines[0].txt, trans: this.lyricInstance.lines[0].trans })
      }
    },
    forward () {
      if (!this.isSongReady) {
        return
      }
      this.currentTime = 0
      let list_len = this.current_play_list.length
      let current_song_index = this.current_song_index
      if (!this.privateFm && this.mode === playMode.random) {
        while (true) {
          let _index = getRandomInt(0, list_len - 1)
          if (current_song_index != _index) {
            this.randomHistoryIndexArr.push(current_song_index)
            current_song_index = getRandomInt(0, list_len - 1)
            break
          }
        }
      } else {
        current_song_index++
        this.randomHistoryIndexArr = []
        if (current_song_index > list_len - 1) {
          current_song_index = 0
        }
      }
      this.$store.commit('play/SET_CURRENT_INDEX', current_song_index)
      this.$electron.ipcRenderer.send('change-play-index', {
        index: current_song_index
      })
    },
    backward () {
      if (!this.isSongReady) {
        return
      }
      this.currentTime = 0
      let list_len = this.current_play_list.length
      let current_song_index = this.current_song_index
      if (!this.privateFm && this.mode === playMode.random) {
        if (this.randomHistoryIndexArr.length) {
          current_song_index = this.randomHistoryIndexArr.pop()
        } else { // 如果没有随机播放的历史，就随机后退
          while (true) {
            let _index = getRandomInt(0, list_len - 1)
            if (current_song_index != _index) {
              current_song_index = getRandomInt(0, list_len - 1)
              break
            }
          }
        }
      } else {
        current_song_index--
        if (current_song_index < 0) current_song_index = list_len - 1
      }
      this.$store.commit('play/SET_CURRENT_INDEX', current_song_index)
      this.$electron.ipcRenderer.send('change-play-index', {
        index: current_song_index
      })
    },
    togglePlay () {
      if (!this.isSongReady) {
        return
      }
      if (this.source == '') {
        let list_len = this.current_play_list.length
        if (list_len > 1) {
          this.forward()
        }
      } else {
        const play_status = this.playing
        this.$store.commit('play/SET_PLAY_STATUS', !play_status)
        this.$electron.ipcRenderer.send('toggle-play2', {
          value: !play_status
        })
      }
    },
    onpercentChanged (percent) {
      if (!this.isSongReady) {
        return
      }
      this.currentTime = this.$refs.audio.currentTime = Math.floor(this.current_song.duration * percent)
      this.$electron.ipcRenderer.send('change-media-time', { value: this.currentTime })
      if (!this.playing) {
        this.lyricInstance && this.lyricInstance.stop()
      } else {
        this.lyricInstance && this.lyricInstance.seek(this.currentTime * 1000)
      }
    },
    onvolumeChanged (persent) {
      if (persent <= 0) { // 音量调整至0或以下时
        persent = 0
        this.$store.commit('play/SET_MUTED', true) // 改变静音状态为true
        this.$electron.ipcRenderer.send('set-muted', {
          value: true
        })
      } else { // 音量调整至0以上时
        if (persent > 1) persent = 1
        this.curVolume = Number(persent)
        this.$store.commit('play/SET_MUTED', false) // 改变静音状态为false
        this.$electron.ipcRenderer.send('set-muted', {
          value: false
        })
      }
      this.$store.commit('play/SET_VOLUME', Number(persent))
      this.$electron.ipcRenderer.send('set-volume', {
        value: Number(persent)
      })
    },
    onVirtualBarMove ({ pageX, percent }) {
      if (!this.lyricInstance) return
      if (!document.getElementById('progress-lyric')) {
        let div = document.createElement('div')
        div.setAttribute('id', 'progress-lyric')
        document.body.appendChild(div)
      }
      let targetTime = this.current_song.duration * percent
      let current_lyric = this.lyricInstance.findLyricByTime(targetTime * 1000) || ''
      const dom = document.getElementById('progress-lyric')
      dom.style.left = `${pageX}px`
      if (dom.style.display == 'none') {
        dom.style.display = 'block'
      }
      if (current_lyric) {
        dom.innerText = `词: ${current_lyric.txt}`
      }
    },
    onVirtualBarLeave () {
      const dom = document.getElementById('progress-lyric')
      if (dom) {
        dom.style.display = 'none'
      }
    },
    showDrawer () {
      this.visible = !this.visible
    },
    toggleCurrentLyric () {
      let flag = !this.showDesktoplyric
      this.$electron.ipcRenderer.send('toggle-desktop-lyric', flag)
      this.$store.commit('play/SET_SHOW_DESKTOP_LYRIC', flag)
    },
    toggleDesktopView () {
      let flag = !this.showDesktopView
      this.$electron.ipcRenderer.send('toggle-desktop-view', flag)
      this.$store.commit('play/SET_SHOW_DESKTOP_VIEW', flag)
    },
    showMusicView () {
      this.$store.commit('App/SHOW_VIEW', true)
    },
    toggleTransShow () {
      let trans = this.show_trans
      this.$store.commit('play/SET_SHOW_TRANS', !trans)
      this.$electron.ipcRenderer.send('show-trans', { value: !trans })
    }
  }
}
</script>

<style lang="less">
  .play-history {
    /deep/ .ant-drawer-header {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      background: #f3f5f7;
      z-index: 10;
    }
    .play-history-title {
      display: flex;
      justify-content: center;
      /deep/ .ant-radio-button-wrapper {
        height: 28px;
        line-height: 26px;
      }
    }
    .ant-drawer-body {
      padding: 60px 0 0;
    }
  }
</style>
<style lang="less" scoped>
.player {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  .resize {
    position: absolute;
    right: 2px;
    bottom: 2px;
    display: inline-block;
    width: 12px;
    height: 12px;
    opacity: .75;
    background: linear-gradient(to left top, #333, #333 1px, transparent 1px, transparent 3px, #333 3px, #333 4px, transparent 4px, transparent 6px, #333 6px, #333 7px, transparent 7px);
  }
  .bar1 {
    flex: 0 0 200px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    &.disable {
      .play-icon, .step-icon {
        opacity: .5;
      }
    }
    .play-icon {
      background: @primary-color;
      width: 36px;
      height: 36px;
      cursor: pointer;
    }
    .step-icon {
      background: @primary-color;
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
  }
  .bar2 {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .time {
      width: 80px;
      flex: 0 0 80px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;
    }
  }
  .bar3,
  .bar4 {
    padding: 0 10px;
    .anticon {
      font-size: 18px;
      cursor: pointer;
      vertical-align: sub;
      &.lrc {
        .background-active {
          background: @primary-color;
        }
      }
      &.tran {
        .background-active {
          background: @primary-color;
        }
      }
      &.view {
        .background-active {
          background: @primary-color;
        }
      }
    }
  }
  .bar3 {
    display: flex;
    align-items: center;
    flex: 0 0 150px;
    .playbar-vloumn_icon {
      cursor: pointer;
    }
  }
  .bar4 {
    flex: 0 0 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.bar-volume {
  margin-left: 8px;
  /deep/ .progress {
    background: @primary-color;
  }
  /deep/ .progress-btn-wrapper {
    display: none;
  }
  &:hover {
    /deep/ .progress-btn-wrapper {
      display: block;
    }
  }
}
.dark-back1 {
  background: #222225;
  .bar2 {
    .time {
      color: #dcdde4;
    }
  }
  .bar3 {
    .playbar-vloumn_icon {
      color: #7a7a7c;
      &:hover {
        color: #dcdde4;
      }
    }
  }
  .bar4 {
      .lrc {
        .background-active {
          background: #5fa7e4 !important;
        }
      }
      .tran {
        .background-active {
          background: #5fa7e4 !important;
        }
      }
      .view {
        .background-active {
          background: #5fa7e4 !important;
        }
      }
  }
}
/deep/ .ant-drawer-wrapper-body {
  background: #16181c;
  &::-webkit-scrollbar-thumb {
    background: #2f3134;
  }
  .ant-drawer-header {
  background: #2f3134;
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
