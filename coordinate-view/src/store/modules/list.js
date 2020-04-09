/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    list
 * 创建时间:  2019-06-11 on 19:01
 * 描述:     TODO
 *
 * @author   XLA
 */
import { allLoadMes } from '@/api/user'

const state = {
  allRoutesInfo: []
}

const mutations = {
  ALL_ROUTES_INFO: (state, routeInfo) => {
    state.allRoutesInfo = routeInfo
  }
}

const actions = {
  // 获取所有路线信息
  getAllRouteMessage({ commit, state }) {
    return new Promise((resolve, reject) => {
      allLoadMes().then(response => {
        commit('ALL_ROUTES_INFO', response.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
