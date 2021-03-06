'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/admin', controller.admin.main.index);

  router.get('/admin/login', controller.admin.login.index);
  router.post('/admin/doLogin', controller.admin.login.doLogin);
  router.get('/admin/loginOut', controller.admin.login.loginOut);

  router.get('/admin/welcome', controller.admin.main.welcome);

  router.get('/admin/verify', controller.admin.base.verify);
  router.get('/admin/delete', controller.admin.base.delete);
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);
  router.get('/admin/editNum', controller.admin.base.editNum);

  router.get('/admin/user', controller.admin.user.index);
  router.get('/admin/user/add', controller.admin.user.add);
  router.post('/admin/user/doAdd', controller.admin.user.doAdd);
  router.get('/admin/user/edit', controller.admin.user.edit);
  router.post('/admin/user/doEdit', controller.admin.user.doEdit);

  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/doAuth', controller.admin.role.doAuth);

  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.post('/admin/access/doAdd', controller.admin.access.doAdd);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/doEdit', controller.admin.access.doEdit);


  // 上传图片演示
  // router.get('/admin/focus', controller.admin.focus.singel);
  // router.get('/admin/focus/multi', controller.admin.focus.multi);
  // router.post('/admin/focus/doSingleUpload', controller.admin.focus.doSingleUpload);
  // router.post('/admin/focus/doMultiUpload', controller.admin.focus.doMultiUpload);

  // 轮播图
  router.get('/admin/focus', controller.admin.focus.index);
  router.get('/admin/focus/add', controller.admin.focus.add);
  router.post('/admin/focus/doAdd', controller.admin.focus.doAdd);
  router.get('/admin/focus/edit', controller.admin.focus.edit);
  router.post('/admin/focus/doEdit', controller.admin.focus.doEdit);


  // 商品类型
  router.get('/admin/goodsType', controller.admin.goodsType.index);
  router.get('/admin/goodsType/add', controller.admin.goodsType.add);
  router.post('/admin/goodsType/doAdd', controller.admin.goodsType.doAdd);
  router.get('/admin/goodsType/edit', controller.admin.goodsType.edit);
  router.post('/admin/goodsType/doEdit', controller.admin.goodsType.doEdit);

  router.get('/admin/goodsTypeAttribute', controller.admin.goodsTypeAttribute.index);
  router.get('/admin/goodsTypeAttribute/add', controller.admin.goodsTypeAttribute.add);
  router.post('/admin/goodsTypeAttribute/doAdd', controller.admin.goodsTypeAttribute.doAdd);
  router.get('/admin/goodsTypeAttribute/edit', controller.admin.goodsTypeAttribute.edit);
  router.post('/admin/goodsTypeAttribute/doEdit', controller.admin.goodsTypeAttribute.doEdit);


  // 商品分类
  router.get('/admin/goodsCate', controller.admin.goodsCate.index);
  router.get('/admin/goodsCate/add', controller.admin.goodsCate.add);
  router.post('/admin/goodsCate/doAdd', controller.admin.goodsCate.doAdd);
  router.get('/admin/goodsCate/edit', controller.admin.goodsCate.edit);
  router.post('/admin/goodsCate/doEdit', controller.admin.goodsCate.doEdit);

  // 商品列表
  router.get('/admin/goods', controller.admin.goods.index);
  router.get('/admin/goods/add', controller.admin.goods.add);
  router.post('/admin/goods/doAdd', controller.admin.goods.doAdd);
  router.get('/admin/goods/edit', controller.admin.goods.edit);
  router.post('/admin/goods/doEdit', controller.admin.goods.doEdit);
  router.get('/admin/goods/goodsTypeAttribute', controller.admin.goods.goodsTypeAttribute);
  router.post('/admin/goods/goodsUploadImage', controller.admin.goods.goodsUploadImage);
  router.post('/admin/goods/goodsUploadPhoto', controller.admin.goods.goodsUploadPhoto);
  router.post('/admin/goods/changeGoodsImageColor', controller.admin.goods.changeGoodsImageColor);
  router.post('/admin/goods/goodsImageRemove', controller.admin.goods.goodsImageRemove);

  // 导航拦
  router.get('/admin/nav', controller.admin.nav.index);
  router.get('/admin/nav/add', controller.admin.nav.add);
  router.post('/admin/nav/doAdd', controller.admin.nav.doAdd);
  router.post('/admin/nav/doEdit', controller.admin.nav.doEdit);
  router.get('/admin/nav/edit', controller.admin.nav.edit);


  // 文章分类

  router.get('/admin/goodsCate', controller.admin.goodsCate.index);
  router.get('/admin/goodsCate/add', controller.admin.goodsCate.add);
  router.post('/admin/goodsCate/doAdd', controller.admin.goodsCate.doAdd);
  router.get('/admin/goodsCate/edit', controller.admin.goodsCate.edit);
  router.post('/admin/goodsCate/doEdit', controller.admin.goodsCate.doEdit);

  router.get('/admin/articleCate', controller.admin.articleCate.index);
  router.get('/admin/articleCate/add', controller.admin.articleCate.add);
  router.post('/admin/articleCate/doAdd', controller.admin.articleCate.doAdd);
  router.post('/admin/articleCate/doEdit', controller.admin.articleCate.doEdit);
  router.get('/admin/articleCate/edit', controller.admin.articleCate.edit);


  router.get('/admin/article', controller.admin.article.index);
  router.get('/admin/article/add', controller.admin.article.add);
  router.post('/admin/article/doAdd', controller.admin.article.doAdd);
  router.post('/admin/article/doEdit', controller.admin.article.doEdit);
  router.get('/admin/article/edit', controller.admin.article.edit);


  // 系统设置
  router.get('/admin/setting', controller.admin.setting.index);
  router.post('/admin/setting/doEdit', controller.admin.setting.doEdit);
};
