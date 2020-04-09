'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const list = await ctx.service.admin.getAdminList(); // 类似vuex
    ctx.body = 'hi, egg, service拿到的数据：' + list;
    // 模版必须放在 view
    // 模版必须放在 middleware
    // 数据库处理 service
    // 扩展 extend
  }
}

module.exports = HomeController;
