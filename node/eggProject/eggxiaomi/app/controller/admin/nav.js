'use strict';

const BaseController = require('./base.js');

class NavController extends BaseController {
  async index() {
    const { ctx } = this;
    const Page = ctx.query.page || 1;
    const PageSize = 2;
    const totalPages = await ctx.model.Goods.find({}).count();
    const list = await ctx.model.Nav.find({}).skip((Page - 1) * PageSize).limit(PageSize);
    await ctx.render('/admin/nav/index.html', {
      list,
      totalPages: Math.ceil(totalPages / PageSize),
      page: Page,
    });
  }
  async add() {
    const { ctx } = this;
    await ctx.render('/admin/nav/add.html');
  }
  async doAdd() {
    const { ctx } = this;
    const addNav = new ctx.model.Nav({
      title: ctx.request.body.title,
      description: ctx.request.body.description,
    });
    addNav.save();
    await ctx.redirect('/admin/nav');
  }
  async edit() {
    const { ctx } = this;
    const queryId = ctx.query.id;
    const data = await ctx.model.Nav.find({ _id: queryId });
    await ctx.render('/admin/nav/edit.html', {
      list: data[0],
      prevPage: ctx.state.prevPage,
    });
  }
  async doEdit() {
    const { ctx } = this;
    const queryId = ctx.request.body._id;
    const prevPage = ctx.request.body.prevPage;
    await ctx.model.Nav.updateOne({ _id: queryId }, ctx.request.body);
    await ctx.redirect(prevPage);
  }

}

module.exports = NavController;
