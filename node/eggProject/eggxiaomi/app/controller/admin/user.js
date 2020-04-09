'use strict';

const BaseController = require('./base.js');

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    const data = await ctx.model.Admin.aggregate([// 关联查询
      {
        $lookup: {
          from: 'role', // 关联角色表
          localField: 'role_id', // 本表 id
          foreignField: '_id', // 被关联表 id
          as: 'role',
        },
      },
    ]);
    await ctx.render('/admin/user/index.html', {
      data,
    });
  }
  async add() {
    const { ctx } = this;
    const data = await ctx.model.Role.find({});
    await ctx.render('/admin/user/add.html', {
      data,
    });
  }
  async doAdd() {
    const { ctx } = this;
    const adRres = ctx.request.body;
    adRres.password = await this.service.tools.md5(adRres.password);
    const result = await ctx.model.Admin.find({ username: adRres.username });
    if (result.length > 0) {
      await this.error('/admin/user', '该管理员已经添加');
    } else {
      const AdminData = new ctx.model.Admin(adRres);
      AdminData.save();
      await this.success('/admin/user', '管理员添加成功');
    }
  }
  async edit() {
    const { ctx } = this;
    const adminId = ctx.query.role_id;
    const roleId = ctx.query._id;
    const adminData = await ctx.model.Admin.find({ role_id: adminId });
    const roleData = await ctx.model.Role.find();
    await ctx.render('/admin/user/edit.html', {
      adminData: adminData[0],
      roleData,
    });
  }

  async doEdit() {
    const { ctx } = this;
    const mobile = ctx.request.body.mobile;
    const email = ctx.request.body.email;
    const password = await ctx.service.tools.md5(ctx.request.body.password);
    const role_id = ctx.request.body.role_id;
    if (ctx.request.body.password) { // 修改过密码
      await ctx.model.Admin.updateOne({ role_id: ctx.request.body._id }, {
        password,
        mobile,
        email,
        role_id,
      });
    } else {
      await ctx.model.Admin.updateOne({ role_id: ctx.request.body._id }, {
        mobile,
        email,
        role_id,
      });
    }
    await this.success('/admin/user', '修改成功');
  }
}

module.exports = HomeController;
