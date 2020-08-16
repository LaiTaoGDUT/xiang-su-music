<template>
  <div class="downloading">
    <a-card :bordered="false">
      <div slot="title">
        <a-button icon="delete" :disabled="!downloading.length" @click="openDownloadFolder">清空全部</a-button>

        <span>存储目录:{{ defaultDownloadFolder }} <a href="#" @click="openDownloadFolder">打开目录</a></span>
      </div>
      <loading v-show="loading" />
      <div style="margin: 10px">正在下载</div>
      <track-list @reloading="reloading" @reloaded="reloaded" :limit="limit" :columns="columns" :tracks="downloading" :isShowActions="false">
        <template slot="downloadPercent" slot-scope="{ row }">
          <div style="width:170px;line-height: 1;">
            <a-progress size="small" :percent="parseInt(row.downloadPercent)" />
            <div style="fontSize:11px;font-weight: 500;">
              <span>{{(parseInt(row.downloadPercent)/100 * row.totalBytes/1024/1000).toFixed(2)}}M</span>
              <span> / </span>
              <span>{{(row.totalBytes/1024/1000).toFixed(2)}}M</span>
            </div>
          </div>
        </template>
        <template slot="actions" slot-scope="{ row }">
          <div>
            <ul class="actions">
              <li class="item">
                <a-icon type="caret-right" title="开始下载" @click="toggleDownload(row, false)" v-if="row.isPaused === true" />
                <a-icon type="pause" title="暂停下载" @click="toggleDownload(row, true)" v-else />
                <a-icon type="close" title="取消下载" @click="cancelDownload(row)" />
              </li>
            </ul>
          </div>
        </template>
      </track-list>
      <div style="margin: 0 10px 10px">等待下载</div>
      <track-list @reloading="reloading" @reloaded="reloaded" :limit="limit" :columns="columns" :tracks="queue" :isShowActions="false">
        <template slot="downloadPercent">
          <div>等待中...</div>
        </template>
        <template slot="actions" slot-scope="{ row }">
          <div>
            <ul class="actions">
              <li class="item">
                <a-icon type="close" title="取消下载" @click="cancelDownload(row)" />
              </li>
            </ul>
          </div>
        </template>
      </track-list>
    </a-card>
  </div>
</template>

<script>
import fs from 'fs'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { shell, remote, ipcRenderer } from 'electron'
import { uniq } from '@/utils/calculate'
import TrackList from '@/components/Common/track-list/index.js'
import Loading from '@/components/Common/loading'
const columns = [
  {
    title: '音乐标题',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: '进度',
    dataIndex: 'downloadPercent',
    key: 'downloadPercent',
    slot: 'downloadPercent',
    sorter: (a, b) => a.downloadPercent - b.downloadPercent
  },
  {
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
    slot: 'actions'
  }
]
export default {
  data () {
    return {
      loading: false,
      columns,
      limit: 100
    }
  },
  components: {
    TrackList, Loading
  },
  computed: {
    ...mapState('Download', ['downloading', 'queue']),
    ...mapGetters('play', ['current_play_list']),
    ...mapGetters('Setting', ['downloadSongsFolders']),
    defaultDownloadFolder () {
      return this.downloadSongsFolders && this.downloadSongsFolders.length ? this.downloadSongsFolders[0] : ''
    }
  },
  methods: {
    reloaded () {
      this.loading = false
    },
    reloading () {
      this.loading = true
    },
    openDownloadFolder () {
      shell.showItemInFolder(this.defaultDownloadFolder)
    },
    toggleDownload (song, isPaused) {
      this.$set(song, 'isPaused', isPaused)
      ipcRenderer.send('download-toggle', {
        id: song.id
      })
    },
    cancelDownload (song) {
      if (!song.hasOwnProperty('downloadPercent')) {
        this.$store.commit('Download/REMOVE_QUEUE', song)
        return
      }
      ipcRenderer.send('download-cancel', {
        id: song.id
      })
      this.$store.commit('Download/REMOVE_DOWNLOADING', song)
      let filepath = `${this.defaultDownloadFolder}\\${song.name}.mp3`
      this.$store.dispatch('Download/download')
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    },
    cancelAll () {},
    pauseAll () {}
  }
}
</script>

<style lang="less" scoped>
.downloading {
  font-size: 12px;
  /deep/ .ant-btn{
    height: 28px;
    line-height: 26px;
    margin-right: 4px;
  }
  /deep/ .ant-card-body {
    padding: 0;
  }
  /deep/ .ant-card {
    background: transparent;
    .ant-card-head {
      font-size: 12px;
    }
  }
}
.actions {
  display: flex;
  .item {
    margin: 0 10px;
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }
}
</style>
