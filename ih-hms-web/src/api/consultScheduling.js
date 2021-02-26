import request from '@/utils/request'

//   医生排班列表
export function apiDoctorSchedulelist(params) {
  return request({
    url: '/outpatient/combination/doctorSchedulelist',
    method: 'GET',
    params
  })
}

export function apiUpdateDoctorSchedule(data) { // 修改医生排班信息
  return request({
    url: '/outpatient/doctorSchedul/updateDoctorSchedule',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    data
  })
}
