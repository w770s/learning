'use strict';

const BaseController = require('./base.js');

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    // await this.verify()
    await ctx.render('login.html');
  }

  async doLogin() {
    const { ctx } = this;
    // await this.verify()
    const code = ctx.request.body.code;
    const username = ctx.request.body.username;
    const password = await this.service.tools.md5(ctx.request.body.password);
    if (code.toUpperCase() === ctx.session.code.toUpperCase()) {
      const res = await ctx.model.Admin.find({ username, password });
      if (res.length > 0) {
        ctx.session.userinfo = res[0];
        await ctx.redirect('/admin');
      } else {
        await this.error('/admin/login', '用户名或密码错误');
      }
    } else {
      await this.error('/admin/login', '验证码错误');
    }
  }

  async loginOut() {
    const { ctx } = this;
    ctx.session.userinfo = null;
    ctx.redirect('/admin/login');
  }
}

module.exports = HomeController;
