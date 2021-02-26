import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
const AdminId = 'adminId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getAdminId() {
  return Cookies.get(AdminId)
}

export function setAdminId(adminId) {
  return Cookies.set(AdminId, adminId)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
