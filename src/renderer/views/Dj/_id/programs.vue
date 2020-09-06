<template>
  <div :class="{'dark-back1': isDark}">
    <div class="title">共 {{ total }} 期</div>
    <track-list :limit="limit" :columns="columns" :tracks="programs" :isShowHead="false" :isShowActions="false" @dblclick="play" >
      <!-- <template slot="name" slot-scope="{ row }">
        <div class="program">
          <img v-lazy="`${row.avatar}?param=40y40`" class="avatar" />
          <span>{{ row.name }}</span>
        </div>
      </template> -->
    </track-list>
    <div class="page">
      <a-pagination
        :defaultCurrent="1"
        :pageSize="limit"
        :total="total"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TrackList from '@/components/Common/track-list/index.js'
import { getDjProgram } from '@/api/dj'
import { normalSong } from '@/utils/song'
const columns = [
  {
    title: '音乐标题',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    slot: 'name'
  },
  {
    title: '歌手',
    dataIndex: 'artist',
    key: 'artist',
    sorter: (a, b) => a.artist[0].name.localeCompare(b.artist[0].name)
  },
  {
    title: '专辑',
    dataIndex: 'album',
    key: 'album',
    sorter: (a, b) => a.album.name.localeCompare(b.album.name)
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (a, b) => a.duration - b.duration
  }
]
export default {
  data () {
    return {
      programs: [],
      columns,
      total: 0,
      limit: 30,
      offset: 0,
      asc: false
    }
  },
  components: {
    TrackList
  },
  computed: {
    ...mapGetters('App', ['isDark'])
  },
  activated () {
    this._getDjProgram()
  },
  methods: {
    async _getDjProgram () {
      let id = this.$route.params.id
      let options = {
        rid: id,
        limit: this.limit,
        offset: this.offset,
        asc: this.asc
      }
      let { programs, more, count } = await getDjProgram(options)
      this.total = count
      let arr = []
      programs.forEach(program => {
        arr.push(normalSong(program.mainSong))
      })
      this.programs = arr
    },
    onPageChange (page, pageSize) {
      this.offset = (page - 1) * pageSize
      this._getDjProgram()
    },
    play (tracks, index) {
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  margin: 20px 0;
  text-align: center;
}
.program {
  margin: 8px 0;
  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}
.title {
  line-height: 30px;
  background: #f5f5f5;
  font-size: 12px;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
}
.dark-back1 {
  .title {
    background: #26272b;
    color: #adafb2;
    border-bottom: 1px solid #ddd;
  }
    .page {
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
