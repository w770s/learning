'use strict';

const BaseController = require('./base.js');

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    const list = await ctx.model.Access.aggregate([// 自关联查询，可以看成两张表
      {
        $lookup: {
          from: 'access', // 关联角色表
          localField: '_id', // 本表 id
          foreignField: 'module_id', // 被关联表 id
          as: 'item',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    await ctx.render('/admin/access/index.html', {
      list,
    });
  }
  async add() {
    const { ctx } = this;
    const moduleData = await ctx.model.Access.find({ module_id: '0' });
    await ctx.render('/admin/access/add.html', {
      moduleData,
    });
  }
  async doAdd() {
    try {
      const addResult = this.ctx.request.body;
      const module_id = addResult.module_id;
      // 菜单  或者操作
      if (module_id != 0) {
        addResult.module_id = this.app.mongoose.Types.ObjectId(module_id); // 调用mongoose里面的方法把字符串转换成ObjectId
      }
      const access = new this.ctx.model.Access(addResult);
      access.save();
      await this.ctx.redirect('/admin/access');
    } catch (error) {
      console.log(error);
    }
  }
  async edit() {
    const { ctx } = this;
    const queryId = this.app.mongoose.Types.ObjectId(ctx.query._id);
    const list = await ctx.model.Access.find({ _id: queryId });
    const moduleList = await ctx.model.Access.find({ module_id: '0' });
    await ctx.render('/admin/access/edit.html', {
      data: list[0],
      moduleList,
    });
  }
  async doEdit() {
    const { ctx } = this;
    const editBody = ctx.request.body;
    const id = editBody._id;
    const module_id = editBody.module_id;
    console.log(editBody);
    if (module_id !== 0 && module_id) {
      editBody.module_id = await this.app.mongoose.Types.ObjectId(module_id);
    }
    await ctx.model.Access.updateOne({
      _id: id,
    }, editBody);
    await ctx.redirect('/admin/access');
  }
}

module.exports = HomeController;
