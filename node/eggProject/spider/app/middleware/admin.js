'use strict';

module.exports = (option, app) => {
  return async function admin(ctx, next) {
    // 配置指定路由中间件
    console.log(new Date(), option);
    await next();
  };
};
