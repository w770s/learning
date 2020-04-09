'use strict';

const BaseController = require('./base.js');

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    const roleData = await ctx.model.Role.find({});
    await ctx.render('/admin/role/index.html', {
      list: roleData,
    });
  }
  async add() {
    const { ctx } = this;
    await ctx.render('/admin/role/add.html');
  }
  async doAdd() {
    const { ctx } = this;
    const addRole = new ctx.model.Role({
      title: ctx.request.body.title,
      description: ctx.request.body.description,
    });
    addRole.save();
    await ctx.redirect('/admin/role');
  }
  async edit() {
    const { ctx } = this;
    const queryId = ctx.query._id;
    const data = await ctx.model.Role.find({ _id: queryId });
    await ctx.render('/admin/role/edit.html', {
      data: data[0],
    });
  }
  async doEdit() {
    const { ctx } = this;
    const queryId = ctx.request.body._id;
    const title = ctx.request.body.title;
    const description = ctx.request.body.description;
    await ctx.model.Role.updateOne({ _id: queryId }, {
      title,
      description,
    });
    await ctx.redirect('/admin/role');
  }

  async auth() {
    const { ctx } = this;
    const role_id = ctx.query._id;

    const result = await ctx.service.admin.getAuthList(role_id);

    await ctx.render('admin/role/auth', {

      list: result,
      role_id,
    });

  }

  async doAuth() {
    const { ctx } = this;
    // 多对多
    const role_id = ctx.request.body.role_id;
    const access_node = ctx.request.body.access_node;
    await ctx.model.RoleAccess.deleteMany({ role_id });

    access_node.forEach(item => {
      const roleAccess = new ctx.model.RoleAccess({
        role_id,
        access_id: item,
      });
      roleAccess.save();
    });
    await this.success('/admin/role/auth?_id=' + role_id, '角色权限添加成功');
  }
}

module.exports = HomeController;
