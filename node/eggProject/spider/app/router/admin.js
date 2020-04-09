'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

// 抓去api 渲染新闻数据

module.exports = app => {
  const { router, controller } = app;
  router.get('/mongofind', controller.admin.mongolinkdemo.findId);
  router.get('/mongoadd', controller.admin.mongolinkdemo.add);
  router.get('/mongoupdate', controller.admin.mongolinkdemo.update);
  router.get('/mongodel', controller.admin.mongolinkdemo.del);

  // 后台页面
  router.get('/admin/user', controller.admin.user.index);
  router.get('/admin/user/add', controller.admin.user.add);
  router.get('/admin/user/edit', controller.admin.user.edit);

  router.get('/admin/product', controller.admin.product.index);
  router.get('/admin/product/add', controller.admin.product.add);
  router.get('/admin/product/edit', controller.admin.product.edit);

  router.get('/admin/article', controller.admin.article.index);
  router.get('/admin/article/add', controller.admin.article.add);
  router.get('/admin/article/edit', controller.admin.article.edit);

};

