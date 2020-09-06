<template>
  <div>
    <a-popover
      trigger="click"
      placement="bottomLeft"
      overlayClassName="search-wrapper"
      :overlayStyle="overlayStyle"
      v-model="searchVisible"
    >
      <a-input-search
        :class="{ 'dark-search': isDark }"
        placeholder="搜索音乐、视频、歌词、电台..."
        v-model="keyword"
        class="header-search"
        @search="onSearch"
        allow-clear
      />
      <template slot="content">

        <div class="search-result" v-if="keyword && suggests" :class="{ 'dark-back1': isDark }">
          <dl v-for="(suggest, key) in suggests" :key="key">
            <dt>{{searchMap[key]}}</dt>
            <dd v-for="(item, index) in suggest" :key="index" @click="suggestClick(suggest,item,key)">
              <span v-if="key !== 'orders'">{{item.name}}</span>
            </dd>
          </dl>
          <dd v-if='Object.keys(suggests).length == 0'>暂无搜索建议</dd>
        </div>

        <div class="search-content" :class="{ 'dark-back1': isDark }" v-else>
          <dl>
            <dt>
              热门搜索
            </dt>
            <dd
              v-for="(hot, index) in hots"
              :key="index"
              @click="setKeyword(hot.first)"
            >{{hot.first}}</dd>
          </dl>
          <dl>
            <dt class="space-between">
              <span>搜索历史</span>
              <a-icon type="delete" @click="clearHistory"/>
            </dt>
            <template v-if="searchHistory.length">
              <dd v-for="(item, index) in searchHistory" :key="index" class="space-between" @click="setKeyword(item)">
                <span>{{item}}</span>
                <a-icon type="close" @click="deleteHistory(index)"/>
              </dd>
            </template>
            <dd v-else>无</dd>
          </dl>
        </div>

      </template>
    </a-popover>
  </div>
</template>

<script>
import { getSearchHot, getSearchSuggest } from '@/api/search'
import { debounce } from '@/utils/dom'
import { normalSong } from '@/utils/song'
import { mapGetters } from 'vuex'
import playMixin from '@/mixins/Play.js'

export default {
  mixins: [
    playMixin
  ],
  data () {
    let keyword = this.$route.query.keyword || ''
    return {
      searchVisible: false,
      keyword: keyword,
      suggests: null,
      searchMap: {
        albums: '专辑',
        artists: '歌手',
        songs: '单曲',
        playlists: '歌单',
        mvs: 'MV',
        videos: '视频'
      },
      hots: []
    }
  },
  computed: {
    ...mapGetters('Search', ['searchHistory']),
    ...mapGetters('play', ['current_song']),
    ...mapGetters('App', ['primaryColor', 'isDark']),
    overlayStyle () {
      return this.keyword && this.suggests
        ? { width: '300px', top: '50px' }
        : { width: '440px', top: '50px' }
    }
  },
  created () {
    this.$watch(
      'keyword',
      debounce(newQuery => {
        this.search(newQuery)
      }, 500)
    )
  },
  watch: {
    searchVisible (newVal) {
      if (this.keyword === '') {
        this.suggests = null
      } else {
        if (newVal) {
          this.search(this.keyword)
        }
      }
      if (newVal && !this.hots.length) {
        getSearchHot().then(res => {
          this.hots = res.result.hots
        })
      }
    },
    keyword (newVal) {
      if (newVal === '') return
      this.searchVisible = true
    }
  },
  methods: {
    async search (newQuery) {
      if (newQuery === '') {
        this.suggests = null
        return
      }
      let { result } = await getSearchSuggest({ keyword: newQuery })
      this.suggests = result
    },
    setKeyword (keyword) {
      this.keyword = keyword
      this.$router.push({ path: '/search', query: { keyword } })
    },
    onSearch (keyword, event) {
      this.$store.commit('play/SET_FULLSCREEN', false)
      if (!this.keyword) return
      event.preventDefault()
      this.searchVisible = false
      if (this.$route.path == '/search' && this.$route.query.keyword && this.$route.query.keyword == keyword) {
        return // 搜索关键字与当前页面结果相同
      }
      this.$router.push({ path: '/search', query: { keyword } })
    },
    deleteHistory (index) {
      this.$store.dispatch('Search/deleteKeyword', index)
    },
    clearHistory () {
      this.$store.dispatch('Search/clearKeyword')
    },
    suggestClick (suggest, item, key) {
      this.$store.commit('play/SET_FULLSCREEN', false)
      let path = ''
      switch (key) {
        case 'albums':
          path = `/album/${item.id}?platform=${item.platform}`
          this.$router.push({ path })
          break
        case 'artists':
          path = `/artist/${item.id}?platform=${item.platform}`
          this.$router.push({ path })
          break
        case 'playlists':
          path = `/playlist/${item.id}?platform=${item.platform}`
          this.$router.push({ path })
          break
        case 'mvs':
          break
        default: // click song
          // console.log(item)
          let song = normalSong(item)
          if (song.id === this.current_song.id) return
          this.$store.dispatch('play/appendPlay', { song, self: this })
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dark-back1 {
  background: #222225;
  color: #adafb2;
  dt {
    background: #303236 !important;
    color: #dcdde4 !important;
  }
  dd {
    color: #adafb2 !important;
    &:hover {
      background: #16181c !important;
    }
  }

}
.header-search {
  /deep/ .ant-input {
    height: 24px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.8);
    border: none;
    box-shadow: none;
    font-size: 12px;
  }
  /deep/ .ant-input-search-icon {
    color: rgba(255, 255, 255, 0.6) !important;
  }
}
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-wrapper {
  dl,
  dd {
    margin-bottom: 0;
  }
  .search-content {
    display: flex;
    margin: -12px -16px;
    dl {
      width: 50%;
      font-size: 14px;
      &:not(:last-child) {
        border-right: 1px solid #eee;
      }
    }
    dt {
      padding: 7px 15px;
      border-bottom: 1px solid #eee;
      color: #999;
    }
    dd {
      padding: 0 15px;
      line-height: 28px;
      color: #111;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .search-result {
    margin: -12px -16px;
    dt {
      padding: 7px 15px;
      background: #f3f5f9;
    }
    dd {
      padding: 0 5px 0 30px;
      line-height: 28px;
      color: #111;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
      a {
        color: #333;
      }
    }
  }
}
.dark-search {
  /deep/ .ant-input {
    color: #828385 !important
  }
  /deep/ .ant-input::-webkit-input-placeholder {
    color: #828385 !important
  }
  /deep/ .ant-input-clear-icon {
    color: #dcdde4 !important;
  }
}
</style>
