import request from '@/utils/request'

/**问卷设置**/
export function apiQuestionnaireConfigList(params) { // 问卷设置列表
  return request({
    url: '/basics/questionnaireConfig/list',
    method: 'GET',
    params
  })
}

export function questionnaireConfigDetail(params) { // 问卷设置详情
  return request({
    url: '/basics/questionnaireConfig/goUpdate',
    method: 'GET',
    params
  })
}

export function questionnaireConfigAddOrUpdate(data) { // 问卷设置新增or更新
  return request({
    url: '/basics/questionnaireConfig/update',
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    data
  })
}

/**问卷数据**/
export function questionnaireDataList(params) { // 问卷数据列表
  return request({
    url: '/basics/questionnaireData/list',
    method: 'GET',
    params
  })
}

export function questionnaireDataDetail(params) { // 问卷数详情
  return request({
    url: '/basics/questionnaireData/detail',
    method: 'GET',
    params
  })
}

export function questionnaireDataIsShow(params) { // 是否前端显示
  return request({
    url: '/basics/questionnaireData/isShow',
    method: 'POST',
    params
  })
}

export function questionnaireDataCreate(data) { // 问卷数据创建
  return request({
    url: '/basics/questionnaireData/create',
    method: 'POST',
    data
  })
}

export function questionnaireStatisticsList(params) { // 问卷统计列表
  return request({
    url: '/basics/questionnaireStatistics/list',
    method: 'GET',
    params
  })
}

export function questionnaireStatisticsDetail(params) { // 问卷统计列表
  return request({
    url: '/basics/questionnaireStatistics/detail',
    method: 'GET',
    params
  })
}

export function questionnaireDataExportContent(params) { // 导出问卷统计列表
  return request({
    url: '/basics/questionnaireData/exportContent',
    method: 'GET',
    params
  })
}

export function listDepartSimpleList(params) { // 获取缓存科室列表
  return request({
    url: '/basics/outpatientDepart/listDepartSimpleList',
    method: 'GET',
    params
  })
}

export function questionnaireDataReply(params) { // 回复问卷
  return request({
    url: '/basics/questionnaireData/reply',
    method: 'POST',
    params
  })
}

