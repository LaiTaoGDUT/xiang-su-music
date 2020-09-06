<template>
  <span :class="{ 'dark-back1': isDark }" class="track_list-album">
    <template v-if="row[col.key] && row[col.key].name && row[col.key].id">
      <router-link
        :to="`/album/${row[col.key].id}?platform=${row[col.key].platform}`"
        :title="`专辑:${row[col.key].name}`"
      >{{ row[col.key].name }}</router-link>
    </template>
    <span v-else-if="row[col.key] && row[col.key].name" :title="row[col.key].name">{{ row[col.key].name }}</span>
    <span v-else>{{ row[col.key] && typeof row[col.key] === 'string' ? row[col.key] : '未知专辑' }}</span>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  props: {
    row: {
      type: Object,
      default () {
        return null
      }
    },
    col: {
      type: Object,
      default () {
        return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.track_list-album {
  a {
    color: #333;
    &:hover {
      color: @primary-color;
    }
  }
}
.dark-back1 {
  background: transparent;
  a {
    color: #828385;
    &:hover {
    color: #dcdde4 !important;
    }
  }
  span {
    color: #4e4e52;
  }
}
</style>
