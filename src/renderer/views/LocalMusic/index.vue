<template>
  <div class="local-music">
    <a-card :bordered="false">
      <div slot="title">
        <a-button icon="redo" size="small" type="primary" @click="refreshFolders" :disabled="matching">重新扫描</a-button>
        <a-button icon="api" size="small" type="primary" :disabled="!localSongs.length || matching" @click="matchSongs">匹配音乐</a-button>
        <small>{{ localSongs.length }}首歌曲,<span style="color:blue;cursor:pointer"   @click="visible = true">选择目录</span></small>
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
          正在匹配 {{ matchSuccessNum + matchFailedNum + matchRepeatNum }}/{{localSongs.length - matchedSongs}}
          <span style="width: 170px;display: inline-block; margin-left: 20px">
            <a-progress size="small" status="active" :percent="Math.floor((matchSuccessNum + matchFailedNum + matchRepeatNum) / (localSongs.length - matchedSongs) * 100)"/>
          </span>
        </small>
      </div>
      <track-list :columns="columns" :tracks="localSongs" :isShowActions="false" @dblclick="play">
        <template slot="size" slot-scope="{ row }">
          <span>{{ row.size | normalSize }}</span>
        </template>
      </track-list>
    </a-card>

    <a-modal centered :maskClosable="false" title="选择本地音乐文件夹" wrapClassName="bodyStyle" :width="400" v-model="visible" :afterClose='clearWaitFolders'>
      <a-checkbox-group @change="onChange" v-model="bufferFolder">
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
      columns,
      defaultDownloadFolder,
      matching: false,
      waitSelectFolder: [] // 用户已经选择但是没有确定的文件夹
    }
  },
  components: {
    TrackList, Loading
  },
  computed: {
    ...mapState('Localsong', ['exportFolders', 'needRefreshFolders']),
    ...mapGetters('Localsong', ['localSongs', 'matchSuccessNum', 'matchFailedNum', 'matchRepeatNum']),
    ...mapGetters('play', ['current_play_list']),
    matchedSongs () {
      return this.localSongs.filter( song => {
        return song.matched
      }).length
    }
  },
  methods: {
    ...mapActions('Localsong', ['refresh', 'match']),
    ...mapMutations('Localsong', ['setExportFolders', 'setneedRefreshFolders', 'clearMatchNum']),
    onChange () {
      console.log('value = ', this.selectedFolder)
    },
    async play (tracks, index) {
      await this.$store.dispatch('play/selectPlay', { tracks, index })
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
    async refreshFolders () {
      this.setneedRefreshFolders(this.selectedFolder)
      this.visible = false
      this.refreshing = true
      const curSongNums = this.localSongs.length
      await this.refresh(this.selectedFolder)
      this.refreshing = false
      const changeNums = this.localSongs.length - curSongNums
      if (changeNums == 0) Message.success('扫描本地音乐完成')
      else Message.success(`扫描本地音乐完成，${changeNums > 0 ? '新增' + changeNums : '减少' + -changeNums}首歌曲`)
    },
    async matchSongs () {
      this.matching = true
      await this.match(false)
      this.matching = false
      Message.success(`匹配完成！${this.matchSuccessNum ? '匹配成功' + this.matchSuccessNum + '首，' : ''}${this.matchFailedNum ? '匹配失败' + this.matchFailedNum + '首，' : ''}${this.matchRepeatNum ? this.matchRepeatNum + '首重复歌曲' : ''}`)
      this.clearMatchNum()
    },
    clearWaitFolders () { // 用户点击关闭按钮时将清空已添加但未确认扫描过的文件夹
      this.waitSelectFolder.splice(0, this.waitSelectFolder.length) // 清空新增文件
      this.bufferFolder = this.selectedFolder.concat() // 将缓存文件夹更新
    }
  },
  created () {
    this.selectedFolder = this.needRefreshFolders.concat()
    this.bufferFolder = this.needRefreshFolders.concat()
    this.refresh(this.selectedFolder)
    ipcRenderer.on('selectedItem', (event, path) => {
      // this.setExportFolders(uniq(this.exportFolders.concat(path)))
      this.bufferFolder = uniq(this.bufferFolder.concat(path))
      this.waitSelectFolder = uniq(this.waitSelectFolder.concat(path))
    })
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
}
.bodyStyle .ant-modal-body {
  padding: 12px 24px;
  min-height: 180px;
  max-height: 300px;
}
</style>
