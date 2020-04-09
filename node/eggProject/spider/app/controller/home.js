'use strict';

const BaseController = require('../core/base');

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    // const list = await this.service.home.getList();
    // ctx.body = '我是F' + list;
    // await ctx.render('home', { // 1。这样做太麻烦， 最好配置个模版全局变量
    //   csrf: ctx.csrf, // 防止用户恶意请求
    // });
    await ctx.render('home', {});
  }
  async getPost() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
  }

  async success() {
    await this.successful('/'); // 不要用success 关键词
  }

  async error() {
    await this.errorful('/');
  }
}

module.exports = HomeController;
