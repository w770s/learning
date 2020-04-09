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
  config.keys = appInfo.name + '_1575640112045_7624';

  // add your middleware config here
  config.middleware = [ 'auth', 'adminAuth', 'jsonp', 'compress' ];


  config.mongo = {
    client: {
      host: '127.0.0.1',
      port: '27017',
      name: 'eggcms',
      options: {},
    },
  };

  config.mongoose = { // 推荐的mogoose 配置的方式
    client: {
      url: 'mongodb://127.0.0.1/eggcms',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [ createdPlugin, [ updatedPlugin, pluginOptions ]],
    },
  };

  config.compress = {
    // enable：控制中间件是否开启。
    // match：设置只有符合某些规则的请求才会经过这个中间件。
    // ignore：设置符合某些规则的请求不经过这个中间件。
    // match 和 ignore 不允许同时配置
    match(ctx) {
      if (ctx.request.url === '/admin') {
        return true;
      }
      return false;

    },
    threshold: 148, // 操作多少字节才压缩
  };

  config.adminAuth = { // 给后台模块添加路由权限
    match: '/shop',
  };

  // config.bodyparser = { // 框架内置中间件配置：
  //   jsonLimit: '10mb',
  // };

  // config.forbidIp = [
  //   '127.0.0.1',
  //   '192.168.1.9',
  // ];
  //
  //
  // config.printDate = { // 中间件配置参数
  //   middlewareOptions: 'aaaa',
  // };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.session = {
    userinfo: '',
  };

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  config.api = 'http://www.phonegap100.com/';

  // exports.mysql = {
  //   // database configuration
  //   client: {
  //     // host
  //     host: 'localhost',
  //     // port
  //     port: '3306',
  //     // username
  //     user: '',
  //     // password
  //     password: '',
  //     // database
  //     database: 'eggcms',
  //   },
  //   // load into app, default is open
  //   app: true,
  //   // load into agent, default is close
  //   agent: false,
  // };

  return {
    ...config,
    ...userConfig,
  };
};
