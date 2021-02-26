import request from '@/utils/request'

//   根据时间查询银行、his及自有订单统计及是否平账，时间格式为 yyyy-MM-dd
export function apiAccountCheckByTime(params) {
  return request({
    url: '/order/stat/accountCheckByTime',
    method: 'GET',
    params
  })
}

// 查询小程序用户列表
export function listUserInfo(params) {
  return request({
    url: '/basics/user/listUserInfo',
    method: 'GET',
    params
  })
}
