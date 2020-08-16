<template>
  <setting-item label="歌曲下载目录">
    <div title="更改目录">
      <a-icon type="folder" style="margin-right: 5px" />
      <span>{{ defaultDownloadFolder }}</span>
      <a-button size="small" @click="select">更改目录</a-button>
      <a-button size="small" @click="reset">恢复默认</a-button>
    </div>
  </setting-item>
</template>
<script>
import SettingItem from './SettingItem.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { remote } from 'electron'
import { uniq } from '@/utils/calculate'

const { dialog } = remote
export default {
  components: {
    SettingItem
  },
  computed: {
    ...mapState('Localsong', [ 'exportFolders', 'needRefreshFolders' ]),
    ...mapGetters('Localsong', ['localSongs']),
    ...mapGetters('Setting', [ 'downloadSongsFolders' ]),
    defaultDownloadFolder () {
      return this.downloadSongsFolders[ 0 ]
    }
  },
  methods: {
    ...mapMutations('Setting', [ 'SET_FOLDERS' ]),
    ...mapMutations('Localsong', [ 'setExportFolders', 'setneedRefreshFolders' ]),
    ...mapActions('Localsong', ['refresh']),
    select () {
      dialog.showOpenDialog(
        {
          properties: [ 'openDirectory' ]
        },
        filePaths => {
          if ( filePaths && filePaths.length ) {
            this.SET_FOLDERS(filePaths)
            this.setExportFolders(uniq(this.exportFolders.concat(filePaths)))
            this.setneedRefreshFolders(uniq(this.needRefreshFolders.concat(filePaths)))
            this.refresh(this.needRefreshFolders)
          }
        }
      )
    },
    reset () {
      let folder = [ `${remote.app.getPath('music')}` ]
      this.SET_FOLDERS(folder)
      this.setExportFolders(uniq(this.exportFolders.concat(folder)))
      this.setneedRefreshFolders(uniq(this.needRefreshFolders.concat(folder)))
    }
  }
}
</script>
