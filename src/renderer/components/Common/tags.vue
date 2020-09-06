<template>
  <section>
    <dl class="tags" v-for="(val,key,index) in tags" :key="index" :class="{'dark-back1': isDark}">
      <dt>{{key}}:</dt>
      <dd v-for="(tag, i) in val" :key="tag.id" @click="selectTag(tag,index,i)"
          :class="{'current':currentIndex==`${index}_${i}`}">{{tag.name}}
      </dd>
    </dl>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'tags',
  data () {
    return {
      currentIndex: -1
    }
  },
  props: {
    tags: {
      type: Object,
      default () {
        return []
      }
    },
    useHoverHighlight: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  methods: {
    selectTag (tag, index, i) {
      this.currentIndex = `${index}_${i}`
      this.$emit('change', tag)
    }
  }
}
</script>

<style lang="less" scoped>
  .tags {
    margin: 15px 0;
    dd, dt {
      display: inline-block;
      font-size: 14px;
    }
    dd {
      padding: 0 10px;
      cursor: pointer;
      line-height: 22px;
      &.current {
        background: @primary-color;
        color: #fff;
      }
    }
    dt {
      margin-right: 4px;
      font-weight: 600;
    }
    dd:not(:last-child) {
      border-right: 1px solid #ddd;
    }
  }
  .dark-back1 {
    dt {
      color: #dcdde4;
    }
    dd {
      color: #777;
      &:hover {
        color: #dcdde4;
      }
      &.current {
        background: transparent !important;
        color: #5fa7e4 !important;
      }
    }
    dd:not(:last-child) {
      border-right: 1px solid #ddd;
    }
  }
</style>
