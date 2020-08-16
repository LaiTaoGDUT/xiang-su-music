<template>
  <a-menu mode="inline" :selectable="false" :defaultOpenKeys="['playlist_subscribed']">
    <a-sub-menu key="playlist_subscribed">
      <div slot="title" class="subscribed-title">
        <span>收藏的歌单</span>
      </div>
      <a-menu-item v-for="item in subscribedList" :key="item.id">
        <a-dropdown :trigger="['contextmenu']" overlayClassName="sider-right-menu">
          <div class="flex" :title="item.name">
            <router-link class="link" :to="`/playlist/${item.id}`">
              <z-icon type="yinleliebiaokuai" />
              <span>{{item.name}}</span>
            </router-link>
          </div>

          <a-menu slot="overlay">
            <a-menu-item :key="item.id">
              <div @click="removePlaylist(2,item.id)">
                <a-icon type="delete" />
                <span>删除歌单(Delete)</span>
              </div>
            </a-menu-item>
            <a-menu-item key="2">
              <div @click="playAll(item.id)">
                <a-icon type="play-circle" />
                <span>播放全部</span>
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import ZIcon from '@/components/ZIcon'
import { getRandomInt } from '@/utils/calculate.js'
import { getPlaylistDetail } from '@/api/playlist'
import { normalSong } from '@/utils/song'
import { playMode } from '@/config/config'
export default {
  data () {
    return {}
  },
  components: {
    ZIcon
  },
  computed: {
    ...mapGetters('User', ['userId', 'subscribedList', 'likedsongIds']),
    ...mapGetters('play', ['mode'])
  },
  methods: {
    removePlaylist (action, pid) {
      this.$store.dispatch('User/removePlaylist', { action, pid })
    },
    playAll (pid) {
      getPlaylistDetail(pid).then(res => {
        let tracks = res.playlist.tracks.map(track => {
          return normalSong(track)
        })
        switch (this.mode) {
          case playMode.random:
            let num = getRandomInt(0, tracks.length - 1)
            this.$store.dispatch('play/selectPlay', { tracks, index: num })
            this.$electron.ipcRenderer.send('change-play-index', {
              index: num
            })
            this.$electron.ipcRenderer.send('set-play-list', {
              value: tracks
            })
            break
          default:
            this.$store.dispatch('play/selectPlay', { tracks, index: 0 })
            this.$electron.ipcRenderer.send('change-play-index', {
              index: 0
            })
            this.$electron.ipcRenderer.send('set-play-list', {
              value: tracks
            })
        }
      })
    }
  }
}
</script>
