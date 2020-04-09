'use strict';

const sd = require('silly-datetime');

module.exports = {

  formatTime(params) { // 必须是 13 位的时间戳  10位的 *1000
    return sd.format(new Date(params), 'YYYY-MM-DD HH:mm');
  },


};
