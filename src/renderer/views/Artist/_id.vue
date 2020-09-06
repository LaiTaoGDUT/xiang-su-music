<template>
  <div>
    <loading v-show="loading" text="加载中..." />
    <a-list class="intro" v-if="artist" :class="{'dark-back1': isDark}">
      <a-list-item>
        <a-list-item-meta>
          <div slot="title">
            <a-tag class="tag">歌手</a-tag>
            <h1 class="artist-name">{{artist.name}}</h1>
          </div>
          <div slot="description" class="desc">
            <div>单曲数：{{artist.musicSize}}</div>
            <div>专辑数：{{artist.albumSize}}</div>
            <div>MV数：{{artist.mvSize}}</div>
            <div  v-if="artist.fans" >粉丝数：{{ artist.fans | toWan }}</div>
            <div class="artist-briefDesc" v-if="artist.briefDesc" style="max-height: 100px;overflow: auto;">简介：{{ artist.briefDesc }}</div>
          </div>
          <img v-lazy="`${artist.img1v1Url}?param=200y200`" width="200" height="200" :key="artist.id" slot="avatar">
        </a-list-item-meta>
        <div class="action">
          <a-button size="small" icon="check" @click="subscribe(2, artist)" v-if="artist.followed">
            已收藏
          </a-button>
          <a-button :disabled="artist.platform == 'qq'" size="small" icon="folder-add" @click="subscribe(1, artist)" v-else>
            收藏
          </a-button>
        </div>
      </a-list-item>
    </a-list>
    <tab-bar :tabs="tabs" @search="searchSongs" :platform="artist.platform" />
    <keep-alive>
      <router-view :tracks="songs" @loadmore="pushSongs" />
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getArtistSongs } from '@/api/artist'
import { normalSong } from '@/utils/song'
import TabBar from '@/components/Common/tabBar'
import Loading from '@/components/Common/loading'
export default {
  name: 'artist_id',
  data () {
    return {
      artist: '',
      hotSongs: [],
      searchKey: '',
      loading: false,
      tabs: [
        {
          name: 'artist-id-album',
          label: '专辑'
        },
        {
          name: 'artist-id-songs',
          label: '热门歌曲'
        },
        {
          name: 'artist-id-mv',
          label: 'MV'
        },
        {
          name: 'artist-id-desc',
          label: '歌手详情'
        },
        {
          name: 'artist-id-simi',
          label: '相似歌手'
        }
      ]
    }
  },
  components: {
    TabBar, Loading
  },
  activated () {
    this._getArtistSongs(this.$route.params.id, this.$route.query.platform)
  },
  beforeRouteUpdate (to, from, next) {
    this._getArtistSongs(to.params.id, to.query.platform)
    next()
  },
  computed: {
    ...mapGetters('App', ['isDark']),
    songs () {
      return this.hotSongs.filter(track => {
        return track.name.toLowerCase().includes(this.searchKey) || track.album.name.toLowerCase().includes(this.searchKey)
      })
    }
  },
  methods: {
    searchSongs (value) {
      this.searchKey = value.toLowerCase()
    },
    async _getArtistSongs (id, platform) {
      this.loading = true
      let { artist, hotSongs } = await getArtistSongs({ id, limit: 50, offset: 0, platform })
      this.artist = artist
      const arr = []
      hotSongs.forEach(song => {
        arr.push(normalSong(song))
      })
      this.hotSongs = arr
      this.loading = false
    },
    pushSongs (tracks) {
      this.hotSongs = tracks
    },
    subscribe (t, artist) {
      this.$store.dispatch('User/subscribeArtist', { t, artist }).then(code => {
        this.artist.followed = !this.artist.followed
      })
    }
  }
}
</script>

<style lang="less" scoped>
.intro {
  padding: 20px;
  /deep/ .ant-list-item-content {
    position: absolute;
    right: 0;
    top: 12px;
  }
  .action {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.tag {
  padding: 0 10px;
  line-height: 23px;
  height: 24px;
  border-radius: 2px;
  background-color: @primary-color;
  border-color: @primary-color;
  color: #fff;
  float: left;
}
.dark-back1 {
  .artist-name {
    color: #ffffff;
  }
  .desc {
    color: #adafb2;
    .artist-briefDesc {
      &::-webkit-scrollbar-thumb {
        background: #2f3134;
      }
    }
  }
  .action {
    .ant-btn {
      color: #fff;
      background: #26272b !important;
      border: none !important;
      &:hover {
        background: #686a6e !important;
      }
    }
    .ant-btn[disabled] {
      color: #828385 !important;
      background: #26272b !important;
    }
  }
  .tag {
    background-color: #5fa7e4 !important;
  }
}
</style>
