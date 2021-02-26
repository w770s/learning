import request from '@/utils/request'

//   医生咨询配置列表
export function apiListDoctorConfig(params) {
  return request({
    url: '/outpatient/combination/listDoctorConfig',
    method: 'GET',
    params
  })
}

//   修改医生咨询配置
export function apiAddAdvisoryConfig(params) {
  return request({
    url: '/outpatient/advisoryConfig/addAdvisoryConfig',
    method: 'POST',
    params
  })
}
