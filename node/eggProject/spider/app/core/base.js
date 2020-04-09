'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {

  async successful(url) {
    const { ctx } = this;
    await ctx.render('success', {
      url: url || '/',
    });
  }

  async errorful(url) {
    const { ctx } = this;
    await ctx.render('error', {
      url: url || '/',
    });
  }
}

module.exports = BaseController;
