<template>
  <div class="loading-wrapper">
    <slot>
      <playing />
    </slot>
    <div v-if="$slots && $slots.text" :class="{ 'dark-text': isDark }" >
      <slot name="text"></slot>
    </div>
    <div v-else :class="{ 'dark-text': isDark }" >{{ text }}</div>
  </div>
</template>

<script>
import Playing from '@/components/Common/playing'
import { mapGetters } from 'vuex'
export default {
  name: 'loading',
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  components: {
    Playing
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.loading-wrapper {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-text {
  color: #ffffff;
}
</style>
