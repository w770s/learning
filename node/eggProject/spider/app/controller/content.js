'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await this.service.home.getNewsContent()
    await ctx.render('content', {
      data,
    });
  }
}

module.exports = HomeController;
