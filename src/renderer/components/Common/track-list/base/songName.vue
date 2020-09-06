<template>
  <span class="songname" :title="getTitle(row, col)" :class="{'dark-back1': isDark, 'dark-match': isDark && matched}">
    <span>{{ row[col.key] }}</span>
    <small class="alia" v-if="row.alia && row.alia.length">({{ row.alia.join(',') }})</small>
    <router-link
      :to="`/mv/${row.mvid}?platform=${row.platform}`"
      title="查看MV"
      v-if="row.mvid"
    >
      <a-icon type="youtube" />
    </router-link>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  props: {
    row: {
      type: Object
    },
    col: {
      type: Object
    },
    matched: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getTitle (row, col) {
      let title = row[ col.key ]
      if ( row.alia && row.alia.length ) {
        title += ` (${row.alia.join(',')})`
      }
      return title
    }
  }
}
</script>

<style lang="less" scoped>
  .songname a {
    margin-left: 3px;
    font-size: 15px;
    color: @primary-color;
  }

  .alia {
    margin-left: 3px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }

  .dark-back1 {
    background: transparent;
    a {
      color: #5fa7e4 !important;
    }
    .alia {
      color: #828385;
    }
  }

  .dark-match {
    color: #dcdde4;
  }
</style>
