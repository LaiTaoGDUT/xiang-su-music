<template>
  <div class="local-music" :class="{'dark-back1': isDark}">
    <a-card :bordered="false" :headStyle="headStyle">
      <div slot="title" style="display: flex; just;align-items: center;">
        <a-button-group size="small" class="local_music-playall">
          <a-button type="primary" icon="play-circle" @click="playAll" title="播放全部">播放全部</a-button>
          <a-button type="primary" icon="plus" title="添加所有到播放列表" @click="addToList"></a-button>
        </a-button-group>
        <a-button icon="redo" size="small" @click="refreshFolders" :disabled="matching || refreshing">扫描音乐</a-button>
        <a-button :icon="matching ? 'loading' : 'api'" size="small" :disabled="!localSongs.length || refreshing" @click="matchSongs">{{ matching ? '停止匹配' : '匹配音乐'}}</a-button>
        <small>{{ localSongs.length }}首歌曲,<a class="local_music-choose_dir" href="#" @click="visible = true">选择目录</a></small>
        <small style="margin-left: 10px" v-show="refreshing">
          <a-spin>
            <a-icon slot="indicator" type="loading" spin size="small" tip="Loading..." />
          </a-spin>
          扫描歌曲中......
        </small>
        <small style="margin-left: 10px" v-show="matching">
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
        <div style="flex-grow: 2">
          <small style="width: 170px; float: right">
            <a-input-search
              placeholder="搜索本地音乐..."
              v-model="keyword"
              class="header-search"
              @search="onSearch"
              @change="onChange"
              allow-clear
            />
          </small>
        </div>
      </div>

      <track-list @reloading="reloading" @reloaded="reloaded" :columns="columns" :tracks="currentShowSongs" :isShowActions="false" @dblclick="play" :limit="limit" >
        <template slot="size" slot-scope="{ row }">
          <span>{{ row.size | normalSize }}</span>
        </template>
        <div slot="actions" slot-scope="{ row }" style="justify-content: space-around; display: flex;">
          <a-icon type="folder" title="打开所在文件夹" @click="openFileInFolder(row)" />
          <a-icon type="delete" title="删除此歌曲" @click="deleteFile(row)" />
        </div>
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
import fs from 'fs'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { shell, remote, ipcRenderer } from 'electron'
import { getRandomInt } from '@/utils/calculate.js'
import { uniq } from '@/utils/calculate'
import TrackList from '@/components/Common/track-list/index.js'
import Message from 'ant-design-vue/es/message'
import { playMode } from '@/config/config'
import { uniqueData } from '@/utils/assist'
import debounce from 'loadsh/debounce'
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
      keyword: '',
      deleteCompletely: false,
      curSongNums: 0 // 记录刷新前本地音乐的数量
    }
  },
  components: {
    TrackList
  },
  computed: {
    ...mapState('Localsong', ['exportFolders', 'needRefreshFolders']),
    ...mapGetters('Localsong', ['localSongs', 'matchSuccessNum', 'matchFailedNum', 'stopMatching']),
    ...mapGetters('play', ['current_song', 'mode']),
    ...mapGetters('App', ['isDark']),
    headStyle () {
      return this.isDark ? {
        background: '#16181c'
      } : {}
    }
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
    ...mapMutations('Localsong', ['setExportFolders', 'setneedRefreshFolders', 'clearMatchNum', 'setStopMatching', 'delete']),
    reloaded () {
      this.$emit('loaded')
    },
    reloading () {
      this.$emit('reloading')
    },
    async play (tracks, index) {
      if (!fs.existsSync(tracks[index].url)) { // 文件不存在
        this.$message.error(`歌曲文件${tracks[index].url}已被删除`)
        this.delete(index)
        return
      }
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
      if (this.refreshing) {
        this.$message.warn('上一轮扫描还未完成哦')
        return
      }
      this.selectedFolder = this.bufferFolder.concat()
      if (this.waitSelectFolder.length) { // 有新添加的文件夹
        this.setExportFolders(uniq(this.exportFolders.concat(this.waitSelectFolder)))
        this.waitSelectFolder.splice(0, this.waitSelectFolder.length) // 清空
      }
      if (this.selectedFolder.length == this.needRefreshFolders.length) {
        if ( this.selectedFolder.concat().sort().toString() == this.needRefreshFolders.concat().sort().toString()) {
          this.visible = false
        } else {
          this.refreshFolders()
        }
      } else {
        this.refreshFolders()
      }
    },
    refreshFolders () {
      this.setneedRefreshFolders(this.selectedFolder)
      this.visible = false
      this.refreshing = true
      this.curSongNums = this.localSongs.length
      this.$nextTick(() => {
        this.refresh(this.selectedFolder)
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
    onChange: debounce(function (e) {
      this.keyword = e.target.value.toLowerCase()
      this.$emit('reloading')
      this.filterSongs()
      this.$emit('loaded')
    }, 600),
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
    },
    openFileInFolder (song) {
      let path = song.url
      let index = this.localSongs.findIndex(item => item.id === song.id)
      if (!fs.existsSync(path)) { // 文件不存在
        this.$message.error(`歌曲文件${path}已被删除`)
        this.delete(index)
        return
      }
      shell.showItemInFolder(path) // 打开文件所在文件夹
    },
    deleteFile (song) {
      let path = song.url
      let index = this.localSongs.findIndex(item => item.id === song.id)
      if (!fs.existsSync(path)) { // 文件不存在
        this.$message.error(`歌曲文件${path}已被删除`)
        this.delete(index)
        return
      }
      if (this.current_song.id === song.id) {
        this.$message.warn(`歌曲正在播放中`)
        return
      }
      this.deleteCompletely = false
      const self = this
      this.$confirm({
        title: '确定从列表中删除该音乐吗？',
        content: (
          <div>
            <a-switch  size="small" style="vertical-align: text-bottom;" onChange={this.changeDeleteCompletely}></a-switch>
            <span style="margin-left: 10px">同时删除本地文件</span>
          </div>
        ),
        icon: () => <a-icon type="info-circle" style="color: red"></a-icon>,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          if (self.deleteCompletely) {
            fs.unlink(path, err => {
              if (!err) {
                self.delete(index)
                self.$message.success('歌曲已删除')
              }
            })
          } else {
              self.delete(index)
              self.$message.success('歌曲已删除')
          }
        }
      })
    },
    changeDeleteCompletely (val) {
      this.deleteCompletely = val
    },
    playAll () {
      switch (this.mode) {
        case playMode.sequence:
          this.play(this.localSongs, 0)
          break
        case playMode.loop:
          this.play(this.localSongs, 0)
          break
        case playMode.random:
          this.play(this.localSongs, getRandomInt(0, this.localSongs.length - 1))
          break
      }
    },
    addToList () {
      let current_play_list = this.current_play_list.slice()
      let list = current_play_list.concat(this.localSongs)
      list = uniqueData(list)
      this.$store.commit('play/SET_CURRENT_PLAY_LIST', list)
      this.$electron.ipcRenderer.send('set-play-list', {
        value: list
      })
    }
  },
  created () {
    ipcRenderer.on('refresh-complete', (event, songs) => {
      setTimeout(() => { // 确保在本地列表更新后触发
        this.refreshing = false
        const changeNums = this.localSongs.length - this.curSongNums
        if (changeNums == 0) Message.success('扫描本地音乐完成')
        else Message.success(`扫描本地音乐完成，${changeNums > 0 ? '新增' + changeNums : '减少' + -changeNums}首歌曲`)
      }, 0)
    })
    ipcRenderer.on('refresh-not-complete', (event, songs) => {
      this.refreshing = true
    })

    this.curSongNums = this.localSongs.length
    this.currentShowSongs = JSON.parse(JSON.stringify(this.localSongs))
    this.selectedFolder = this.needRefreshFolders.concat()
    this.bufferFolder = this.needRefreshFolders.concat()
    ipcRenderer.on('selectedItem', (event, path) => {
      this.bufferFolder = uniq(this.bufferFolder.concat(path))
      this.waitSelectFolder = uniq(this.waitSelectFolder.concat(path))
    })
    if (this.localSongs.length <= 0) {
      this.refreshing = true
      this.$nextTick(() => {
        this.refresh(this.selectedFolder)
      })
    }
  },
  activated () {
    this.selectedFolder = this.needRefreshFolders.concat()
    this.bufferFolder = this.needRefreshFolders.concat()
  }
}
</script>

<style lang="less" scoped>
.local-music {
  /deep/ .ant-card-body {
    padding: 0!important;
  }
  .ant-btn {
    margin-right: 4px;
  }
  .local_music-playall {
    margin-right: 5px;
    border-radius: 4px;
    .ant-btn {
      margin-right: 0;
      background: @primary-color;
    }
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

.dark-back1 {
  background: #16181c;
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
    border: none !important;
    background: #26272b !important;
  }
  .local_music-playall {
    .ant-btn {
      background: #5fa7e4 !important;
      &:hover {
        background: #1A94E6 !important;
      }
    }
  }
  .local_music-choose_dir {
    color: #5fa7e4;
  }
  .ant-card-head-title {
    small {
      .ant-spin {
        color: #828385;
      }
      color: #828385;
    }
  }
  .header-search {
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
