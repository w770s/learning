import { regionData } from 'element-china-area-data'

const city = ['北京市', '天津市', '上海市', '重庆市', '台湾省', '香港特别行政区', '澳门特别行政区']

export default {
  areaList: regionData,
  // 金额千分位
  formatThousands(m = 0, n) {
    m = m || 0
    const point = m.toString().split('.')[1]
    if (n != 0 && !n) {
      n = point ? point.length : 0
    }
    if (n == 0) {
      return m.toFixed(n).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
    } else {
      return m.toFixed(n).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
  },
  // 隐藏手机号中间四位
  phoneHide4(phone) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },
  // 数字或-验证
  validateZoneNumber(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入号码'))
    } else {
      if (/^[0-9|-]+$/.test(value)) {
        callback()
      } else {
        callback(new Error('号码有误'))
      }
    }
  },
  // 手机号验证
  validatePhoneNumber(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入号码'))
    } else {
      if (/^[1][3,4,5,6,7,8][0-9]{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('号码有误'))
      }
    }
  },
  // 身份证验证
  validateIdCard(rule, value, callback) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!reg.test(value)) {
      return callback(new Error('身份证格式不正确'))
    } else {
      return callback()
    }
  },
  // 详细地址验证
  validateAddress(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入'))
    } else {
      if (value.length < 5) {
        callback(new Error('不少于5个字'))
      } else {
        callback()
      }
    }
  },
  // 备注小于140个字
  validateRemarks(rule, value, callback) {
    if (value === '') {
      callback()
    } else {
      if (value.length > 140) {
        callback(new Error('备注不超过140个字'))
      } else {
        callback()
      }
    }
  },
  // 6-20位密码
  validatePassword(rule, value, callback) {
    if (value.length < 6 || value.length > 20) {
      callback(new Error('6-20位'))
    } else {
      if (/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('6-20位，英文、数字、符号'))
      } else {
        callback()
      }
    }
  },
  // 车牌号验证
  validatePlateNo(rule, value, callback) {
    var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
    if (!reg.test(value)) {
      return callback(new Error('车牌号格式不正确'))
    } else { return callback() }
  },
  // 运输证号验证
  validateTransportLicenseNo(rule, value, callback, type) {
    // if (type == 'TRUCK') {
    //     if (!(Number.isInteger(value) || value.length === 11)) {
    //         return callback(new Error('非挂车道路运输证号应为 11 位数字'))
    //     } else { return callback() }
    // } else {
    //     if (!(Number.isInteger(value) || value.length === 12)) {
    //         return callback(new Error('挂车道路运输证号应为 12 位数字'))
    //     } else { return callback() }
    // }
  },
  // 车架号验证
  validateCheckVin(rule, value, callback) {
    if (!(value.length === 17)) {
      return callback(new Error('车架号应为 17 位字母+数字'))
    } else {
      return callback()
    }
  },
  // 质量验证
  validateCheckWeight(rule, value, callback) {
    var reg = /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/
    if (value == '') {
      return callback(new Error('请填写'))
    }
    if (!reg.test(value)) {
      return callback(new Error('质量应为数字或浮点数格式'))
    } else { return callback() }
  },
  // 市级地址
  formatAddressCity(originDesc = '', destinationDesc = '') {
    let o = ''; let d = ''
    if (originDesc) {
      o = originDesc.split(',')
      o = city.includes(o[0]) ? o[0] : o[1]
    }
    if (destinationDesc) {
      d = destinationDesc.split(',')
      d = city.includes(d[0]) ? d[0] : d[1]
    }
    return o + '-' + d
  }
}
