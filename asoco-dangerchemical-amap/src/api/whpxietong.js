/**
 * 项目名:    asoco-dangerchemical-amap
 * 包名
 * 文件名:    whpxietong
 * 创建时间:  2019-07-02 on 14:19
 * 描述:     TODO
 *
 * @author   XLA
 */

// 危化品 新接口

// 全局流量新
import axios from '@/libs/api.request'

/**
 * @description 装卸货化学品排名/日
 * @param createTime
 */
export const cargoDayRank = (params) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/flow/chemical',
    method: 'post',
    data: params
  })
}

/**
 * @description 危化品流入/流出飞线地图
 */
export const hazardousChemicalMap = (params) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/flow/flight',
    method: 'get',
    params
  })
}

/**
 * @description 装卸货数量/日
 * @param createTime
 */
export const cargoOfDay = (data) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/flow/quantity',
    method: 'post',
    data: data
  })
}

/**
 * @description 企业信息统计
 */
export const firmStatistics = () => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/flow/total',
    method: 'get'
  })
}

/**
 * @description 查询七日流入流出趋势
 */
export const trendInTrendOut = () => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/flow/trend',
    method: 'get'
  })
}

/**
 * @description 导出Excel
 */
export const exportExcel = () => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/flow/downloadExcel',
    method: 'get'
  })
}

// 实时监控新

export const actualMonitor = (params) => {
  return axios.request({
    url: 'api/whp-xt/zd-gps/car-info/all',
    params,
    method: 'get'
  })
}

export const carGpsCurrent = (data) => {
  return axios.request({
    url: 'api/whp-xt/zd-gps/car-gps-info/map',
    data: data,
    method: 'POST'
  })
}

export const warnCarPage = (params) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/warn-car/page',
    params,
    method: 'get'
  })
}

// 统计分析新

/**
 * @description 装卸货时间情况
 * @param createTime
 * @returns
 */
export const statistic = (data) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/statistical/freight',
    method: 'post',
    data: data
  })
}

/**
 * @description 车辆访问次数
 */
export const carVisitTime = (data) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/statistical/car',
    method: 'post',
    data: data
  })
}

/**
 * @description 装卸货数量/日
 */
export const cargoDayNumber = (data) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/statistical/areas',
    method: 'post',
    data: data
  })
}

/**
 * @description 全国城市装卸总量排名
 */
export const cityCargoRank = () => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/statistical/city',
    method: 'get'
  })
}

/**
 * @description 装卸货化学品排名/日
 */
export const cargoDayRanking = (data) => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/statistical/chemical',
    method: 'post',
    data: data
  })
}

/**
 * @description 企业所在地统计-全国
 */
export const firmPlaceCalculate = () => {
  return axios.request({
    url: 'api/whp-xt/zd-xt/statistical/address',
    method: 'get'
  })
}

export const baseXietongUrl = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://whpgylxt-xt.iasoco.com'
    case 'test':
      return 'https://whpgylxt.asoco.com.cn'
    case 'development':
      return 'https://whpgylxt.asoco.com.cn'
  }
}
