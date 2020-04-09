import Cookies from 'js-cookie'

const TokenKey = 'zd_coordinate-token-key'
const BaseUrlKey = 'zd_coordinate-baseUrl-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getBaseURl() {
  return Cookies.get(BaseUrlKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setBaseUrl(baseUrl) {
  return Cookies.set(BaseUrlKey, baseUrl)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeBaseUrl() {
  return Cookies.remove(BaseUrlKey)
}
