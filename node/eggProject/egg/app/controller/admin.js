'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const list = await ctx.service.admin.getAdminList(); // 注意： 这里要加  ctx.service.admin(模块名称).函数 注意加await
    await ctx.render('index', {
      data: 'world',
      list,
    });
  }
}

module.exports = HomeController;
