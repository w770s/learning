/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    compliance
 * 创建时间:  2019-05-15 on 14:49
 * 描述:     TODO 合规模块
 *
 * @author   ZJB
 */

import request from '@/utils/request'

/**
 * 根据关键字查询化学品数据库
 * @param params
 */
export function searchBaseInfo(data) {
  return request({
    url: '/zd-hg/chemical/data/local/search',
    method: 'post',
    data
  })
}

/**
 *  根据化学品uuid获取化学品详情-查询本地库
 * @param params
 */
export function getBaseInfoDetail(data) {
  return request({
    url: '/zd-hg/chemical/data/api/detailLocal/uuid',
    method: 'post',
    data
  })
}

/**
 *  根据化学品Name获取化学品详情-查询本地库
 * @param params
 */
export function getBaseInfoDetailByName(data) {
  return request({
    url: '/zd-hg/chemical/data/detailLocal/name',
    method: 'post',
    data
  })
}

/**
 *  根据化学品ID获取化学品详情-查询本地库
 * @param params
 */
export function getBaseInfoDetailById(data) {
  return request({
    url: '/zd-hg/chemical/data/detailLocal/id',
    method: 'post',
    data
  })
}

/**
 *  根据化学品uuid获取化学品详情-查询本地库
 * @param params
 */
export function searchUn(data) {
  return request({
    url: '/zd-hg/un/search',
    method: 'post',
    data
  })
}

/**
 *  根据化学品uuid获取化学品详情-查询本地库
 * @param params
 */
export function getUnDetail(data) {
  return request({
    url: '/zd-hg/un/detail',
    method: 'post',
    data
  })
}

/**
 *  根据化学品uuid获取化学品详情-查询本地库
 * @param params
 */
export function getRegulation(data) {
  return request({
    url: '/zd-hg/regulation/list',
    method: 'post',
    data
  })
}

/**
 * 获取法规分页
 * @param params
 */
export function getRegulationPage(data) {
  return request({
    url: '/zd-hg/regulation/page',
    method: 'get',
    params: data
  })
}

/**
 *  危化品登记
 * @param params
 */
export function addRegister(data) {
  return request({
    url: '/zd-hg/register/save',
    method: 'post',
    data
  })
}

