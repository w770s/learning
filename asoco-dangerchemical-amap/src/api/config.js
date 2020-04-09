import axios from '@/libs/api.request'
export const getConfig = () => {
  return axios.request({
    url: '/api/v1/config/detail',
    method: 'get'
  })
}
