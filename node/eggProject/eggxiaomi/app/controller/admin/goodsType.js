'use strict';

const BaseController = require('./base.js');

class GoodTypeController extends BaseController {

  async index() {
    const { ctx } = this;
    const list = await ctx.model.GoodsType.find({});
    await ctx.render('admin/goodsType/index', {
      list,
    });
  }
  async add() {
    const { ctx } = this;
    await ctx.render('/admin/goodsType/add');
  }
  async doAdd() {
    const { ctx } = this;
    const addGoodsType = new ctx.model.GoodsType({
      title: ctx.request.body.title,
      description: ctx.request.body.description,
    });
    addGoodsType.save();
    await ctx.redirect('/admin/goodsType');
  }
  async edit() {
    const { ctx } = this;
    const queryId = ctx.query.id;
    const list = await ctx.model.GoodsType.find({ _id: queryId });
    await ctx.render('/admin/goodsType/edit', {
      list: list[0],
    });
  }
  async doEdit() {
    const { ctx } = this;
    const queryId = ctx.request.body._id;
    const title = ctx.request.body.title;
    const description = ctx.request.body.description;
    await ctx.model.GoodsType.updateOne({ _id: queryId }, {
      title,
      description,
    });
    await ctx.redirect('/admin/goodsType');
  }
}
module.exports = GoodTypeController;
