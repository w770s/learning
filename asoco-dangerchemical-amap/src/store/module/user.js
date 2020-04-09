import { getToken, setToken, clearToken } from '@/libs/util'
import { getUserInfo, logout } from '@/api/user'
import { config } from '@/config'

export default {
  state: {
    userName: '',
    userId: '',
    token: getToken()
  },
  mutations: {
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  getters: {
    token: state => state.token,
    userName: state => state.userName,
    userId: state => state.userId
  },
  actions: {
    getUserInfo ({ state, commit }) { // 获取用户相关信息
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            if (res.code == 0) {
              const data = res.data
              commit('setUserName', data.name)
              commit('setUserId', data.id)
              commit('setToken', data.token)
              resolve(state)
            } else {
              reject(res.message)
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          if (res.code === 0) {
            commit('setToken', '')
            clearToken()
            resolve(res)
          } else {
            reject(res.message)
          }
        })
      })
    }
  }
}
