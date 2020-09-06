<template>
  <div class="tab-bar" :class="{'dark-back1': isDark}">
    <nav class="nav">
      <!-- <router-link
        :to="{name:tab.name,query:{...$route.query,page:1}}"
        v-for="(tab , index) in tabs"
        :key="index"
      >{{tab.label}}</router-link>-->
      <router-link :to="{name:tab.name, query: {platform: platform}}" v-for="(tab , index) in tabs" :key="index">{{tab.label}}</router-link>
    </nav>
    <div class="tab-bar-extra-content" v-if="showSearch">
      <a-input-search
        size="small"
        placeholder="搜索音乐"
        style="width: 200px;"
        class="extra-search"
        @change="onChange"
        @search="onSearch"
        allow-clear
        v-model="keyword"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'loadsh/debounce'
export default {
  name: 'tabBar',
  data () {
    return {
      keyword: ''
    }
  },
  props: {
    tabs: {
      type: Array,
      default () {
        return [
          {
            name: 'playlist-id-tracks',
            label: '歌曲列表'
          },
          {
            name: 'playlist-id-comment',
            label: '评论'
          },
          {
            name: 'playlist-id-subscriber',
            label: '收藏者'
          }
        ]
      }
    },
    platform: {
      type: String,
      default: 'netease'
    },
    showSearch: { type: Boolean, default: true }
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  methods: {
    onSearch (value) {
      this.$emit('search', value)
    },
    onChange: debounce(function (e) {
      this.$emit('search', e.target.value)
      // console.log(e.target.value)
    }, 600)
  },
  activated () {
    this.keyword = ''
    this.$emit('search', '')
  }
}
</script>

<style scoped>
.tab-bar >>> .ant-tabs-nav-container {
  margin-left: 80px;
}

.tab-bar >>> .ant-tabs-extra-content {
  margin-right: 40px;
}

.tab-bar >>> .ant-tabs-bar {
  margin: 0;
}

.tab-bar >>> .ant-tabs-ink-bar {
  height: 4px;
}

.tab-bar >>> .ant-tabs-nav .ant-tabs-tab {
  margin: 0 50px 0 0;
  padding: 12px 0px;
}

.tab-bar >>> .ant-input {
  font-size: 12px;
  border-radius: 12px;
}
</style>
<style lang="less" scoped>
.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 45px;
  border-bottom: 1px solid #ddd;
  .nav {
    a {
      display: inline-block;
      line-height: 32px;
      margin: 0 20px;
      color: #333;
      text-decoration: none;
      border-bottom: 5px solid transparent;
      &.router-link-exact-active,&.router-link-active {
        color: @primary-color;
        border-bottom: 5px solid @primary-color;
      }
    }
  }
}
.dark-back1 {
  border-bottom: 1px solid #23262c;
  .nav {
    a {
      color: #fff;
      &.router-link-exact-active,&.router-link-active {
        color: #5fa7e4 !important;
        border-bottom: 5px solid #5fa7e4 !important;
      }
    }
  }
  .tab-bar-extra-content {
    /deep/ .ant-input {
      border: none;
      background: #212327;
      color: #828385;
    }
    /deep/ .ant-input::-webkit-input-placeholder {
      color: #828385 !important
    }
    /deep/ .ant-input-search-icon {
      color: #dcdde4 !important;
    }
    /deep/ .ant-input-clear-icon {
      color: #dcdde4 !important;
    }
  }

}
</style>
