import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import realTimeMonitoring from './module/realTimeMonitoring'
// import dataAnalysis from './module/dataAnalysis'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    // dataAnalysis
    realTimeMonitoring
  }
})
