/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    system
 * 创建时间:  2019-05-10 on 17:10
 * 描述:     TODO 系统模块
 *
 * @author   ZJB
 */

import request from '@/utils/request'

export function getApiLog(params) {
  return request({
    url: '/log-api/page',
    method: 'get',
    params
  })
}

/**
 * 获取日志详情
 * @param params
 */
export function getApiLogDetail(params) {
  return request({
    url: '/log-api/detail',
    method: 'get',
    params
  })
}

export function getErrorLog(params) {
  return request({
    url: '/log-error/page',
    method: 'get',
    params
  })
}

/**
 * 获取异常详情
 * @param params
 */
export function getErrorLogDetail(params) {
  return request({
    url: '/log-error/detail',
    method: 'get',
    params
  })
}

/**
 * 获取字典
 * @param params
 */
export function getDictionary(data) {
  return request({
    url: '/system-dictionary/listTree',
    method: 'post',
    data
  })
}

/**
 * 新增或修改字典
 * @param params
 */
export function addOrUpdateDictionary(data) {
  return request({
    url: '/system-dictionary/submit',
    method: 'post',
    data
  })
}

/**
 * 删除字典
 * @param params
 */
export function deleteDictionary(data) {
  return request({
    url: '/system-dictionary/remove',
    method: 'post',
    data
  })
}

/**
 * 获取所有字典
 * @param params
 */
export function getAllDictionary() {
  return request({
    url: '/system-dictionary/all',
    method: 'get'
  })
}

/**
 * 获取用户企业详情
 * @param params
 */
export function getEnterpriseDetail() {
  return request({
    url: '/system-enterprise/detail',
    method: 'post'
  })
}

/**
 * 完善 或者修改企业信息
 * @param params
 */
export function improveEnterprise(data) {
  return request({
    url: '/system-enterprise/improve',
    method: 'post',
    data
  })
}
/**
 * 危废固废名录
 * @param params
 */
export function getWasteProductPage(params) {
  return request({
    url: '/system-waste-good/page',
    method: 'get',
    params
  })
}

/**
 * 地址检索
 * @param params
 */
export function placeSuccestion(params) {
  return request({
    url: '/bmap/place/suggestion',
    method: 'get',
    params
  })
}

/**
 * 逆地理解析
 * @param params
 */
export function reverseGeocoding(params) {
  return request({
    url: '/bmap/reverse/geocoding',
    method: 'get',
    params
  })
}

/**
 * 预警报警列表管理
 * @param params
 */
export function getWarningAlarmManage(params) {
  return request({
    url: '/system-warning-alarm-manager/page',
    method: 'get',
    params
  })
}

/**
 * 预警报警管理更新
 * @param params
 */
export function updateWarningAlarmManage(data) {
  return request({
    url: '/system-warning-alarm-manager/update',
    method: 'post',
    data
  })
}

export function versionUpdatePage(params) { // 分页
  return request({
    url: '/system-app-update/page',
    method: 'GET',
    params
  })
}

export function versionUpdateChange(data) { // 新增修改
  return request({
    url: '/system-app-update/submit',
    method: 'POST',
    data
  })
}

export function versionUpdateDel(params) { // 删除
  return request({
    url: '/system-app-update/remove',
    method: 'POST',
    params
  })
}

export function getPatrol() {
  return request({
    url: '/inspection-setting/page',
    method: 'GET'
  })
}

export function setPatrol(data) { // 巡查
  return request({
    url: '/inspection-setting/saveOrUpdate',
    method: 'POST',
    data
  })
}
/**
 * 文件上传
 * @param params
 */
export const getOssUrl = 'http://img.omgspring.cn/'

export const uploadUrl = process.env.VUE_APP_BASE_API + '/system-file/upload'

