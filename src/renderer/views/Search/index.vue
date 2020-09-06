<template>
  <div :class="{'dark-back1': isDark}">
    <div class="search-result-top">
      搜索
      <span class="highlight">“{{$route.query.keyword}}”</span>
      的结果
    </div>
    <a-tabs
      :tabBarStyle="{margin:0,paddingLeft:'40px'}"
      :animated="false"
      :defaultActiveKey="activeKey"
      @change="onTabChange"
    >
      <a-tab-pane :tab="tab.label" :key="tab.name" v-for="tab in tabs" />
    </a-tabs>
    <!-- 最佳匹配 -->
    <div class="mathes" v-if="matchRes">
      <template v-for="(val, key) in matchRes">
        <div :key="key" class="match-box" v-if="key !== 'orders' && key !== 'rec_query'">
          <router-link
            :to="`/${key}/${item.id || item.vid}`"
            class="match-item"
            v-for="item in val"
            :key="item.id"
          >
            <img v-lazy="`${item.picUrl || item.cover || item.coverUrl}?param=50y50`" />
            <div class="name">{{matchMap[key]}}: {{item.name || item.title}}</div>
            <a-icon type="right" />
          </router-link>
        </div>
      </template>
    </div>
    <!-- 搜索结果 -->
    <component class="search-result" :is="componentName" :pageSize="limit" :result="result" v-if="result">
      <div class="page-wrapper" slot-scope="{total}">
        <a-pagination
          :defaultCurrent="1"
          :pageSize="limit"
          :total="Number(total) || 0"
          @change="onPageChange"
        />
      </div>
    </component>
    <loading v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频 ,1018: 综合
import { getSearch, getSearchMultimatch } from '@/api/search'
import Loading from '@/components/Common/loading'
const SearchSong = () => import('./components/song')
const SearchArtist = () => import('./components/artist')
const SearchAlbum = () => import('./components/album')
const SearchVideo = () => import('./components/video')
const SearchPlaylist = () => import('./components/playlist')
const SearchLyric = () => import('./components/lyric')
const SearchDj = () => import('./components/dj')
const SearchUser = () => import('./components/user')
const SearchAll = () => import('./components/all')

const tabs = [
  {
    name: 'search-song_1',
    label: '单曲',
    type: 1
  },
  {
    name: 'search-artist_100',
    label: '歌手',
    type: 100
  },
  {
    name: 'search-album_10',
    label: '专辑',
    type: 10
  },
  {
    name: 'search-video_1014',
    label: '视频',
    type: 1014
  },
  {
    name: 'search-playlist_1000',
    label: '歌单',
    type: 1000
  },
  {
    name: 'search-lyric_1006',
    label: '歌词',
    type: 1006
  },
  {
    name: 'search-dj_1009',
    label: '主播电台',
    type: 1009
  },
  {
    name: 'search-user_1002',
    label: '用户',
    type: 1002
  }
]

export default {
  name: 'search',
  data () {
    let keyword = this.$route.query.keyword || ''
    return {
      tabs,
      activeKey: tabs[0].name,
      componentName: 'search-song',
      keyword,
      limit: 30,
      offset: 0,
      searchType: 1,
      result: null,
      matchRes: null,
      matchMap: {
        album: '专辑',
        artist: '歌手',
        mv: 'MV',
        video: '视频'
      }
    }
  },
  watch: {
    '$route.query.keyword': '_search'
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  created () {
    this._search()
  },
  methods: {
    onTabChange (key) {
      this.componentName = key.split('_')[0]
      this.searchType = key.split('_')[1]
      this._search()
    },
    async _search () {
      this.keyword = this.$route.query.keyword || ''
      if (this.keyword == '') return
      let { keyword, limit, offset, searchType } = this
      let params = {
        keyword,
        limit,
        offset,
        type: searchType
      }
      let { result } = await getSearch(params)
      let matches = await getSearchMultimatch(keyword)
      this.matchRes = matches.result
      this.result = result
      this.$store.dispatch('Search/saveKeyword', keyword)
    },
    onPageChange (page, pageSize) {
      this.offset = (page - 1) * this.limit
      this._search()
    }
  },
  components: {
    SearchSong,
    SearchAlbum,
    SearchVideo,
    SearchArtist,
    SearchPlaylist,
    SearchLyric,
    SearchDj,
    SearchUser,
    SearchAll,
    Loading
  }
}
</script>

<style lang="less" scoped>
.search-result-top {
  padding: 20px;
  .highlight {
    color: @primary-color;
  }
}
.page-wrapper {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mathes {
  display: flex;
  .match-box {
    padding: 15px 20px;
    .match-item {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      width: 230px;
      padding: 4px;
      border: 1px solid #e8e8e8;
      color: #333;
      background: #efefef;
      img {
        display: block;
        width: auto;
        height: 50px;
      }
      .name {
        flex: 1;
        padding: 0 5px;
        font-size: 14px;
      }
      .anticon {
        color: #999;
      }
    }
  }
}
.search-result {
  min-height: 200px;
  /deep/ .ant-spin-spinning {
    display: block;
    margin-top: 20px;
  }
}
.dark-back1 {
  color: #dcdde4;
  .highlight {
    color: #5fa7e4 !important;
  }
  /deep/ .ant-tabs-bar {
    border-bottom: 2px solid #23262c;
    /deep/ .ant-tabs-tab {
      color: #dcdde4;
    }
    /deep/ .ant-tabs-tab-active {
      color: #5fa7e4;
    }
    /deep/ .ant-tabs-ink-bar {
      background: #5fa7e4;
    }
  }
  .match-box {
    .match-item {
      background: #23262c;
      border: none;
      color: #dcdde4;
    }
  }
  .page-wrapper {
    background: #16181c;
    /*页码*/
    /deep/ .ant-pagination-item {
      border: none;
      background: #16181c;
      a {
        background: #16181c;
        color: #adafb2;
        &:hover {
          background: #242629;
          color: #dcdde4;
        }
      }
    }
    /*当前选中的页码*/
    /deep/ .ant-pagination-item-active {
      a {
        color: #5fa7e4;
        text-decoration: underline;
        cursor: auto;
        &:hover {
          background: #16181c;
          color: #5fa7e4;
        }
      }
    }
    /*往前按钮*/
    /deep/ .ant-pagination-prev {
      a {
        border: none;
        background: #242629;
        color: #adafb2;
        &:hover {
          border: 1px solid #4e4e52 !important;
        }
      }
    }
    /*往后按钮 */
    /deep/ .ant-pagination-next {
      a {
        border: none;
        background: #242629;
        color: #adafb2;
        &:hover {
          border: 1px solid #4e4e52 !important;
        }
      }
    }
    /*省略号 */
    /deep/ .ant-pagination-item-ellipsis {
      color: #adafb2;
    }
    /deep/ .ant-pagination-item-link-icon {
      color: #adafb2;
    }
    /*不可用的按钮*/
    /deep/ .ant-pagination-disabled {
      a {
        color: #32343b;
        &:hover {
          border: none !important;
        }
      }
    }
  }
}
</style>
