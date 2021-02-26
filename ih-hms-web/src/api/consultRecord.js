import request from '@/utils/request'

//   查看咨询订单详情
export function apiGetAdvisoryOrderInfo(params) {
  return request({
    url: '/outpatient/advisoryOrder/getAdvisoryOrderInfo',
    method: 'GET',  
    params
  })
}

//   查询订单列表
export function apiListAdvisoryOrder(params) {
  return request({
    url: '/outpatient/combination/listAdvisoryOrder',
    method: 'GET',
    params
  })
}
