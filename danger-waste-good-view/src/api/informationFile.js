/**
 * 项目名:    danger-waste-good-view
 * 包名
 * 文件名:    informationFile
 * 创建时间:  2019-09-19 on 18:05
 * 描述:     TODO
 *
 * @author   XLA
 */

// 信息档案
import request from '@/utils/request'

// 信息档案-产费管理管理-危费处置企业列表
export function getStorageManagePage(params) {
  return request({
    url: '/declare-storage-management-logs/page',
    method: 'GET',
    params
  })
}

export function getStorageManageDel(data) {
  return request({
    url: '/declare-storage-management-logs/remove',
    method: 'POST',
    data
  })
}

export function changeStorageManage(data) {
  return request({
    url: '/declare-storage-management-logs/submit',
    method: 'POST',
    data
  })
}

// 信息档案-产废管理
export function getProduceManagerPage(params) {
  return request({
    url: '/info-produce-manager/page',
    method: 'GET',
    params
  })
}

export function getProduceManagerDel(params) {
  return request({
    url: '/info-produce-manager/remove',
    method: 'POST',
    params
  })
}

export function saveProduceManager(data) {
  return request({
    url: '/info-produce-manager/save',
    method: 'POST',
    data
  })
}

export function selectProduceManagerById(params) {
  return request({
    url: '/info-produce-manager/selectById',
    method: 'POST',
    params
  })
}

// 信息档案-环评信息
export function getEiaDetail(params) { // 编辑详情
  return request({
    url: '/info-eia/eiaDetail',
    method: 'POST',
    params
  })
}

export function getEiaPage(params) {
  return request({
    url: '/info-eia/page',
    method: 'GET',
    params
  })
}

export function getEiaDel(params) {
  return request({
    url: '/info-eia/remove',
    method: 'POST',
    params
  })
}

export function saveEia(data) {
  return request({
    url: '/info-eia/save',
    method: 'POST',
    data
  })
}

export function changeEia(data) {
  return request({
    url: '/info-eia/update',
    method: 'POST',
    data
  })
}

export function changeAndSubmitEia(data) {
  return request({
    url: '/info-eia/submit',
    method: 'POST',
    data
  })
}

// 信息档案-第三方企业信息
export function getThirdEnterprisePage(params) {
  return request({
    url: '/info-third-part-enterprise/page',
    method: 'GET',
    params
  })
}

export function getThirdEnterpriseRemove(params) {
  return request({
    url: '/info-third-part-enterprise/remove',
    method: 'POST',
    params
  })
}

export function getThirdEnterpriseSave(data) {
  return request({
    url: '/info-third-part-enterprise/save',
    method: 'POST',
    data
  })
}

export function getThirdPartLikeNameList(params) {
  return request({
    url: '/info-third-part-enterprise/getLikeNameList',
    method: 'POST',
    params
  })
}

// 信息档案-第三方车辆信息
export function getThirdCarPage(params) {
  return request({
    url: '/info-third-part-car/page',
    method: 'GET',
    params
  })
}

export function getThirdCarRemove(params) {
  return request({
    url: '/info-third-part-car/remove',
    method: 'POST',
    params
  })
}

export function getThirdCarSave(data) {
  return request({
    url: '/info-third-part-car/save',
    method: 'POST',
    data
  })
}

export function getThirdCarType() {
  return request({
    url: '/system-car-type/selectAll',
    method: 'POST'
  })
}

export function getThirdCarNameList(params) {
  return request({
    url: '/info-third-part-car/getLikeNameList',
    method: 'POST',
    params
  })
}

// 信息档案-第三方人员信息
export function getThirdPersonPage(params) {
  return request({
    url: '/info-third-part-person/page',
    method: 'GET',
    params
  })
}

export function getThirdPersonRemove(params) {
  return request({
    url: '/info-third-part-person/remove',
    method: 'POST',
    params
  })
}

export function getThirdPersonSave(data) {
  return request({
    url: '/info-third-part-person/save',
    method: 'POST',
    data
  })
}

export function getThirdPersonNameList(params) {
  return request({
    url: '/info-third-part-person/getLikeNameList',
    method: 'POST',
    params
  })
}

// 系统 - 危废名录（模糊查询危废列表）环评
export function getFuzzyQuery(params) {
  return request({
    url: '/system-waste-good/likeList',
    method: 'GET',
    params
  })
}

// 系统 - 危废名录（模糊查询危废列表）分页
export function getWasteGoodPage(params) {
  return request({
    url: '/system-waste-good/page',
    method: 'GET',
    params
  })
}

// 管理计划新增
export function getManagePlanPage(params) {
  return request({
    url: '/info-manage-plan/page',
    method: 'GET',
    params
  })
}

export function getManagePlanDetail(params) {
  return request({
    url: '/info-manage-plan/planInfo',
    method: 'POST',
    params
  })
}

// 管理计划新增
export function addManagePlan(data) {
  return request({
    url: '/info-manage-plan/save',
    method: 'POST',
    data
  })
}

// 根据危废名称模糊查询危废列表
export function getLikeNameList(params) {
  return request({
    url: '/system-waste-good/likeNameList',
    method: 'GET',
    params
  })
}

// 贮存点
export function getInfoStoragePage(params) {
  return request({
    url: '/info-storage/page',
    method: 'GET',
    params
  })
}

export function getInfoStorageRemove(params) {
  return request({
    url: '/info-storage/remove',
    method: 'POST',
    params
  })
}

export function getInfoStorageSave(data) {
  return request({
    url: '/info-storage/save',
    method: 'POST',
    data
  })
}

export function getInfoStorageSelectById(params) {
  return request({
    url: '/info-storage/selectById',
    method: 'POST',
    params
  })
}

// 流程追踪
export function getDetailProcessTrack(params) {
  return request({
    url: '/declare-waste-product/processTracking',
    method: 'POST',
    params
  })
}

// 政府端 信息档案
export function getAuthorityRecordPage(params) { // 分页
  return request({
    url: '/system-enterprise/page',
    method: 'GET',
    params
  })
}

export function getAuthorityBaseInfo(params) { // 基本信息
  return request({
    url: '/system-enterprise/detail',
    method: 'POST',
    params
  })
}

// 委托处置管理
export function selectCurrentPage(params) {
  return request({
    url: '/declare-transfer/page',
    method: 'GET',
    params
  })
}

export function selectCurrentPlan(params) {
  return request({
    url: '/declare-transfer/page',
    method: 'GET',
    params
  })
}

export function produceStorageList(params) {
  return request({
    url: '/info-produce-manager/nameList',
    method: 'POST',
    params
  })
}

export function produceManagerList(params) { // 产废
  return request({
    url: '/info-produce-manager/list',
    method: 'POST',
    params
  })
}
export function syncProductManager() { // 同步环评信息产废
  return request({
    url: '/info-eia/sync',
    method: 'POST'
  })
}

export function saveProductTransfer(data) { // 新增
  return request({
    url: '/declare-transfer/submit',
    method: 'POST',
    data
  })
}

export function disposeManageCheck(data) { // 检测
  return request({
    url: '/declare-transfer/check/dispose/enterprise',
    method: 'POST',
    data
  })
}
