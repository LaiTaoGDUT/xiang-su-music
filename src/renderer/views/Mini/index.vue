<template>
  <div class="mini">
    <div class="mini-bar">
      <div class="avatar-wrapper">
        <img v-lazy="current_song.avatar" width="100%" :key="current_song.id" v-if="current_song.avatar">
        <z-icon type="yinle" style="fontSize:30px" v-else />
      </div>
      <div class="song-info no-drag">
        <div class="song-name">
          <span>{{current_song.name}}</span>
          <small>{{artistStr}}</small>
        </div>
        <artists :artists="current_song.artist" v-if="!current_lyric" />
        <div class="playing-lyric no-drag" v-else>
          <transition name="lyric">
            <span class="current-lyric" :title="current_lyric" :key="current_lyric">{{current_lyric}}</span>
          </transition>
        </div>
        <div class="controls">
          <img src="./../../assets/images/next_icon.png" @click="backward" class="icon no-drag" style="transform:rotate(180deg)"/>
          <img src="./../../assets/images/pause_icon.png" @click="togglePlay" class="icon no-drag" v-if='playing' />
          <img src="./../../assets/images/play_icon.png" @click="togglePlay" class="icon no-drag" v-else />
          <img src="./../../assets/images/next_icon.png" @click="forward" class="icon no-drag"/>
        </div>
      </div>
      <song-heart
        class="item no-drag"
        :isLiked="likedsongIds.includes(current_song.id)"
        @heartClick="(isLike)=>{_handleLikeSong({songId:current_song.id,isLike})}"
        title="喜欢歌曲"
        v-show="!current_song.folder"
      />
      <a-icon class="item no-drag" type="bars" @click="showList" title="播放列表" />
      <z-icon class="item no-drag" type="juxing" @click.native="setFrame" title="普通模式" />
    </div>

    <div class="mini-list" ref="scrollWrapper">
      <ul v-if="current_play_list.length">
        <li
          v-for="(song, index) in current_play_list"
          :key="song.id"
          @dblclick="playSong(current_play_list, index)"
        >
          <playing :playing="playing" v-if="current_song.id==song.id" />
          <span v-else>{{index>8?index+1:'0'+(index+1)}}</span>
          <span class="song-name" :title="song.name">{{song.name}}</span>
          <span class="duration">{{ song.duration | duration }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ZIcon from '@/components/ZIcon'
import SongHeart from '@/components/Common/song-heart'
import Playing from '@/components/Common/playing'
import Artists from '@/components/Common/artists'
import ls from 'store'
import config from '@/config/defaultSettings'

export default {
  name: 'mini',
  data () {
    return {
      isShowList: false,
      current_lyric: null,
      current_trans: null,
      playing: false,
      current_song_index: 0,
      current_play_list: [],
      likedsongIds: []
    }
  },
  components: {
    ZIcon,
    SongHeart,
    Playing,
    Artists
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
        this.updateTheme(this.primaryColor)
      }
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('change-lyric', (e, data) => {
      this.current_lyric = data.lyric || null
      this.current_trans = data.trans || null
    })
    this.$electron.ipcRenderer.on('change-color', (e, data) => {
      this.updateTheme(data.color)
    })
    this.$electron.ipcRenderer.on('toggle-play2', (e, data) => {
      this.playing = data.value
    })
    this.$electron.ipcRenderer.on('change-play-index', (e, data) => {
      this.current_song_index = data.index
    })
    this.$electron.ipcRenderer.on('set-play-list', (e, data) => {
      this.current_play_list = data.value
    })
    this.$electron.ipcRenderer.on('set-like-song-ids', (e, data) => {
      this.likedsongIds = data.value
    })
    this.$electron.ipcRenderer.send('mini-ready')
  },
  computed: {
    current_song () {
      return this.current_play_list[ this.current_song_index ] || {}
    },
    playIcon () {
      return this.playing ? 'pause-circle' : 'play-circle'
    },
    artistStr () {
      return this.current_song.artist.map(item => item.name).join(',')
    }
  },
  watch: {
    isShowList (newVal, oldVal) {
      if ( newVal === true && oldVal === false ) {
        let index = this.current_play_list.findIndex(item => {
          return item.id === this.current_song.id
        })
        let top = index * 35
        this.$refs.scrollWrapper.scrollTo({ top, behavior: 'smooth' })
      }
    }
  },
  methods: {
    togglePlay () {
      this.$electron.ipcRenderer.send('toggle-play', {
        value: !this.playing
      })
      this.playing = !this.playing
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
    playSong (tracks, index) {
      this.$electron.ipcRenderer.send('play-song', {
        value: { tracks, index }
      })
    },
    setFrame () {
      this.$electron.ipcRenderer.send('toggle-mini', {
        value: false,
        playing: this.playing
      })
    },
    showList () {
      this.isShowList = !this.isShowList
      this.$electron.ipcRenderer.send('resize-mini', {
        height: this.isShowList ? 500 : 48
      })
    },
    _handleLikeSong ({ songId, isLike }) {
      this.$electron.ipcRenderer.send('like-song', {
        songId, isLike
      })
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
            if ( item.endsWith('color.less') || item.endsWith('color.less:timestamp') || item.endsWith('color.less:vars') ) {
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

<style lang="less" scoped>
  .mini {
    background: #f0f2f5;
    .mini-bar {
      display: flex;
      align-items: center;
      height: 50px;
      -webkit-app-region: drag;
      .avatar-wrapper {
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f7f7;
        overflow: hidden;
      }
      .item {
        padding: 0 5px;
        opacity: .8;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }
      .song-info {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        padding-left: 10px;
        color: #111;
        overflow: hidden;
        .song-name {
          height: 25px;
          line-height: 25px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #000;
          font-weight: 600;
          small {
            color: #999;
            font-weight: normal;
          }
        }
        .playing-lyric {
          height: 25px;
          position: relative;
          overflow: hidden;
          color: #333;
          .current-lyric {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            z-index: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
          }
        }
        &:hover {
          .controls {
            display: flex
          }
        }
        .controls {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          z-index: 1;
          background: #f0f2f5;
          align-items: center;
          justify-content: space-evenly;
          display: none;
          .icon {
            // color: @primary-color;
            background: @primary-color;
            font-size: 26px;
            opacity: .8;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
    .mini-list {
      max-height: 550px;
      overflow-y: auto;
      li {
        display: flex;
        align-items: center;
        height: 35px;
        padding: 0 5px;
        background: #fff;
        &:nth-child(odd) {
          background: #f3f5f7;
        }
        &:hover {
          background: #eee;
        }
        .song-name {
          flex: 1;
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000;
        }
        .duration {
          width: 60px;
          flex: 0 0 60px;
          text-align: right;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .no-drag {
      -webkit-app-region: no-drag;
    }
    .item {
      font-size: 20px;
    }
  }
</style>
