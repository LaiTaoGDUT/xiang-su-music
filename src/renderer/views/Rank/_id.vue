<template>
  <div>
    <loading v-show="loading" />
    <a-list class="intro" :class="{'dark-back1': isDark}">
      <a-list-item v-if="rank">
        <a-list-item-meta>
          <div slot="title">
            <a-tag class="tag">排行榜</a-tag>
            <h1 class="rank-name">{{rank.name}}</h1>
          </div>
          <div slot="description">
            <div class="creator">
              <a-avatar class="creator-avatar" :src="`${rank.creator.avatarUrl}?param=32y32`"/>
              <span class="name">{{rank.creator.nickname}}</span>
              <span class="time">{{rank.createTime | toDate}}创建</span>
            </div>
            <ul class="actions">
              <li class="item">
                <a-button-group size="small">
                  <a-button type="primary" icon="play-circle" @click="playAll">播放全部</a-button>
                  <a-button type="primary" icon="plus" @click="addToList" />
                </a-button-group>
              </li>
              <li class="item">
                <a-button size="small" icon="check" @click="subscribe(2, rank)" v-if="rank.subscribed">
                  已收藏({{rank.subscribedCount}})
                </a-button>
                <a-button size="small" icon="folder-add" @click="subscribe(1, rank)" v-else>
                  收藏({{rank.subscribedCount}})
                </a-button>
              </li>
              <!-- <li class="item" @click="share">
                <a-button size="small" icon="share-alt">分享</a-button>
              </li> -->
              <li class="item">
                <a-button size="small" icon="download">下载全部</a-button>
              </li>
            </ul>
            <div class="desc">
              <span>简介：</span>
              <span v-html="rank.description" v-if="rank.description"></span>
              <span v-else>无</span>
            </div>
          </div>
          <img slot="avatar" width="200" height="200" v-lazy="`${rank.coverImgUrl}?param=200y200`" :key="rank.id" />
        </a-list-item-meta>
        <ul class="action">
          <li>
            <div>歌曲数</div>
            <strong>{{rank.trackCount}}</strong>
          </li>
          <li>
            <div>播放数</div>
            <strong>{{rank.playCount | toWan}}</strong>
          </li>
        </ul>
      </a-list-item>
    </a-list>
    <tab-bar :tabs=tabs @search="searchSongs" />
    <keep-alive>
      <router-view :rank="rank" :tracks="songs"/>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabBar from '@/components/Common/tabBar'
import Loading from '@/components/Common/loading'
import { getPlaylistDetail } from '@/api/playlist'
import { playMode } from '@/config/config'
import { getRandomInt } from '@/utils/calculate.js'
import { normalSong } from '@/utils/song'
import { uniqueData } from '@/utils/assist'
export default {
  name: 'rank_id',
  data () {
    return {
      tabs: [
        {
          name: 'rank-id-songs',
          label: '歌曲列表'
        },
        {
          name: 'rank-id-comment',
          label: '评论'
        }
      ],
      rank: null,
      tracks: [],
      loading: false,
      searchKey: ''
    }
  },
  components: {
    TabBar, Loading
  },
  activated () {
    this._getPlaylistDetail()
  },
  beforeRouteUpdate (to, from, next) {
    this._getPlaylistDetail(to.params.id)
    next()
  },
  computed: {
    ...mapGetters('App', ['isDark']),
    ...mapGetters('User', [ 'likedPlaylistIds' ]),
    ...mapGetters('play', [ 'current_play_list', 'mode' ]),
    songs () {
      return this.tracks.filter(track => {
        return track.name.includes(this.searchKey)
      })
    },
    isLiked () {
      return this.likedPlaylistIds.includes(this.rank.id)
    }
  },
  methods: {
    _getPlaylistDetail () {
      this.loading = true
      let id = this.$route.params.id
      getPlaylistDetail(id).then(res => {
        this.rank = res.playlist
        let arr = []
        res.playlist.tracks.forEach(track => {
          arr.push(normalSong(track))
        })
        this.tracks = arr
        this.loading = false
      })
    },
    searchSongs (value) {
      this.searchKey = value
    },
    play (tracks, index) {
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    playAll () {
      switch (this.mode) {
        case playMode.sequence:
          this.play(this.tracks, 0)
          break
        case playMode.loop:
          this.play(this.tracks, 0)
          break
        case playMode.random:
          this.play(this.tracks, getRandomInt(0, this.tracks.length - 1))
          break
      }
    },
    addToList () {
      let current_play_list = this.current_play_list.slice()
      let list = current_play_list.concat(this.tracks)
      list = uniqueData(list)
      this.$store.commit('play/SET_CURRENT_PLAY_LIST', list)
      this.$electron.ipcRenderer.send('set-play-list', {
        value: list
      })
    },
    subscribe (t, playlist) {
      this.$store.dispatch('User/subscribePlatlist', { t, playlist })
    },
    share () {
      let url = `https://music.163.com/#/discover/toplist?id=${this.rank.id}`
      let _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'
      _shareUrl += 'url=' + url
      _shareUrl += '&showcount=' + 1 // 参数showcount是否显示分享总数,显示：'1'，不显示：'0'，默认不显示
      _shareUrl += '&desc=' + '♪我发现一个不错的歌单-' + (this.rank.description || this.rank.name)
      _shareUrl += '&summary=' + '分享摘要'
      _shareUrl += '&title=' + '♪我发现一个不错的歌单-' + this.rank.name
      _shareUrl += '&site=' + 'https://music.163.com/'
      _shareUrl += '&pics=' + this.rank.coverImgUrl
      this.$electron.remote.shell.openExternal(_shareUrl)
    }
  }
}
</script>

<style scoped>
.intro >>> .ant-list-item {
  align-items: initial;
}

.intro >>> .ant-avatar {
  border-radius: 0;
}

.intro >>> .ant-list-item-content {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
<style lang="less" scoped>
.intro {
  padding: 20px;
  .creator {
    display: flex;
    align-items: center;
    .creator-avatar {
      border-radius: 50%;
      margin-right: 5px;
    }
    .name {
      margin-right: 5px;
      color: #333;
    }
    .time {
      font-size: 14px;
    }
  }
  .actions {
    margin: 15px 0;
    .item {
      display: inline-block;
      margin-right: 10px;
    }
    button {
      font-size: 14px;
    }
  }
  .action {
    display: flex;
    text-align: right;
    font-size: 12px;
    li {
      padding: 0 10px;
      &:not(:last-child) {
        border-right: 1px solid #ddd;
      }
    }
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
.desc {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.dark-back1 {
    .rank-name {
      color: #ffffff;
    }
    .creator {
      .name {
        color: #adafb2
      }
      .time {
        color: #828385;
      }
    }
    .actions {
      .item {
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
        .playlist-playall {
          .ant-btn {
            background: #5fa7e4 !important;
            &:hover {
              background: #1A94E6 !important;
            }
          }
        }
      }
    }
    .tags {
      color: #fff;
      a {
        color: #828385;
        &:hover {
          color: #fff;
        }
      }
    }
    .desc {
      color: #fff;
    }
    .action {
      color: #828385;
      li {
        &:not(:last-child) {
          border-right: 1px solid #828385;
        }
      }
    }
  .tag {
    background-color: #5fa7e4 !important;
  }
}
</style>
