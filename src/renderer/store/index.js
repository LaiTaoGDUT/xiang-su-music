import Vue from 'vue'
import Vuex from 'vuex'
import persistStatePlugin from './plugins/keep-state'
import modules from './modules'
Vue.use(Vuex)
 // 记录用户，上次播放的歌曲，本地歌曲列表，设置和软件更新
const myPlugin = persistStatePlugin(['User', 'play', 'Localsong', 'Setting', 'Update'])

let store = new Vuex.Store({
  modules,
  plugins: [myPlugin]
})
export default store
