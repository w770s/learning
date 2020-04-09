'use strict';

const Service = require('egg').Service;

class UserService extends Service { // 抓取数据
  async requestUrl(url) {
    const { ctx } = this;
    const res = await ctx.curl(url);
    return res;
  }
}

module.exports = UserService;
