import axios from '@/libs/api.request'

export const getMapData = () => {
  return axios.request({
    url: '/api/statistic/v2/v2/aPicture/totalData',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}
export const getMoveLineData = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/aPicture/inflow',
    method: 'get',
    params
  })
}

// 统计分析
export const getAnalysisData = () => {
  return axios.request({
    url: '/api/statistic/v2/v2/statistics/data',
    method: 'get'
  })
}
// 实时监控
// 侧导航栏
export const getData = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineSupervise/allCarsInfo',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 港区、园区范围
export const getRange = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineLocation/GPSLine',
    params,
    method: 'get'
  })
}

export const baseXietongUrl = () => {
  // return 'http://whpgylxt.iasoco.com/api'
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'http://whpgylxt.iasoco.com'
    case 'test':
      return 'http://36.22.178.70:10005'
    case 'development':
      return 'http://192.168.1.18'
  }
}

export const baseXietongWsUrl = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'ws://whpgylxt.iasoco.com'
    case 'test':
      return 'ws://36.22.178.70:10005'
    case 'development':
      return 'ws://192.168.1.18'
  }
}
// 废物流入趋势数据,开发环境需要接入危废的数据需要以'api/waste'为前缀再进行拼接
export const getWasteFlowIn = () => {
  return axios.request({
    url: 'api/waste/api/electronicCouplet/wasteFlowIn',
    method: 'get'
  })
}

export const getWasteFlowInProvince = () => {
  return axios.request({
    url: 'api/waste/api/electronicCouplet/wasteFlowInProvince',
    method: 'get'
  })
}

export const getWasteFlowInCity = () => {
  return axios.request({
    url: 'api/waste/api/electronicCouplet/wasteFlowInCity',
    method: 'get'
  })
}

// 废物流出趋势数据
export const getWasteFlowOut = () => {
  return axios.request({
    url: 'api/waste/api/electronicCouplet/wasteFlowOut',
    method: 'get'
  })
}

export const getWasteFlowOutProvince = () => {
  return axios.request({
    url: 'api/waste/api/electronicCouplet/wasteFlowOutProvince',
    method: 'get'
  })
}

export const getWasteFlowOutCity = () => {
  return axios.request({
    url: 'api/waste/api/electronicCouplet/wasteFlowOutCity',
    method: 'get'
  })
}

/// --------------------------------分割线--------------------------------MapProcess--------------------------------
// 获取港区围栏
export const getParkRange = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineLocation/parkLine',
    params,
    method: 'get'
  })
}
// 获取港区围栏
export const getPortRange = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineLocation/portLine',
    params,
    method: 'get'
  })
}
// 获取园区内车辆
export const getParkCars = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/supervise/park',
    params,
    method: 'get'
  })
}
// 获取园区和港区内车辆文
export const getAllCars = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/supervise/traffic',
    params,
    method: 'get'
  })
}

// 根据运单id查询gps，货物跟踪接口
export const getCarGpsByOrderId = (id) => {
  return axios.request({
    url: '/api/statistic/v2/v2/supervise/' + id,
    method: 'get'
  })
}

// 安全证件即将到期数量
export const getWillExpireCer = () => {
  return axios.request({
    url: 'https://api.asoco.com.cn/oeoa/security/statistic/willExpireCer',
    method: 'get'
  })
}

// 作废 实时监控
// 获取右侧车辆查询数据
export const getRightList = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineSupervise/getRightList',
    data: params,
    method: 'post'
  })
}

// // 获取右侧车辆预警数据
// export const warnCarPage = (params) => {
//   return axios.request({
//     url: '/api/statistic/v2/v2/warnCar/page',
//     data: params,
//     method: 'post'
//   })
// }

// 获取所有车辆行车记录
export const allCarSeat = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineSupervise/list',
    data: params,
    method: 'post'
  })
}

// 获取所有车辆载货输数据信息
export const theCarMes = (params) => {
  return axios.request({
    url: '/api/statistic/v2/v2/lineSupervise/getGPS',
    data: params,
    method: 'post'
  })
}
/// --------------------- bjs ------------------

// 获取船舶列表
export const postShipMarker = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/getAllShipOneData',
    data,
    method: 'post',
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}
// 获取船舶详情
export const postShipPortInfo = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/queryShipPortInfo',
    data,
    method: 'post',
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}
// 获取泊位列表
export const postBerthList = () => {
  return axios.request({
    url: '/api2/berth/getAllBerthList',
    method: 'get'
  })
}

// 获取船舶详情
export const postOneShipData = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/getOneShipData',
    data,
    method: 'post',
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}
// 获取更多船舶
export const postMoreShip = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/getAreaShipByShipxy',
    data,
    method: 'post',
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}
