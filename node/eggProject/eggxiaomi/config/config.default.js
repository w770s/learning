/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1576485620741_7719';

  config.uploadDir = 'app/public/admin/upload/';

  // add your middleware config here
  config.middleware = [ 'adminAuth' ];
  //
  config.adminAuth = {
    match: '/admin', // 只有后台页面需要先登录在能进去
  };

  // config.multipart = {
  //   whitelist: [ '.png' ], // 覆盖整个白名单，只允许上传 '.png' 格式
  // };

  // 配置表单数量
  exports.multipart = {
    fields: '50',
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true, // 不允许被 js 访问
    encrypt: true, // 加密
    renew: true,
  };

  config.view = {
    mapping: {
      '.html': 'ejs',
      '.nj': 'nunjucks',
    },
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/eggxiaomi',
      options: {},
    },
  };

  exports.security = { csrf: {
    // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
    ignore: ctx => {
      if (ctx.request.url === '/admin/goods/goodsUploadImage' || '/admin/goods/goodsUploadPhoto') {
        return true;
      }
      return false;
    },
  } };

  return {
    ...config,
    ...userConfig,
  };
};
