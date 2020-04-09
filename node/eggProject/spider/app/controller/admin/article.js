'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '文章首页';
  }
  async add() {
    const { ctx } = this;
    ctx.body = '文章添加';
  }
  async edit() {
    const { ctx } = this;
    ctx.body = '文章编辑';
  }
}

module.exports = HomeController;
