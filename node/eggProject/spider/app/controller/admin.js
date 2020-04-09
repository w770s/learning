'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const data = await this.service.home.getNewsList();
    // const helperData = await ctx.helper.getHelper();
    // console.log(helperData);
    await ctx.render('news', {
      data,
    });
  }
}

module.exports = HomeController;
