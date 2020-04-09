'use strict';

module.exports = (options, app) => {
  return async function forbidIp(ctx, next) { // 屏蔽客户端指定ip
    // if (ctx.request.ip === '192.168.1.9') { // 1.数据库获取 ip
    //   ctx.status = 403;
    //   ctx.body = '你的ip已经被屏蔽';
    // } else {
    //   await next();
    // }
    const queryIp = ctx.request.ip;
    const hsaIp = options.some(val => { // 参数传入
      if (val === queryIp) {
        return true;
      }
    });
    if (hsaIp) {
      ctx.status = 403;
      ctx.body = '你的ip已经被屏蔽';
    } else {
      await next();
    }
  };
};
