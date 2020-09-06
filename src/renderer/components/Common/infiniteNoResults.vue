<template>
  <div class="no-result" :class="{'dark-back1': isDark}">暂无请求结果~</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'infiniteNoResults',
  computed: {
    ...mapGetters('App', ['isDark'])
  }
}
</script>

<style scoped>
  .no-result {
    margin: 15px 0;
    text-align: center;
  }
  .dark-back1 {
    color: #fff;
  }
</style>
