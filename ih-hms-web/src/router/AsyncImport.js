const routerViewMap = {
  'Layout': () => import('@/layout'),
  '/views/medicalManagement/dataMaintain/index': () => import('@/views/medicalManagement/dataMaintain/index'),
  '/views/medicalManagement/dataMaintain/doctorDetails': () => import('@/views/medicalManagement/dataMaintain/doctorDetails'),
  '/views/medicalManagement/setConsult/index': () => import('@/views/medicalManagement/setConsult/index'),
  '/views/medicalManagement/setConsult/addConsult': () => import('@/views/medicalManagement/setConsult/addConsult'),
  '/views/medicalManagement/consultScheduling/index': () => import('@/views/medicalManagement/consultScheduling/index'),
  '/views/medicalManagement/consultRecord/index': () => import('@/views/medicalManagement/consultRecord/index'),
  '/views/medicalManagement/consultRecord/consultDetail': () => import('@/views/medicalManagement/consultRecord/consultDetail'),

  '/views/bookManagement/bookHint/index': () => import('@/views/bookManagement/bookHint/index'),
  '/views/bookManagement/bookHint/detail': () => import('@/views/bookManagement/bookHint/detail'),
  '/views/bookManagement/sourceAvailable': () => import('@/views/bookManagement/sourceAvailable'),
  '/views/bookManagement/bookRecord': () => import('@/views/bookManagement/bookRecord'),
  '/views/bookManagement/blackList': () => import('@/views/bookManagement/blackList'),

  '/views/questionnaire/questionnaireSet/index': () => import('@/views/questionnaire/questionnaireSet/index'),
  '/views/questionnaire/questionnaireSet/detail': () => import('@/views/questionnaire/questionnaireSet/detail'),
  '/views/questionnaire/questionnaireData/index': () => import('@/views/questionnaire/questionnaireData/index'),
  '/views/questionnaire/questionnaireData/detail': () => import('@/views/questionnaire/questionnaireData/detail'),
  '/views/questionnaire/questionnaireStatistics/index': () => import('@/views/questionnaire/questionnaireStatistics/index'),
  '/views/questionnaire/questionnaireStatistics/detail': () => import('@/views/questionnaire/questionnaireStatistics/detail'),

  '/views/orderManagement/registerManagement/index': () => import('@/views/orderManagement/registerManagement/index'),
  '/views/orderManagement/registerManagement/details': () => import('@/views/orderManagement/registerManagement/details'),
  '/views/orderManagement/consultationManagement/index': () => import('@/views/orderManagement/consultationManagement/index'),
  '/views/orderManagement/consultationManagement/details': () => import('@/views/orderManagement/consultationManagement/details'),
  '/views/orderManagement/prescriptionManagement/index': () => import('@/views/orderManagement/prescriptionManagement/index'),
  '/views/orderManagement/prescriptionManagement/details': () => import('@/views/orderManagement/prescriptionManagement/details'),
  '/views/orderManagement/inspectionManagement/index': () => import('@/views/orderManagement/inspectionManagement/index'),
  '/views/orderManagement/inspectionManagement/details': () => import('@/views/orderManagement/inspectionManagement/details'),
  '/views/orderManagement/outpatientOrder/index': () => import('@/views/orderManagement/outpatientOrder/index'),
  '/views/orderManagement/outpatientOrder/details': () => import('@/views/orderManagement/outpatientOrder/details'),
  '/views/orderManagement/hospitalOrder/index': () => import('@/views/orderManagement/hospitalOrder/index'),
  '/views/orderManagement/hospitalOrder/details': () => import('@/views/orderManagement/hospitalOrder/details'),
  '/views/orderManagement/dataStatistics/index': () => import('@/views/orderManagement/dataStatistics/index'),

  '/views/reconciliation/incomeStatistics/index': () => import('@/views/reconciliation/incomeStatistics/index'),
  '/views/reconciliation/reconciliationPlatform/index': () => import('@/views/reconciliation/reconciliationPlatform/index'),
  '/views/userManagement/userPage/index': () => import('@/views/userManagement/userPage/index'),
}
export default (key) => {
  return routerViewMap[key] || null
}
