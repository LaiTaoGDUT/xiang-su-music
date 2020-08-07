<template>
  <div>
    <transition name="viewSlideTop">
      <div class="music-view" v-show="showView">
        <div
          class="bg-player"
          :style="'backgroundImage: url('+current_song.avatar+')'"
          v-if="current_song.avatar"
        ></div>
        <a-icon type="down" class="icon" @click="closeMusicView"></a-icon>
        <z-icon type="geci" class="lrc" :class="{'active' : showLyric}" @click.native="toggleLyric"/>
        <music-view ref="viewer" @changeColorHeight="changeColorHeight"/>
        <div class="lyric" v-show="showLyric" >
          <div class="playing-lyric" ref="lrc" :style="changedColor">
            {{ lyric && lyric.lines ? lyric.lines[current_lyric_line].txt : 'PIXEL MUSIC' }}
          </div>
          <div class="playing-trans" ref="lrc" v-show='show_trans' :style="changedColor">
            {{ lyric && lyric.lines ? lyric.lines[current_lyric_line].trans: '像素音乐' }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import MusicView from '@/components/Common/musicView.vue'
import ZIcon from '@/components/ZIcon'
export default {
  data () {
    return {
      songs: [],
      currentLine: 6,
      showLyric: true,
      colorHeight: 0
    }
  },
  computed: {
    ...mapState('play', ['lyric', 'trans', 'show_trans']),
    ...mapGetters('play', [
      'current_song',
      'current_play_list',
      'current_song_index',
      'playing',
      'current_lyric_line',
      'source'
    ]),
    ...mapGetters('App', ['showView']),
    changedColor () {
      return { 'text-shadow': `1px 1px 5px hsl(${this.colorHeight}, 60%, 70%), 1px -1px 3px hsl(${this.colorHeight}, 60%, 70%)` }
    }
  },
  components: {
    MusicView, ZIcon
  },
  methods: {
    changeColorHeight (newVal) {
      this.colorHeight = (newVal + 5) % 360
    },
    closeMusicView () {
      this.$store.commit('App/SHOW_VIEW', false)
    },
    toggleLyric () {
      this.showLyric = !this.showLyric
    }
  }
}
</script>

<style lang="less" scoped>
.lyric {
  position: absolute;
  left: 0;
  bottom: 5%;
  z-index: 2222;
  width: 100%;
  color: #fff;
  text-align: center;
  -webkit-app-region: no-drag;
  .playing-lyric {
    font-size: 40px;
    color: rgba(255, 225, 255, 0.6);
    // text-shadow: 1px 1px 2px rgba(255, 225, 255, 0.6), 1px -1px 2px rgba(255, 255, 255, 0.6);

  }
  .playing-trans {
    font-size: 32px;
    color: rgba(255, 225, 255, 0.6);
    // text-shadow: 1px 1px 2px rgba(255, 225, 255, 0.6), 1px -1px 2px rgba(255, 255, 255, 0.6);
  }
}
.music-view {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  overflow: hidden;
  -webkit-app-region: drag;
  background-color: #000;
  .bg-player {
    position: absolute;
    left: -60px;
    top: -60px;
    bottom: -60px;
    right: -60px;
    z-index: -1;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    filter: blur(15px) brightness(0.40);
  }
  .icon {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 30px;
    color: rgba(255, 255, 255, 0.2);
    -webkit-app-region: no-drag;
    &:hover {
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
  }
  .lrc {
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 30px;
    color: rgba(255, 255, 255, 0.2);
    -webkit-app-region: no-drag;
    &.active {
      color: rgba(255, 255, 255, 0.4);
    }
    &:hover {
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
  }
}
</style>
