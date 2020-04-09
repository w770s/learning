import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'
/* 应急指挥api  bu BJS */

// 获取管道运输  TO DELETE
export const getData = (data) => {
  return axios.request({
    url: '/api1/pipeline/getPipelineAndReportList',
    data,
    method: 'post',
    headers: {
      'token': getToken()
    }
  })
}
// 用户登录
export const whpLogin = (data) => {
  return axios.request({
    url: '/api1/uacApi/login',
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
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'token': getToken()
    }
  })
}
// 获取15家码头企业接口
export const getCompanyByCode = (data) => {
  return axios.request({
    url: '/api1/company/getCompanyByCode',
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
// 事件范围内企业应急资源
export const getCompanyPreList = (data) => {
  return axios.request({
    url: '/api1/company/getCompanyPreList',
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

export const getStorageTankListByCompanyCode = (data) => {
  return axios.request({
    url: '/api1/storageTank/getStorageTankListByCompanyCode',
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

export const getPipelineAndReportList = (data) => {
  return axios.request({
    url: '/api1/pipeline/getPipelineAndReportList',
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

export const getHeweiAndBerth = (data) => {
  return axios.request({
    url: '/api1/workPoint/getWorkPointList',
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

export const getPointList = (data) => {
  return axios.request({
    url: '/api1/workReport/getPointList',
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
// 获取视频树
export const getCameraList = (data) => {
  return axios.request({
    url: '/api1/camera/getCameraListTree',
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

export const getTransReportListByWorkPointId = (data) => {
  return axios.request({
    url: '/api1/transReport/getTransReportListByWorkPointId',
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

export const getPointListByNameOrId = (data) => {
  return axios.request({
    url: '/api1/visualization/getPointListByNameOrId',
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
export const getDayStockOfVisualization = (data) => {
  return axios.request({
    url: '/api1/dayStock/getDayStockOfVisualization',
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

export const getInOutDataListOfVisualization = (data) => {
  return axios.request({
    url: '/api1/inOutData/getInOutDataListOfVisualization',
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

export const getShipListByOrderNum = (data) => {
  return axios.request({
    url: '/api1/ship/getShipListByOrderNum',
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
export const getSingleCall = (data) => {
  return axios.request({
    url: '/api1/call/singleCall',
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
// 挂断
export const getPhonePullDown = (data) => {
  return axios.request({
    url: '/api1/call/hangupNumCall',
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
// 组呼
export const getGroupCall = (data) => {
  return axios.request({
    url: '/api1/call/joinMeet',
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
// 结束会议
export const getDisbandment = (data) => {
  return axios.request({
    url: '/api1/call/disbandment',
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
// 会议踢人
export const kickMeetOneUser = (data) => {
  return axios.request({
    url: '/api1/call/kickMeetOneUser',
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
// 设置静音
export const settingMute = (data) => {
  return axios.request({
    url: '/api1/call/settingMute',
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
// 允许说话
export const allowedToSpeak = (data) => {
  return axios.request({
    url: '/api1/call/allowedToSpeak',
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
export const getPlayUrl = (data) => {
  return axios.request({
    url: '/api1/camera/getPlayUrl',
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
export const getShipMarker = (data) => {
  return axios.request({
    url: '/api1/alarm/findTrapezeByShipName',
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
// 获取接警ID
export const getAlarmId = (data) => {
  return axios.request({
    url: '/api1/alarm/getAlarmId',
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
// 保存船舶详情
export const toSaveShips = (data) => {
  return axios.request({
    url: '/api1/alarm/saveShips',
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
// 删除船舶
export const toDelShip = (data) => {
  return axios.request({
    url: '/api1/alarm/deleteShip',
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
// 保存车辆详情
export const toSaveCars = (data) => {
  return axios.request({
    url: '/api1/alarm/saveCars ',
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
// 删除车辆
export const toDelCar = (data) => {
  return axios.request({
    url: '/api1/alarm/deleteCars ',
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
// 查询车辆点位
export const getCarMarker = (data) => {
  return axios.request({
    url: '/api1/alarm/findTrapezeByCarNum',
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
export const getAlarmList = (data) => {
  return axios.request({
    url: '/api1/alarm/findAlarmList',
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
      ret = ret.substring(0, ret.length - 1)
      return ret
    }]
  })
}
// 查询事件列表
export const getAlarmNoStatusList = (data) => {
  return axios.request({
    url: '/api1/alarm/getAlarmList',
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
      ret = ret.substring(0, ret.length - 1)
      return ret
    }]
  })
}
// 保存接警事件
export const saveAlarmEvents = (data) => {
  return axios.request({
    url: '/api1/alarm/saveAlarmEvents',
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
// 改变应急事件
export const changeAlarmEvents = (data) => {
  return axios.request({
    url: '/api1/alarm/updateAlarmEvents',
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
// 查询设计车辆
export const getCarsList = (data) => {
  return axios.request({
    url: '/api1/alarm/findCarById',
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
// 查询涉及船舶
export const getShipsList = (data) => {
  return axios.request({
    url: '/api1/alarm/findShipById',
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
export const getTransferNum = (data) => {
  return axios.request({
    url: '/api1/call/truanslateCall',
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
// 信息发布详情
export const findMsgSubmittedList = (data) => {
  return axios.request({
    url: '/api1/msgSubmitted/findMsgSubmittedList',
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
// 根据id查询信息
export const findMsgSubmittedById = (data) => {
  return axios.request({
    url: '/api1/msgSubmitted/findMsgSubmittedById',
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
// 获取企业通讯录
export const gainAddressBook = (data) => {
  return axios.request({
    url: '/api1/organization/gainAddressBook',
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
// 获取调度组数据
export const findSchedulingGroup = (data) => {
  return axios.request({
    url: '/api1/organization/findSchedulingGroup',
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
// 搜索人员
export const getOrgTeamListById = (data) => {
  return axios.request({
    url: '/api1/orgTeam/getOrgTeamListById',
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
// 信息新增
export const infoAdd = (data) => {
  return axios.request({
    url: '/api1/msgSubmitted/saveMsgIssue',
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

export const getCargoListByWhpName = (data) => {
  return axios.request({
    url: '/api1/cargo/getCargoListByWhpName',
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
// 获取专家信息列表
export const getExpertsListByName = (data) => {
  return axios.request({
    url: '/api1/experts/getExpertsListByName',
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
// 获取案例库信息
export const getCaseBankListByEventType = (data) => {
  return axios.request({
    url: '/api1/caseBank/getCaseBankListByEventType',
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
export const getEmergencySuppliesListByDistance = (data) => {
  return axios.request({
    url: '/api1/emergencySupplies/getEmergencySuppliesListByDistance',
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
export const getEmergencySuppliesListByName = (data) => {
  return axios.request({
    url: '/api1/emergencySupplies/getEmergencySuppliesListByName',
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
export const getOrganizationList = (data) => {
  return axios.request({
    url: '/api1/organization/getOrganizationList',
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
export const getOrganizationPreList = (data) => {
  return axios.request({
    url: '/api1/organization/getOrganizationPreList',
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
// 根据企业名获取应急资源
export const getEmergencyResourceListByName = (data) => {
  return axios.request({
    url: '/api1/emergencyResource/getEmergencyResourceListByName',
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
// 查询通话记录
export const findCallRecordsAll = (data) => {
  return axios.request({
    url: '/api1/call/findCallRecordsAll',
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
// 同步报警列表
export const getSyncAlarmList = (data) => {
  return axios.request({
    url: '/api1/alarm/synAlarmList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
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

// 获取应急预案列表
export const genEmergencyPlan = (data) => {
  return axios.request({
    url: '/api1/emergencyPlan/getEmergencyPlanList',
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
// 根据企业名获取预案列表
export const getEmergencyPlanListByCompanyName = (data) => {
  return axios.request({
    url: '/api1/emergencyPlan/getEmergencyPlanListByCompanyName',
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
// 更新应急事件
export const updateAlarmEvents = (data) => {
  return axios.request({
    url: '/api1/alarm/updateAlarmEvents',
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
// 根据ID获取应急预案
export const getEmergencyPlanById = (data) => {
  return axios.request({
    url: '/api1/emergencyPlan/getEmergencyPlanById',
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
// 获取websocket地址
export const getWebsocketUrl = (data) => {
  return axios.request({
    url: '/api1/call/findWebSocketIp',
    data,
    method: 'post',
    headers: {
      'token': getToken()
    }
  })
}
/*                  -------------------------- 调用外部接口 ------------------------------                        */
// 获取gis园区
export const getCompanyGeoJson = (params) => {
  return axios.request({
    url: '/api/gis/api/v1/boundary/enterprise-geojson-bd',
    params,
    method: 'get'
  })
}
// 根据企业获取相应的设施
export const getGeoJson = (params) => {
  return axios.request({
    url: '/api/gis/api/v1/component/enterprise-geojson',
    params,
    method: 'get'
  })
}
// 获取传感器列表
export const getMonitorList = (data) => {
  return axios.request({
    url: '/api/monitor/api/access/trml-field/qry-record-list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'asoco-token': getToken()
    }
  })
}
// 获取传感器详情
export const getMonitorDetail = (data) => {
  return axios.request({
    url: '/api/monitor/api/access/qry-alarm-detail?alarmRecordId=' + data,
    method: 'get',
    headers: {
      'asoco-token': getToken()
    }
  })
}
