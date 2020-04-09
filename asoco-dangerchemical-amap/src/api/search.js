import axios from '@/libs/api.request'

export const getUn = data => {
  return axios.request({
    url: 'api/whp-xt/zd-hg/un/search',
    data,
    method: 'post'
  })
}

export const getCas = data => {
  return axios.request({
    url: 'api/whp-xt/zd-hg/chemical/data/local/search',
    data,
    method: 'post'
  })
}

export const getCL = (params) => {
  return axios.request({
    url: 'api/whp-xt/zd-hg/regulation/page',
    params,
    method: 'get'
  })
}


