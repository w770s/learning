import request from '@/utils/request'

/**医生列表**/
export function apiDoctorList(params) {
  return request({
    url: '/basics/doctor/getListDoctor',
    method: 'GET',
    params
  })
}

// 添加医生信息
export function apiAddDoctor() {
  return request({
    url: '/basics/doctor/addDoctor',
    method: 'POST'
  })
}

// 修改医生信息
export function apiUpdateDoctor(params) {
  return request({
    url: '/basics/doctor/updateDoctor',
    method: 'POST',
    params
  })
}

// 删除医生信息
export function apiDeleteDoctor(params) {
  return request({
    url: '/basics/doctor/deleteDoctor',
    method: 'POST',
    params
  })
}

// 根据ID查询医生信息
export function apiSelectDoctor(params) {
  return request({
    url: '/basics/doctor/selectDoctor',
    method: 'GET',
    params
  })
}

// 疾病信息
export function apiListDisease(params) {
  return request({
    url: '/basics/disease/listDisease',
    method: 'GET',
    params
  })
}

//   添加医生与疾病关系
export function apiAddDoctorDisease(params) {
  return request({
    url: '/basics/disease/addDoctorDisease',
    method: 'POST',
    params
  })
}

//   删除医生与疾病关系
export function apiDeleteDoctorDisease(params) {
  return request({
    url: '/basics/disease/deleteDoctorDisease',
    method: 'POST',
    params
  })
}

//   查询所有科室
export function apiListOutpatientDepart() {
  return request({
    url: '/basics/depart/listDepart',
    method: 'GET'
  })
}
