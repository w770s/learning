import request from '@/utils/request'

export function login(data) {
  const param = {
    account: data.username,
    password: data.password,
    isExpireLong: false
  }
  return request({
    url: '/zd-auth/token',
    method: 'post',
    params: param
  })
}

export function loginByUac(param) {
  return request({
    url: '/zd-auth/token/uac',
    method: 'post',
    params: param
  })
}

export function loginByUacOld(param) {
  return request({
    url: '/zd-auth/token/uac/old',
    method: 'post',
    params: param
  })
}

export function getInfo() {
  return request({
    url: '/zd-auth/user',
    method: 'POST'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getOeoaUrl() {
  return request({
    url: '/zd-auth/oeoa',
    method: 'post'
  })
}

// 获取所有路线信息
export function allLoadMes() {
  return request({
    url: '/v2/line/all',
    method: 'get'
  })
}

// 用户信息完善
export function checkUserInfo() {
  return request({
    url: '/zd-xt/enterprise/check',
    method: 'get'
  })
}
