import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/auth/oauth/token',
    method: 'get',
    params
  })
}
