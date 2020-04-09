'use strict';

const BaseController = require('./base.js');

class MainController extends BaseController {
  async index() {
    // 获取轮播图的数据
    const { ctx } = this;
    await ctx.render('admin/main/index');
  }
  async welcome() {
    // 获取欢迎页面
    const { ctx } = this;
    await ctx.render('admin/main/welcome');
  }
}
module.exports = MainController;
