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
    url: '/zd-system/log-api/page',
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
    url: '/zd-system/log-api/detail',
    method: 'get',
    params
  })
}

export function getErrorLog(params) {
  return request({
    url: '/zd-system/log-error/page',
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
    url: '/zd-system/log-error/detail',
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
    url: '/zd-system/dictionary/listTree',
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
    url: '/zd-system/dictionary/submit',
    method: 'post',
    data
  })
}

/**
 * 删除字典
 * @param params
 */
export function deleteDictionary(params) {
  return request({
    url: '/zd-system/dictionary/remove',
    method: 'post',
    params
  })
}

/**
 * 获取所有字典
 * @param params
 */
export function getAllDictionary() {
  return request({
    url: '/zd-system/dictionary/all',
    method: 'get'
  })
}

/**
 * 获取停车 记录
 * @param params
 */
export function getParkList(params) {
  return request({
    url: '/zd-gate/gate-push-log/page',
    method: 'get',
    params
  })
}

/**
 * 获取卡口配置
 * @param params
 */
export function getGateSet(params) {
  return request({
    url: '/zd-gate/gate-set/all',
    method: 'get',
    params
  })
}

/**
 * 获取白名单记录
 * @param params
 */
export function getGateWhiteList(params) {
  return request({
    url: '/zd-gate/gate-white/page',
    method: 'get',
    params
  })
}

/**
 * 上传文件URl
 * @type {string}
 */
export const uploadUrl = process.env.VUE_APP_BASE_API + '/zd-system/file/upload'

/**
 * 获取OSS url
 * @param params
 */
export function getOssUrl() {
  return process.env.VUE_APP_BASE_API
}

