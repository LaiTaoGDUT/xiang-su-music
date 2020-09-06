<template>
  <a-button-group size="small" :class="{'dark-back1': isDark}">
    <a-button type="primary" @click="back">
      <a-icon type="left" />
    </a-button>
    <a-button type="primary" @click="forward">
      <a-icon type="right" />
    </a-button>
  </a-button-group>
</template>

<script>
import { mapGetters } from 'vuex'
import eventBus from '@/utils/eventBus'
export default {
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    forward () {
      this.$router.go(1)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.dark-back1 {
  .ant-btn {
    background: #16181c;
    border: 1px solid #000;
    &:active {
      color: #464648;
      background: #1b1d20;
    }
  }
}
</style>
