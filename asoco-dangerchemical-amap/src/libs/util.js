// import Cookies from 'js-cookie'
import config from '@/config'
export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  let token = window.localStorage.getItem(TOKEN_KEY)
  return token ? token:false
}

export const clearToken = () => {
  window.localStorage.setItem(TOKEN_KEY, '')
}
