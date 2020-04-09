'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      name: 'kaka',
      age: 101,
    };
  }
}

module.exports = HomeController;
