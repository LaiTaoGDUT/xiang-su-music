<template>
  <div class="no-more" :class="{'dark-back1': isDark}">没有更多了~</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'infiniteNoMore',
  computed: {
    ...mapGetters('App', ['isDark'])
  }
}
</script>

<style scoped>
  .no-more {
    margin: 15px 0;
    text-align: center;
  }
  .dark-back1 {
    color: #ffffff;
  }
</style>
