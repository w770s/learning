'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '用户首页';
  }
  async add() {
    const { ctx } = this;
    ctx.body = '用户添加';
  }
  async edit() {
    const { ctx } = this;
    ctx.body = '用户编辑';
  }
}

module.exports = HomeController;
