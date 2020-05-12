import Vue from 'vue'
import Vuex from 'vuex'
import persistStatePlugin from './plugins/keep-state'
import modules from './modules'
Vue.use(Vuex)

const myPlugin = persistStatePlugin(['play'])

let store = new Vuex.Store({
  modules,
  plugins: [myPlugin]
})
export default store
