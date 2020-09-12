<template>
    <div class="desc-box" :class="{'desc-show-full': showMore, 'dark-back1': isDark}">
        <div
          class="desc-content"
          :style="{
            'height': showMore ? 'auto' : (lineNumbers + 1) * lineHeight + 'px',
            'font-size': fontSize + 'px',
            'line-height': lineHeight + 'px'
          }"
          ref="desc"
        >
            <span>简介：</span>
            <pre v-if="description && description.length > 0">{{ saveDescription }}</pre>
            <span v-else>无</span>
        </div>
        <div class="show-more" v-if="descOverflow" :style="{'right': btnOutOfWords ? '-30px' : '6px'}">
            <em></em>
            <a class="more_link" @click.prevent="handleShowMore">{{ showMore ? '^收起' : '...展开' }}</a>
            </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'desc-box',
  data () {
      return {
        descOverflow: false,
        showMore: false,
        saveDescription: ''
      }
  },
  props: {
    description: {
        type: String,
        default: ''
    }, // 描述文字
    lineNumbers: {
        type: Number,
        default: 3
    }, // 收起状态下的最大显示行数
    lineHeight: {
      type: Number,
      default: 22
    }, // 行高
    fontSize: {
      type: Number,
      default: 14
    }, // 字体大小
    btnOutOfWords: {
        type: Boolean,
        default: true
    } // 展开按钮是否不覆盖文本
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  watch: {
    description () {
        this.init()
    }
  },
  mounted () {
      this.init()
  },
  methods: {
    init () {
        this.descOverflow = false
        this.showMore = false
        this.saveDescription = this.description && this.description.replace(/[<]/g, '&lt;')
        this.$nextTick(() => {
            const desc = this.$refs.desc
            if (desc.clientHeight < desc.scrollHeight) {
            this.descOverflow = true
            }
        })
    },
    handleShowMore () {
      this.showMore = !this.showMore
    }
  }
}
</script>

<style lang="less" scoped>
.desc-box {
  position: relative;
  padding-bottom: 10px;
  .desc-content {
    overflow: hidden;
    pre {
      white-space: pre-wrap;
      margin-bottom: 0;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .show-more {
    display: flex;
    align-content: center;
    height: 22px;
    font-size: 14px;
    position: absolute;
    z-index: 2;
    bottom: 10px;
    em {
      height: 22px;
      width: 20px;
      background: -webkit-linear-gradient(left, rgba(245,245,247,0),rgba(245,245,247,1));
    }
    .more_link {
      background: #f5f5f7;
    }
  }
}
.desc-show-full {
  padding-bottom: 40px;
}
.dark-back1 {
    color: #fff;
    .desc-content {
        pre {
            color: #828385;
        }
    }
    .show-more {
        em {
            background: -webkit-linear-gradient(left, rgba(22,24,28,0),rgba(22,24,28,1));
        }
        .more_link {
            background: #16181c;
            color: #828385;
            &:hover {
            color: #ffffff;
            }
        }
    }
}

</style>
