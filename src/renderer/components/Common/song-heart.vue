<template>
  <span :class="{'disable' : disable}">
    <a-icon
      type="heart"
      theme="filled"
      :style="{ color: $store.getters['App/primaryColor'] }"
      style="vertical-align: text-bottom"
      @click.stop="handleClick(false)"
      v-if="isLiked"
      title="取消喜欢"
    />
    <a-icon title="喜欢歌曲" style="vertical-align: text-bottom" type="heart" theme="outlined" @click.stop="handleClick(true)" v-else/>
  </span>
</template>

<script>

export default {
  props: {
    isLiked: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      default: 'netease'
    }
  },
  methods: {
    handleClick (isLike) {
      if (this.disable) return
      if (this.platform == 'qq') {
        this.$message.warn('暂时不支持跨平台喜爱哦')
        return
      }
      this.$emit('heartClick', isLike)
    }
  }
}
</script>

<style scoped>
.disable {
  opacity: .5;
}
</style>
