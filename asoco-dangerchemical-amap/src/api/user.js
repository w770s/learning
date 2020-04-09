import axios from '@/libs/api.request'

export const getUserInfo = (params) => {
  return axios.request({
    url: '/api/v1/user/info',
    params,
    method: 'get'
  })
}

/**
 * @description 登出
 * @param token
 * @returns {*|void|AxiosPromise<any>}
 */
export const logout = () => {
  return axios.request({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}
