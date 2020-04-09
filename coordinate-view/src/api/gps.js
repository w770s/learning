/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    system
 * 创建时间:  2019-05-10 on 17:10
 * 描述:     TODO GPS模块
 *
 * @author   ZJB
 */

import request from '@/utils/request'

/**
 * 获取所有GPS车辆
 * @param params
 */
export function getCarGps(data) {
  return request({
    url: '/zd-gps/car-gps-info/map',
    method: 'post',
    data
  })
}
/**
 * 获取所有GPS车辆
 * @param params
 */
export function getAllCar(data) {
  return request({
    url: '/zd-gps/car-info/all',
    method: 'get',
    params: data
  })
}

/**
 * 获取所有GPS车辆
 * @param params
 */
export function getCarPage(data) {
  return request({
    url: '/zd-gps/car-info/page',
    method: 'get',
    params: data
  })
}
/**
 * 获取所有GPS车辆统计数量
 * @param params
 */
export function getCountCar(data) {
  return request({
    url: '/zd-gps/car-info/count',
    method: 'get'
  })
}

/**
 * 获取所有的运营商
 * @param params
 */
export function getOperators(data) {
  return request({
    url: '/zd-gps/operator-info/page',
    method: 'get',
    params: data
  })
}

/**
 * 新增运营商
 * @param params
 */
export function addOperator(data) {
  return request({
    url: '/zd-gps/operator-info/save',
    method: 'post',
    data: data
  })
}
