<template>
  <div class="local-music">
    <a-card :bordered="false">
      <div slot="title">
        <a-button icon="redo" size="small" type="primary" @click="refreshFolders" :disabled="matching">重新扫描</a-button>
        <a-button :icon="matching ? 'loading' : 'api'" size="small" type="primary" :disabled="!localSongs.length" @click="matchSongs">{{ matching ? '停止匹配' : '匹配音乐'}}</a-button>
        <small>{{ localSongs.length }}首歌曲,<a href="#" @click="visible = true">选择目录</a></small>
        <small style="margin-left: 10px" v-if="refreshing">
          <a-spin>
            <a-icon slot="indicator" type="loading" spin size="small" tip="Loading..." />
          </a-spin>
          扫描歌曲中......
        </small>
        <small style="margin-left: 10px" v-if="matching">
          <a-spin>
            <a-icon slot="indicator" type="loading" spin size="small" tip="Loading..." />
          </a-spin>
          正在匹配
          <span style="width: 170px;display: inline-block; margin-left: 10px">
            <a-progress
              :format="percent => `${matchSuccessNum + matchFailedNum}/${localSongs.length - matchedSongs}`"
              size="small"
              :percent="Math.floor((matchSuccessNum + matchFailedNum) / (localSongs.length - matchedSongs) * 100)"
            />
          </span>
        </small>
        <small style="width: 170px; float: right">
          <a-input-search
            placeholder="搜索本地音乐..."
            v-model="keyword"
            class="header-search"
            @search="onSearch"
            allow-clear
          />
        </small>
      </div>
      <loading v-show="!show" />
      <track-list v-if="show" @reloading="reloading" @reloaded="reloaded" :columns="columns" :tracks="currentShowSongs" :isShowActions="false" @dblclick="play" :limit="limit" >
        <template slot="size" slot-scope="{ row }">
          <span>{{ row.size | normalSize }}</span>
        </template>
      </track-list>
    </a-card>

    <a-modal centered :maskClosable="false" title="选择本地音乐文件夹" wrapClassName="bodyStyle" :width="400" v-model="visible" :afterClose='clearWaitFolders'>
      <a-checkbox-group v-model="bufferFolder">
        <div v-for="(folder) in exportFolders" :key="folder">
          <a-checkbox :value="folder">{{ folder }}</a-checkbox>
        </div>
        <div v-for="(folder) in waitSelectFolder" :key="folder">
          <a-checkbox :value="folder">{{ folder }}</a-checkbox>
        </div>
      </a-checkbox-group>
      <template slot="footer">
        <a-button key="back" @click="onOk">确认</a-button>
        <a-button key="submit" type="primary" @click="addFolder">添加文件夹</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { shell, remote, ipcRenderer } from 'electron'
import { uniq } from '@/utils/calculate'
import TrackList from '@/components/Common/track-list/index.js'
import Loading from '@/components/Common/loading'
import Message from 'ant-design-vue/es/message'
const defaultDownloadFolder = `${remote.app.getPath('music')}`
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
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    sorter: (a, b) => a.duration - b.duration
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    slot: 'size',
    width: '80px',
    sorter: (a, b) => a.size - b.size
  }
]

export default {
  name: 'local_music',
  data () {
    return {
      visible: false,
      refreshing: false,
      selectedFolder: [],
      bufferFolder: [], // 缓存数组，暂存选中状态已更改但未确定的文件夹
      columns: columns,
      currentShowSongs: [], // 当前显示的歌曲
      defaultDownloadFolder: defaultDownloadFolder,
      matching: false,
      waitSelectFolder: [], // 用户已经选择但是没有确定的文件夹
      matchedSongs: 0, // has matched songs
      limit: 100, // 单页展示的歌曲数量
      show: false,
      keyword: ''
    }
  },
  components: {
    TrackList, Loading
  },
  computed: {
    ...mapState('Localsong', ['exportFolders', 'needRefreshFolders']),
    ...mapGetters('Localsong', ['localSongs', 'matchSuccessNum', 'matchFailedNum', 'stopMatching']),
    ...mapGetters('play', ['current_play_list'])
  },
  watch: {
    localSongs (newVal) {
      this.currentShowSongs = JSON.parse(JSON.stringify(newVal))
      this.$emit('reloading')
      this.filterSongs()
      this.$emit('loaded')
    }
  },
  methods: {
    ...mapActions('Localsong', ['refresh', 'match']),
    ...mapMutations('Localsong', ['setExportFolders', 'setneedRefreshFolders', 'clearMatchNum', 'setStopMatching']),
    reloaded () {
      this.$emit('loaded')
    },
    reloading () {
      this.$emit('reloading')
    },
    async play (tracks, index) {
      await this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    addFolder () {
      ipcRenderer.send('open-directory-dialog') // 告诉主线程打开文件目录
    },
    onOk () {
      if (!this.bufferFolder.length) {
        this.$message.warn('至少选择一个文件夹')
        return
      }
      this.selectedFolder = this.bufferFolder.concat()
      if (this.waitSelectFolder.length) { // 有新添加的文件夹
        this.setExportFolders(uniq(this.exportFolders.concat(this.waitSelectFolder)))
        this.waitSelectFolder.splice(0, this.waitSelectFolder.length) // 清空
      }
      this.refreshFolders()
    },
    refreshFolders () {
      this.setneedRefreshFolders(this.selectedFolder)
      this.visible = false
      this.refreshing = true
      const curSongNums = this.localSongs.length
      this.refresh(this.selectedFolder).then(() => {
        this.refreshing = false
        const changeNums = this.localSongs.length - curSongNums
        if (changeNums == 0) Message.success('扫描本地音乐完成')
        else Message.success(`扫描本地音乐完成，${changeNums > 0 ? '新增' + changeNums : '减少' + -changeNums}首歌曲`)
      })
    },
    matchSongs () {
      if (this.matching) {
        this.stopMatchSongs()
      } else {
        this.startMatchSongs()
      }
    },
    async startMatchSongs () {
      this.matching = true
      this.matchedSongs = this.getMatchedSongs()
      await this.match(false)
      this.matching = false
      Message.success(`匹配完成！${this.matchSuccessNum ? '匹配成功' + this.matchSuccessNum + '首 ' : ''}${this.matchFailedNum ? '匹配失败' + this.matchFailedNum + '首 ' : ''}`)
      this.clearMatchNum()
    },
    stopMatchSongs () {
      this.setStopMatching(true)
    },
    clearWaitFolders () { // 用户点击关闭按钮时将清空已添加但未确认扫描过的文件夹
      this.waitSelectFolder.splice(0, this.waitSelectFolder.length) // 清空新增文件
      this.bufferFolder = this.selectedFolder.concat() // 将缓存文件夹更新
    },
    getMatchedSongs () {
      return this.localSongs.filter( song => {
        return song.matched
      }).length
    },
    onSearch (keyword) {
      this.keyword = keyword.toLowerCase()
      this.$emit('reloading')
      this.filterSongs()
      this.$emit('loaded')
    },
    filterSongs () {
      this.currentShowSongs = this.localSongs.filter(song => {
        if (song.name && song.name.toLowerCase().includes(this.keyword)) {
          return true
        }
        if (song.artist.length > 0) {
          for (let i = 0; i < song.artist.length; i++) {
            if (song.artist[i].name && song.artist[i].name.toLowerCase().includes(this.keyword)) {
              return true
            }
          }
        }
        if (song.album.name && song.album.name.toLowerCase().includes(this.keyword)) {
          return true
        }
        return false
      })
    }
  },
  created () {
    this.currentShowSongs = JSON.parse(JSON.stringify(this.localSongs))
    this.selectedFolder = this.needRefreshFolders.concat()
    this.bufferFolder = this.needRefreshFolders.concat()
    ipcRenderer.on('selectedItem', (event, path) => {
      // this.setExportFolders(uniq(this.exportFolders.concat(path)))
      this.bufferFolder = uniq(this.bufferFolder.concat(path))
      this.waitSelectFolder = uniq(this.waitSelectFolder.concat(path))
    })
    setTimeout( () => {
      this.visible = false
      this.refreshing = true
      const curSongNums = this.localSongs.length
      this.refresh(this.selectedFolder).then(() => {
        this.refreshing = false
        const changeNums = this.localSongs.length - curSongNums
        if (changeNums == 0) Message.success('扫描本地音乐完成')
        else Message.success(`扫描本地音乐完成，${changeNums > 0 ? '新增' + changeNums : '减少' + -changeNums}首歌曲`)
      })
      this.show = true
    }, 0)
  },
  activated () {
    this.selectedFolder = this.needRefreshFolders.concat()
    this.bufferFolder = this.needRefreshFolders.concat()
  }
}
</script>

<style lang="less">
.local-music {
  /deep/ .ant-card-body {
    padding: 0!important;
  }
  .ant-btn {
    margin-right: 4px;
  }
  .header-search {
    /deep/ .ant-input {
      height: 24px;
      border-radius: 12px;
      border: 1px solid #bfbfbf;
      box-shadow: none;
      font-size: 12px;
    }

  }
}
.bodyStyle .ant-modal-body {
  padding: 12px 24px;
  min-height: 180px;
  max-height: 300px;
}
</style>
