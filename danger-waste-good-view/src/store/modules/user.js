import { login, getInfo, getBaseInfo } from '@/api/user'
import { getToken, setToken, removeToken, getBaseURl, setBaseUrl, removeBaseUrl } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  baseUrl: getBaseURl(),
  account: '',
  phone: '',
  userId: '',
  role: [],
  permission: [],
  hasPermission: false,
  enterpriseCode: '',
  enterpriseName: '',
  enterpriseStatus: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  REMOVE_TOKEN: (state, token) => {
    state.token = ''
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_USER_ICON: (state, userIcon) => {
    state.userIcon = userIcon
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_ENTERPRISE_CODE: (state, enterpriseCode) => {
    state.enterpriseCode = enterpriseCode
  },
  SET_ENTERPRISE_NAME: (state, enterpriseName) => {
    state.enterpriseName = enterpriseName
  },
  SET_HAS_PERMISSION: (state, hasPermission) => {
    state.hasPermission = hasPermission
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, imageCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, imageCode: imageCode }).then(response => {
        const { data } = response
        const token = data.tokenType + data.accessToken
        const baseUrl = data.imageUrl
        setToken(token)
        setBaseUrl(baseUrl)
        commit('SET_TOKEN', token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('信息获取失败，请重新登陆')
        }
        const { account, phone, userId, roleCode, enterpriseId, enterpriseName } = data
        commit('SET_ACCOUNT', account)
        commit('SET_PHONE', phone)
        commit('SET_USERID', userId)
        commit('SET_ROLE', roleCode)
        commit('SET_PERMISSION', roleCode)
        commit('SET_ENTERPRISE_NAME', enterpriseName)
        commit('SET_ENTERPRISE_CODE', enterpriseId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get getBaseInfo
  getBaseInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getBaseInfo().then(res => {
        const { data } = res
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 已经重置了权限路由
  hasPermission({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_HAS_PERMISSION', true)
      resolve()
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_HAS_PERMISSION', false)
      removeToken()
      removeBaseUrl()
      resetRouter()
      commit('REMOVE_TOKEN')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      removeBaseUrl()
      commit('REMOVE_TOKEN')
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

