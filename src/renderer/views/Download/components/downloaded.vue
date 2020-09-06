<template>
  <div class="downloaded" :class="{'dark-back1': isDark}">
    <a-card :bordered="false">
      <div slot="title">

        <a-button type="primary" icon="play-circle" @click="playAll" class="downloaded-playall">播放全部</a-button>
        <span class="download-nums" style="margin-left: 10px">{{ downloaded.length }}</span><span> 首歌曲,</span>
        <span>
           存储目录：{{ defaultDownloadFolder }}
          <a href="#" @click="openDownloadFolder">打开目录</a>
        </span>
      </div>
      <loading v-show="loading" />
      <track-list
        @reloading="reloading"
        @reloaded="reloaded"
        :limit="limit"
        :columns="columns"
        :tracks="downloaded"
        :isShowActions="false"
        @dblclick="play">
        <template slot="time" slot-scope="{ row }">
          <span>{{ moment(row.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
        <template slot="size" slot-scope="{ row }">
          <span>{{ row.size | normalSize }}</span>
        </template>
        <div slot="actions" slot-scope="{ row }" style="justify-content: space-around; display: flex;">
          <a-icon type="folder" title="打开所在文件夹" @click="openFileInFolder(row)" />
          <a-popconfirm placement="left" ok-text="删除" cancel-text="取消" @confirm="deleteFile(row)">
            <template slot="title">
              <p>是否删除下载文件？</p>
            </template>
             <a-icon slot="icon" type="info-circle" style="color: red" />
          <a-icon type="delete" title="删除此歌曲" style="cursor: pointer" />
          </a-popconfirm>
        </div>
      </track-list>
    </a-card>
  </div>
</template>

<script>
import fs from 'fs'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { shell, remote, ipcRenderer } from 'electron'
import { getRandomInt } from '@/utils/calculate.js'
import { uniq } from '@/utils/calculate'
import TrackList from '@/components/Common/track-list/index.js'
import Loading from '@/components/Common/loading'
import moment from 'moment'
import { playMode } from '@/config/config'
import { getUrl, generateName } from '@/utils/song'
const columns = [
  {
    title: '音乐标题',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
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
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    slot: 'size',
    sorter: (a, b) => a.size - b.size
  },
  {
    title: '下载时间',
    dataIndex: 'time',
    key: 'time',
    slot: 'time'
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (a, b) => a.duration - b.duration
  },
  {
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
    slot: 'actions',
    width: '50px'
  }
]
export default {
  data () {
    return {
      selectedFolder: [],
      columns,
      moment,
      limit: 100,
      loading: false
    }
  },
  components: {
    TrackList,
    Loading
  },
  computed: {
    ...mapGetters('Download', ['downloaded']),
    ...mapGetters('Setting', ['downloadSongsFolders']),
    ...mapGetters('App', ['isDark']),
    ...mapGetters('play', ['current_song', 'mode']),
    defaultDownloadFolder () {
      return this.downloadSongsFolders[0]
    }
  },
  methods: {
    ...mapMutations('Download', ['REMOVE_DOWNLOADED']),
    reloaded () {
      this.loading = false
    },
    reloading () {
      this.loading = true
    },
    openDownloadFolder () {
      shell.showItemInFolder(this.defaultDownloadFolder)
    },
    play (tracks, index) {
      if (!fs.existsSync(tracks[index].url)) { // 文件不存在
        this.$message.error(`歌曲文件${tracks[index].url}已被删除`)
        this.REMOVE_DOWNLOADED(index)
        return
      }
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    openFileInFolder (song) {
      let path = song.url
      let index = this.downloaded.findIndex(item => item.id === song.id)
      if (!fs.existsSync(path)) { // 文件不存在
        this.$message.error(`歌曲文件${path}已被删除`)
        this.REMOVE_DOWNLOADED(index)
        return
      }
      shell.showItemInFolder(path) // 打开文件所在文件夹
    },
    deleteFile (song) {
      let path = song.url
      let index = this.downloaded.findIndex(item => item.id === song.id)
      if (!fs.existsSync(path)) { // 文件不存在
        this.$message.error(`歌曲文件${path}已被删除`)
        this.REMOVE_DOWNLOADED(index)
        return
      }
      if (this.current_song.id === song.id) {
        this.$message.warn(`歌曲正在播放中`)
        return
      }
      fs.unlink(path, err => {
        if (!err) {
          this.REMOVE_DOWNLOADED(index)
          this.$message.success('歌曲已删除')
        }
      })
    },
    playAll () {
      switch (this.mode) {
        case playMode.sequence:
          this.play(this.downloaded, 0)
          break
        case playMode.loop:
          this.play(this.downloaded, 0)
          break
        case playMode.random:
          this.play(this.downloaded, getRandomInt(0, this.downloaded.length - 1))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.downloaded {
  font-size: 14px;
  /deep/ .ant-card {
    background: transparent;
    .ant-card-head {
      font-size: 14px;
    }
  }
  /deep/ .ant-btn {
    height: 28px;
    line-height: 26px;
  }
  /deep/ .ant-card-body {
    padding: 0;
  }
}
.dark-back1 {
  /deep/ .ant-card-head-title {
    span {
      color: #828385;
      a {
        color: #2e6bb0;
      }
    }
    .download-nums {
      color: #5fa7e4;
    }
    .ant-btn {
      color: #fff;
      background: #5fa7e4 !important;
      border: none !important;
      &:hover {
        background: #1A94E6 !important;
      }
    }
    .ant-btn[disabled] {
      color: #828385 !important;
      background: #26272b !important;
    }
    .downloaded-playall {
      span {
        color: #fff;
      }
    }
  }
}
</style>
