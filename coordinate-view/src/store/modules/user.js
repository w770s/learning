import { login, loginByUac, loginByUacOld, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  account: '',
  phone: '',
  userId: '',
  userIcon: '',
  role: [],
  permission: [],
  hasPermission: false,
  enterpriseCode: '',
  enterpriseName: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
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
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        const token = data.tokenType + data.accessToken
        setToken(token)
        commit('SET_TOKEN', token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login UAC交互登录
  loginByUac({ commit }, uacInfo) {
    return new Promise((resolve, reject) => {
      loginByUac(uacInfo).then(response => {
        const { data } = response
        const token = data.tokenType + data.accessToken
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login 老UAC交互登录
  loginByUacOld({ commit }, uacInfo) {
    return new Promise((resolve, reject) => {
      loginByUacOld(uacInfo).then(response => {
        const { data } = response
        const token = data.tokenType + data.accessToken
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
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
        const { account, phone, userId, userIcon, role, enterpriseCode, enterpriseName } = data.userInfo

        commit('SET_ACCOUNT', account)
        commit('SET_PHONE', phone)
        commit('SET_USERID', userId)
        commit('SET_USER_ICON', userIcon)
        commit('SET_ROLE', role)
        commit('SET_PERMISSION', data.permission)
        commit('SET_ENTERPRISE_NAME', enterpriseName)
        commit('SET_ENTERPRISE_CODE', enterpriseCode)
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
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
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

