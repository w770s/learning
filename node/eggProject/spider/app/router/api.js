'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

// 抓去api 渲染新闻数据

module.exports = app => {
  const { router, controller } = app;
  // api
  router.get('/api/user', controller.api.user.index);
  router.get('/api/product', controller.api.product.index);
};

