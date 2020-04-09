'use strict';

module.exports = (option, app) => {
  return async function adminAuth(ctx, next) {
    if (ctx.session && ctx.session.userinfo) {
      await next();
    } else {
      ctx.redirect('/');
    }
  };
};

