'use strict';

const sd = require('silly-datetime');
module.exports = {
  formatTime(params) {
    // console.log(new Date(params)); // 10位的时间戳，在js是有问题的 Invalid Date
    // this 是 helper 对象
    return sd.format(new Date(params * 1000), 'YYYY-MM-DD HH:mm');
  },

  getHelper() {
    return 'helper 默认挂在在context下（ctx）';
  },
};
