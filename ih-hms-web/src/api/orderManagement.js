import request from '@/utils/request'

/**预约挂号列表**/
export function apiRegisterOrderList(params) {
  return request({
    url: '/outpatient/register/registerOrderList',
    method: 'GET',
    params
  })
}

// 查询预约挂号订单详情
export function apiSelectRegisterOrderERP(params) {
  return request({
    url: '/outpatient/register/selectRegisterOrderERP',
    method: 'GET',
    params
  })
}

/**查询门诊待缴费订单列表**/
export function apiClinicPayOrderList(params) {
  return request({
    url: '/outpatient/clinicPay/clinicPayOrderList',
    method: 'GET',
    params
  })
}

// 查询复诊订单列表
export function apiSelectClinicPayOrderERP(params) {
  return request({
    url: '/outpatient/clinicPay/selectClinicPayOrderERP',
    method: 'GET',
    params
  })
}

/**查询门诊待缴费订单列表**/
export function apiRepeatDiagnosisOrderList(params) {
  return request({
    url: '/outpatient/repeatDiagnosis/repeatDiagnosisOrderList',
    method: 'GET',
    params
  })
}

// 查询在线问诊订单详情
export function apiSelectRepeatDiagnosisERP(params) {
  return request({
    url: '/outpatient/repeatDiagnosis/selectRepeatDiagnosisERP',
    method: 'GET',
    params
  })
}



// 问卷数据详情
export function apiQuestionDetail(params) {
  return request({
    url: '/basics/questionnaireData/detail',
    method: 'GET',
    params
  })
}

// 支付成功同步his状态
export function apiSyncHisStatus(params) {
  return request({
    url: '/outpatient/clinicPay/syncHisStatus',
    method: 'GET',
    params
  })
}


// 调用同步和his代缴费同步
export function apiprescriptionOrderreportOrder(params) {
  return request({
    url: '/outpatient/prescriptionOrder/reportOrder',
    method: 'POST',
    params
  })
}

// 调用同步和his代缴费同步
export function apiihInspectionOrderreportOrder(params) {
  return request({
    url: '/outpatient/ihInspectionOrder/reportOrder',
    method: 'POST',
    params
  })
}

// 调用同步和his代缴费同步
export function apiinpatientSerivicereportOrder(params) {
  return request({
    url: '/inpatient/inpatientSerivice/reportOrder',
    method: 'POST',
    params
  })
}

// 医院检查验管理
export function apiHospitalInspations(params) {
  return request({
    url: '/outpatient/ihCheckInspectionInfo/hospitalInspations',
    method: 'GET',
    params
  })
}

// 查询检查验订单信息
export function apiGetHospitalDetail(params) {
  return request({
    url: '/outpatient/ihInspectionOrder/getOrderDetail',
    method: 'GET',
    params
  })
}

// 医院处方管理
export function apiHospitalPerscrition(params) {
  return request({
    url: '/outpatient/prescriptions/hospitalPerscrition',
    method: 'GET',
    params
  })
}

// 查询处方订单信息
export function apiGetOrderDetail(params) {
  return request({
    url: '/outpatient/prescriptionOrder/getOrderDetail',
    method: 'GET',
    params
  })
}

// 医院管理后台列表
export function apihosPayOrderList(params) {
  return request({
    url: '/inpatient/inpatientSerivice/hosPayOrderList',
    method: 'GET',
    params
  })
}

// 医院管理后台详情
export function apihosPayOrderDetails(params) {
  return request({
    url: '/inpatient/inpatientSerivice/hosPayOrderDetails',
    method: 'GET',
    params
  })
}

// 在线问诊订单统计
export function apiRepeatDiagnosisStatisticErp(params) {
  return request({
    url: '/outpatient/repeatDiagnosis/repeatDiagnosisStatisticErp',
    method: 'GET',
    params
  })
}

// 医院处方统计
export function apiPrescriptionStatistic(params) {
  return request({
    url: '/outpatient/prescriptions/PrescriptionStatistic',
    method: 'GET',
    params
  })
}

// 根据时间分组统计订单
export function apiamountStatByTime(params) {
  return request({
    url: '/order/stat/orderTypeStatByTime',
    method: 'GET',
    params
  })
}

// 预约挂号订单管统计
export function apiRegisterOrderStatisticErp(params) {
  return request({
    url: '/outpatient/register/RegisterOrderStatisticErp',
    method: 'GET',
    params
  })
}

// 健康卡用户增长量统计1
export function apihealthCardRiseStatistic(params) {
  return request({
    url: '/basics/healthCard/healthCardRiseStatistic',
    method: 'GET',
    params
  })
}

// 在线问诊订单增长统计2
export function apirepeatDiagnosisOrderStatistic(params) {
  return request({
    url: '/outpatient/repeatDiagnosis/repeatDiagnosisOrderStatistic',
    method: 'GET',
    params
  })
}

// 问卷星级统计3
export function apiQuestionnaireStarsStatistics(params) {
  return request({
    url: '/basics/questionnaireStatistics/QuestionnaireStarsStatistics',
    method: 'GET',
    params
  })
}

// 根据时间和订单类型统计
export function apistatByTime(params) {
  return request({
    url: '/order/stat/amountStatByTime',
    method: 'GET',
    params
  })
}