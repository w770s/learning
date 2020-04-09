'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

// 抓去api 渲染新闻数据

module.exports = app => {
  const { router, controller } = app;
  router.get('/user', controller.user.index);
  router.get('/useradd', controller.user.addData);
  require('./router/fontDesk')(app);
  require('./router/admin')(app);
  require('./router/api')(app);

  // const admin = app.middleware.admin({ data: '我是一个特定组件的中间件' });
  // // const compress = app.middleware.compress();
  //
  // // 前台页面
  // router.get('index', '/', controller.home.index);
  // // app.router.redirect('/', '/admin', 302);
  // router.post('/add', controller.home.getPost);
  // router.get('/shop', controller.shop.index);
  // router.get('/admin', admin, controller.admin.index);
  // // router.get('/newContent/:id', controller.content.index);
  //
  // // 后台页面
  // router.get('/admin/user', controller.admin.user.index);
  // router.get('/admin/user/add', controller.admin.user.add);
  // router.get('/admin/user/edit', controller.admin.user.edit);
  //
  // router.get('/admin/product', controller.admin.product.index);
  // router.get('/admin/product/add', controller.admin.product.add);
  // router.get('/admin/product/edit', controller.admin.product.edit);
  //
  // router.get('/admin/article', controller.admin.article.index);
  // router.get('/admin/article/add', controller.admin.article.add);
  // router.get('/admin/article/edit', controller.admin.article.edit);
  //
  // // api
  // router.get('/api/user', controller.api.user.index);
  // router.get('/api/product', controller.api.product.index);

  // app.router.redirect('/', '/home/index', 302); // 内部重定向, 302 临时重定向到什么域名 301 永久
};

