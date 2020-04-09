'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getList() {
    const data = [ '1', '2', '3', '4' ];
    return data;
  }

  async getNewsList() {
    const res = await this.ctx.curl(this.config.api + 'appapi.php?a=getPortalList&catid=20&page=1');
    // egg 中 ctx.curl 可以自己获取接口。类似于node 的 request 封装
    const paerseData = JSON.parse(res.data); // 把buffer(二进制) 数据转转换成 json
    const data = paerseData.result; // 数组
    return data;
  }

  async getNewsContent() {
    const res = await this.ctx.curl(this.config.api + `appapi.php?a=getPortalArticle&aid=${this.ctx.params.id}`);
    const paerseData = JSON.parse(res.data); // 把buffer(二进制) 数据转转换成 json
    const data = paerseData.result[0];
    return data;
  }
}

module.exports = UserService;
