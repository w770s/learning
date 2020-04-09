'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
// view: 视图

// MOdel Server: 处理数据

// control: 处理业务逻辑

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/:id', controller.user.index);
  router.get('/user/', controller.user.dynamic);
  router.get('/admin', controller.admin.index);
};
