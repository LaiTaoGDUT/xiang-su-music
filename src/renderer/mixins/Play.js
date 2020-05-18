export default {
  methods: {
    async play (tracks, index) {
      this.$store.dispatch('play/selectPlay', { tracks, index })
      this.$electron.ipcRenderer.send('change-play-index', {
        index: index
      })
      this.$electron.ipcRenderer.send('set-play-list', {
        value: tracks
      })
    },
    download (song) {
      this.$store.dispatch('Download/download', song)
    }
  }
}
