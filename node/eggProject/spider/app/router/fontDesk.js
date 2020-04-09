'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

// 抓去api 渲染新闻数据

module.exports = app => {
  const { router, controller } = app;
  const admin = app.middleware.admin({ data: '我是一个特定组件的中间件' });
  // 前台页面
  // router.get('/mongodemo', admin, controller.mongolinkdemo.index);
  router.get('index', '/', controller.home.index);
  router.get('/ok', controller.home.success);
  router.get('/err', controller.home.error);


  // app.router.redirect('/', '/admin', 302);
  router.post('/add', controller.home.getPost);
  router.get('/shop', controller.shop.index);
  router.get('/admin', admin, controller.admin.index);
  router.get('/newContent/:id', controller.content.index);

};

