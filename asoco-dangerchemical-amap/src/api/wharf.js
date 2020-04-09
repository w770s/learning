import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'
/* 码头作业api  bu BJS */

// 获取企业流入流出信息
export const getDayStockListByResourceId = (data) => {
  return axios.request({
    url: '/api4/dayStock/getDayStockListByResourceId',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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
// 轮播时传后台视频id 保存轮播信息
export const postCameraIdList = (data) => {
  return axios.request({
    url: '/api4/video/carousel/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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
// 轮播列表
export const getCarouselList = (data) => {
  return axios.request({
    url: '/api4/video/carousel/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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

// 视频抓图
export const getSnapPicture = (data) => {
  return axios.request({
    url: '/api4/camera/snap/picture',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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

// 获取截图列表
export const getSnapPictureList = (data) => {
  return axios.request({
    url: '/api4/camera/snap/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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

// 获取处理单号
export const getOrderNum = (data) => {
  return axios.request({
    url: '/api4/process/order/num',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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

// 保存处理单
export const postSaveOrUpdateProcess = (data) => {
  return axios.request({
    url: '/api4/process/saveOrUpdateProcess',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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

// 获取重大危险源列表
export const postDangerousList = (data) => {
  return axios.request({
    url: '/api4/major/hazard/sources/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}

// 查询码头作业违规类型
export const jobViolationType = (data) => {
  return axios.request({
    url: '/api4/wio/queryAll',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}
// 处理单详情
export const dealDetails = (data) => {
  return axios.request({
    url: '/api4/process/details/processId',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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
// 处理单列表
export const dealList = (data) => {
  return axios.request({
    url: '/api4/process/queryProcessList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}
// 整改处理单提交
export const abarbeitung = (data) => {
  return axios.request({
    url: '/api4/process/sendBack/abarbeitung',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
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

// 获取报警信息
export const postAlarmData = (data) => {
  return axios.request({
    url: '/api4/alarm/history/data',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}
// 获取传感器列表
export const postSensorMarker = (data) => {
  return axios.request({
    url: '/api4/getEquipmentList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}

// 获取传感器数量
export const postSensorData = (data) => {
  return axios.request({
    url: '/api4/equipment/queryCountAndAlarm',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}

// 获取重大危险源数量
export const postDangerousCount = (data) => {
  return axios.request({
    url: '/api4/major/countMajor',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}

// 获取报警列表
export const postAlarmList = (data) => {
  return axios.request({
    url: '/api4/equipment/queryAlarmData',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}

// 警情列表
export const postSendMessage = (data) => {
  return axios.request({
    url: '/api4/sms/send',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': getToken()
    }
  })
}
