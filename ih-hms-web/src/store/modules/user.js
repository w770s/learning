import { login } from '@/api/user'
import { getToken, setToken, setAdminId, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
const CryptoJS = require('crypto-js');

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    localStorage.clear();
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, grant_type: 'password',clientId: 'hms' }).then(response => {
        const {data} = response
        const token = 'Bearer'+' '+ data.token
        const routeData = CryptoJS.AES.encrypt(JSON.stringify(data.umsMenuNodeList),'secret key AiHui').toString()
        // const routeData = JSON.stringify(data.umsMenuNodeList)

        // start
        localStorage.setItem("route", routeData);
        // end
        
        commit('SET_TOKEN',token)
        setToken(token)
        setAdminId(data.adminId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_ROLES',['admin'] )
      resolve()
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        localStorage.clear();
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485

        resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      localStorage.clear();
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
