/**
 * 项目名:    danger-waste-good-view
 * 包名
 * 文件名:    singleRouter
 * 创建时间:  2019-10-28 on 14:51
 * 描述:     TODO
 *
 * @author   XLA
 */
import request from '@/utils/request'

// 首页

export function getHomePageChart() {
  return request({
    url: '/system-enterprise/homesStatistics',
    method: 'POST'
  })
}

export function getHomePagePoint(params) {
  return request({
    url: '/system-enterprise/homeEnterprises',
    method: 'POST'
  })
}

// 统计分析

export function getStatisticsSelectChart() { // 查询表格所需数据
  return request({
    url: '/statistics/selectChart',
    method: 'POST'
  })
}

export function getStatisticsSelectTable(params) { // 查询统计合计表
  return request({
    url: '/statistics/selectTable',
    method: 'POST',
    params
  })
}

export function getStatisticsSelectFirm(params) { // 统计公司合计表
  return request({
    url: '/statistics/selectElectronicTable',
    method: 'POST',
    params
  })
}

// 申报登记-预警报警
// 分页
export function getWarnAlarmPage(params) {
  return request({
    url: '/declare-warning-alarm/page',
    method: 'GET',
    params
  })
}

export function updateAlarmBlack(data) {
  return request({
    url: '/system-enterprise/improve',
    method: 'POST',
    data
  })
}

export function getAlarmBlackPage(params) {
  return request({
    url: '/system-enterprise/page',
    method: 'GET',
    params
  })
}

// 评估打分

export function getRatingPage(params) {
  return request({
    url: '/info-deduction/page',
    method: 'GET',
    params
  })
}

export function getRatingDetail(params) {
  return request({
    url: '/declare-warning-alarm/page',
    method: 'GET',
    params
  })
}

export function getFrimAlarmPoint(params) { // 企业的报警点分类及数量
  return request({
    url: '/system-enterprise/enterpriseAlarmPoint',
    method: 'POST',
    params
  })
}

export function inventoryExcelImport(data) { // 库存管理-导出excel
  return request({
    url: '/declare-storage-management-logs/excelImport',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export function TrackExcelImport(data) { // 流程追踪-导出excel
  return request({
    url: '/declare-waste-product/excelImport',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export function alarmExcelImport(data) { // 预警报警-导出excel
  return request({
    url: '/declare-warning-alarm/excelImport',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export function electronicExcelImport(data) { // 电子台账-导出excel
  return request({
    url: '/declare-electronic-parameter/excelImport',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export function deductionExcelImport(data) { // 扣分记录-导出excel
  return request({
    url: '/info-deduction/excelImport',
    method: 'POST',
    responseType: 'blob',
    data
  })
}

export function statisticsExcelImport(data) { // 统计报表-导出excel
  return request({
    url: '/statistics/excelImport',
    method: 'GET',
    responseType: 'blob',
    data
  })
}

// 巡查记录
export function patrolRecord(params) {
  return request({
    url: '/inspection-record/page',
    method: 'GET',
    params
  })
}

export function patrolRfid(params) {
  return request({
    url: '/declare-waste-product/detail/rfid',
    method: 'GET',
    params
  })
}
