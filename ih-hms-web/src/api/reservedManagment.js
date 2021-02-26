import request from '@/utils/request'

/**黑名单**/
export function getBlackList(params) { // 黑名单列表
  return request({
    url: '/outpatient/register/getBlackList',
    method: 'GET',
    params
  })
}

export function updateBlackList(params) { // 修改黑名单
  return request({
    url: '/outpatient/register/updateBlackList',
    method: 'POST',
    params
  })
}

/**预约记录**/
export function registerOrderList(params) { // 预约挂号列表
  return request({
    url: '/outpatient/register/registerOrderList',
    method: 'GET',
    params
  })
}

/**预约提示**/
export function listRegisterTips(params) { // 获取门诊科室预约提示列表
  return request({
    url: '/basics/outpatientDepart/listRegisterTips',
    method: 'GET',
    params
  })
}

export function getRegisterTips(params) { // 获取门诊科室预约提示详情
  return request({
    url: '/basics/outpatientDepart/getRegisterTips',
    method: 'POST',
    params
  })
}

export function updateRegisterTips(params) { // 修改门诊科室预约提示
  return request({
    url: '/basics/outpatientDepart/updateRegisterTips',
    method: 'POST',
    params
  })
}

/**预约挂号订单**/
export function listBookingNo(params) { // 可预约号源列表
  return request({
    url: '/outpatient/register/listBookingNo',
    method: 'GET',
    params
  })
}

export function updateBookingNo(params) { // 修改可预约号源安全比例
  return request({
    url: '/outpatient/register/updateBookingNo',
    method: 'POST',
    params
  })
}
