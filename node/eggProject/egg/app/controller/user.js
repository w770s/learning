'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() { // 动态路由 :id
    const { ctx } = this;
    console.log(ctx.params);
    ctx.body = 'hi,new user' + ctx.params.id;
  }
  async dynamic() { // 获取 get 传值
    const { ctx } = this;
    console.log(ctx.query);
    ctx.body = 'hi,new user' + JSON.stringify(ctx.query);
  }
}

module.exports = HomeController;
