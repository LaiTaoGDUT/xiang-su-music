<template>
  <div class="lyric-list" ref="lyricList" v-if="lyric" :class="{'dark-back1': isDark}">
    <div class="lyric-wrapper">
      <p
        ref="lyricLine"
        v-for="(line, index) in lyric.lines"
        :key="index"
        class="text"
        :class="{'current' : current_lyric_line === index}"
      >
        <span v-show="showTime">{{ line.time / 1000 | duration }}</span>
        <span>{{ line.txt }}</span><br >
        <span v-show='show_trans'>{{ line.trans }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
const LYRIC_LINE_HEIGHT = 34
export default {
  props: {
    showTime: {
      type: Boolean,
      default: false
    },
    lineHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('play', ['lyric']),
    ...mapGetters('play', ['current_lyric_line', 'show_trans']),
    ...mapGetters('App', ['isDark'])
  },
  watch: {
    // current_lyric_line (newLine) {
    //   const lines = this.$refs.lyricLine
    //   const line_HEIGHT = lines[newLine].getBoundingClientRect().height
    //   let top = lines[newLine].offsetTop > 0 ? Number(lines[newLine].offsetTop - line_HEIGHT * 3) : 0
    //   this.scrollTo(top, 'smooth')
    // }
  },
  methods: {
    scrollTo (top, behavior = 'auto') {
      const lyricDom = this.$refs.lyricList
      if (lyricDom && lyricDom.scrollTo) {
        lyricDom.scrollTo({ top, behavior })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.lyric-list {
  width: 100%;
  height: 360px;
  padding-left: 20px;
  overflow: auto;
  display: inline-block;
  vertical-align: top;
  mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 15%,
    rgba(255, 255, 255, 1) 25%,
    rgba(255, 255, 255, 1) 75%,
    rgba(255, 255, 255, 0.6) 85%,
    rgba(255, 255, 255, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 15%,
    rgba(255, 255, 255, 1) 25%,
    rgba(255, 255, 255, 1) 75%,
    rgba(255, 255, 255, 0.6) 85%,
    rgba(255, 255, 255, 0) 100%
  );
  &.default {
    .lyric-wrapper {
      overflow: auto;
    }
    .text {
      margin: 0;
      padding: 4px 0;
      line-height: 26px;
      color: #333;
      font-size: 15px;
      transition: all 0.3s;
      &:first-child {
        margin-top: 100px;
      }
      &:last-child {
        padding-bottom: 100px;
      }
      &.current {
        color: white;
        font-size: 16px;
        text-shadow: 1px 1px @primary-color, 1px 2px @primary-color;
      }
    }
  }
  &.view {
    height: 100%;
    .lyric-wrapper {
      padding-top: 5vh;
      overflow: auto;
      &.center {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .text {
        font-family: "Source Sans Pro", "\660E\9ED1", Arial, Helvetica;
        font-size: 18px;
        transition: all 0.25s;
        text-align: center;
        &:first-child {
          margin-top: 200px;
        }
        &:last-child {
          padding-bottom: 200px;
        }
        &.current {
          font-size: 36px;
          color: white;
          background-image: linear-gradient(
            to right,
            #5fa7e4,
            orange,
            yellow,
            green,
            yellow,
            orange,
            red,
            orange,
            yellow,
            green,
            yellow,
            orange,
            #5fa7e4
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 100%;
          animation: bgp 5s infinite linear;
        }
      }
    }
  }
}
@keyframes bgp {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
.dark-back1 {
  &::-webkit-scrollbar-thumb {
    background: #2f3134;
  }
  &.default {
    border-right: 1px solid #39393b;
    .text {
      color: #828385;
      &.current {
        color: #fff;
        text-shadow: none;
      }
    }
  }
}
</style>
