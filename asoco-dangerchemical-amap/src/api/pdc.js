import axios from '@/libs/api.request'
/* 流量存量api  bu BJS */

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
// 获取储罐列表
export const postTankMarker = (data) => {
  return axios.request({
    url: '/api2/storageTank/getStorageTankList',
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
// 获取堆场列表
export const postYardMarker = (data) => {
  return axios.request({
    url: '/api2/storageYard/getStorageYardList',
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
// 获取管道列表
export const postPipelineMarker = (data) => {
  return axios.request({
    url: '/api2/pipeline/getPipelineList',
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
// 获取电子报告接口
export const postElecReport = (data) => {
  return axios.request({
    url: '/api2/inOutData/epList',
    data,
    method: 'post'
  })
}
// 获取作业报告接口
export const postWorkReportList = (data) => {
  return axios.request({
    url: '/api2/inOutData/workList',
    data,
    method: 'post'
  })
}
// 查询船舶数量
export const postCountShip = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/countShip',
    data,
    method: 'post'
  })
}
// 全流程监管海关统计接口
export const postCountHG = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/countHG',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
// 全流程监管港务统计接口
export const postCountGW = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/countGW',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
// 货物申报单详情
export const postSchedule = (data) => {
  return axios.request({
    url: '/api2/dangerousGoodsMainInfo/getSchedule',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
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
export const postBerthList = (data) => {
  return axios.request({
    url: '/api2/berth/getAllBerthList',
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
// 获取更多船舶( from 船讯网)
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
// 查询船舶作业到港信息列表
export const shipList = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/queryShipWorkPortInfoList',
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
// 查询港区船舶列表
export const getPortShipList = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/getAreaShips',
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
// 查询正在作业船舶
export const berthShipList = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/countWorkingShip',
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
// 船舶详情
export const postShipMessage = (data) => {
  return axios.request({
    url: '/api2/peripheralInterface/getShipMessageByName',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
//  电子报告详情
export const postElectronicReport = (data) => {
  return axios.request({
    url: '/api2/loadData/getShipElectronicReportByReportId',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}

// 码头作业报告
export const postPortReport = (data) => {
  return axios.request({
    url: '/api2/dangerousGoodsMainInfo/getDangerousGoodsMainInfoById',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
// 电子报告查询
export const postPortReportList = (data) => {
  return axios.request({
    url: '/api2/loadData/getShipElectronicReportByShipNameAndReportTime',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
// 作业报告查询
export const postWorkReport = (data) => {
  return axios.request({
    url: '/api2/loadData/getShipWorkByShipNameAndReportTime',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
