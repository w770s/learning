'use strict';

const Url = require('url');

module.exports = options => {
  return async function adminAuth(ctx, next) {

    ctx.state.csrf = ctx.csrf;
    ctx.state.prevPage = ctx.request.headers.referer; // http://localhost:7001/admin/role 上一页
    const url = Url.parse(ctx.request.url).pathname; // 去除get参数
    if (ctx.session.userinfo) {
      ctx.state.userinfo = ctx.session.userinfo;

      const hasRole = await ctx.service.admin.adminAuth();
      if (hasRole) { // 有权限
        ctx.state.asideList = await ctx.service.admin.getAuthList(ctx.session.userinfo.role_id); // 左侧菜单
        await next();
      } else {
        ctx.body = '您没有权限,请先登录';
      }

    } else {
      if (url === '/admin/login' || url === '/admin/doLogin' || url === '/admin/verify') {
        await next();
      } else {
        ctx.redirect('/admin/login');
      }
    }
  };
};
