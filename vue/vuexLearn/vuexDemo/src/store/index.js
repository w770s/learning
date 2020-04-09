import Vue from 'vue'
import Vuex from 'vuex'
import {INCREMENT, DECREMENT } from './mapMutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  getters: {// computed
    myCount (state) {
      return `my new count is ${state.count}+12`
    }
  },
  mutations: { // vue devtools 有记录
    [INCREMENT] (state) {
      state.count++
    },
    [DECREMENT] (state) {
      state.count--
    },
    getData (state, data) {
      state.count = data.data
    }
  },
  actions: {
    // Promise 逻辑处理
    async MyIncrement ({commit}) {
      const arr = [1, 2, 2, 33, 4] // await axios.get(....)
      commit('INCREMENT')
      return arr
    },
    // MyGetData (context, data) {
    //   context.commit('getData', data)
    // },
    MyGetData ({commit}, data) {
      commit('getData', data)
    },
    MyDecrement (context) {
      context.commit('DECREMENT')
    }
  }
})

export default store
