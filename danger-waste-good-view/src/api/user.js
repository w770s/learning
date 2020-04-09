import request from '@/utils/request'

export function login(data) {
  const param = {
    account: data.username,
    password: data.password,
    imageCode: data.imageCode,
    isExpireLong: false
  }
  return request({
    url: '/auth/token',
    method: 'post',
    params: param
  })
}

// 获取我的人员分页
export function getSystemUserPage(params) {
  return request({
    url: '/system-user/page',
    method: 'GET',
    params
  })
}

// 获取我的人员分页
export function addSystemUser(data) {
  return request({
    url: '/system-user/submit',
    method: 'POST',
    data
  })
}
// 获取我的人员分页
export function delSystemUser(data) {
  return request({
    url: '/system-user/remove',
    method: 'POST',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/system-user/detail',
    method: 'POST'
  })
}

export function getBaseInfo() {
  return request({
    url: '/system-enterprise/checkDataIntegrity',
    method: 'GET'
  })
}

export function getAuthImage() {
  return request({
    url: '/auth/image',
    method: 'POST'
  })
}

export function improveSystemEnterprise(data) {
  return request({
    url: '/system-enterprise/improve',
    method: 'POST',
    data
  })
}
