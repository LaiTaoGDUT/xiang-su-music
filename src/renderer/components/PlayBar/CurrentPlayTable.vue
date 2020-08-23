<template>
  <div class="play-cur-table">
    <loading v-show="loading" />
    <track-list @reloading="reloading" :columns="columns" @reloaded="reloaded" :limit="limit" :isShowHead="false" :isShowActions="false" :tracks="current_play_list" @dblclick="play">
      <div slot="actions" slot-scope="{ index }" style="justify-content: space-around; display: flex;">
        <a-icon type="close" title="从列表中删除" @click="_deleteSong(index)" />
      </div>
    </track-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TrackList from '@/components/Common/track-list/index.js'
import Loading from '@/components/Common/loading'
export default {
  components: { TrackList, Loading },
  computed: {
    ...mapGetters('play', [
      'current_play_list'
    ])
  },
  data () {
    return {
      limit: 100,
      loading: false,
      columns: [
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
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          slot: 'actions',
          width: '50px'
        }
      ]
    }
  },
  methods: {
    ...mapActions('play', ['deleteSong']),
    reloaded () {
      this.loading = false
    },
    reloading () {
      this.loading = true
    },
    play (tracks, index) {
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    _deleteSong (index) {
      this.deleteSong({ index, self: this })
    }
  }
}
</script>
