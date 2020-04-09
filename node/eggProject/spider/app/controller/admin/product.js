'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '商品首页';
  }
  async add() {
    const { ctx } = this;
    ctx.body = '商品添加';
  }
  async edit() {
    const { ctx } = this;
    ctx.body = '商品编辑';
  }
}

module.exports = HomeController;
