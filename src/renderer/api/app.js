import axios from 'axios'

// 检查更新
export function checkUpdate () {
  return axios.get('https://api.github.com/repos/xiaozhu188/electron-vue-cloud-music/releases/latest')
}
