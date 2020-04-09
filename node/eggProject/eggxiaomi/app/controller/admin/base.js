'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl, message) {
    const { ctx } = this;
    await ctx.render('/public/success.html', {
      redirectUrl: redirectUrl || '',
      message: message || '操作成功',
    });
  }
  async error(redirectUrl, message) {
    const { ctx } = this;
    await ctx.render('/public/error.html', {
      redirectUrl: redirectUrl || '',
      message: message || '操作失败',
    });
  }

  async verify() {
    const { ctx } = this;
    const captcha = await ctx.service.tools.verify();
    ctx.response.type = 'image/svg+xml'; // 指定返回的类型
    ctx.body = captcha.data; // 给页面指定返回一个图片
  }

  async delete() {
    const { ctx } = this;
    const queryId = ctx.query._id || ctx.query.id;
    const model = ctx.query.model;
    await ctx.model[model].deleteOne({ _id: queryId });
    await ctx.redirect(ctx.state.prevPage); // 返回上一个页面 http://localhost:7001/admin/role
  }

  async changeStatus() { // 获取ajax 数据
    const { ctx } = this;
    const model = ctx.request.query.model; // 数据库表 Model
    const attr = ctx.request.query.attr; // 更新的属性 如:status
    const id = ctx.request.query.id; // 更新的 id
    const data = await ctx.model[model].find({ _id: id });

    if (data.length > 0) {
      if (data[0][attr] === 1) { // 1=>0 0=>1
        var json = { // es6 属性表达式 const json = {"str":"1}
          [attr]: 0,
        };
      } else {
        var json = {
          [attr]: 1,
        };
      }
      // 执行更新
      const updateResult = await ctx.model[model].updateOne({ _id: id }, json);
      if (updateResult) {
        ctx.body = { message: '更新成功', success: true };
      } else {
        ctx.body = { message: '更新失败,参数错误', success: false };
      }
    } else {
      ctx.body = { message: '更新失败,参数错误', success: false }; // 接口的写法
    }
  }

  async editNum() { // 封装更改 数字数据
    const { ctx } = this;
    const model = ctx.request.query.model; // 数据库表 Model
    const attr = ctx.request.query.attr; // 更新的属性 如:status
    const id = ctx.request.query.id; // 更新的 id
    const num = ctx.request.query.num; // 更新的 num
    const data = await ctx.model[model].find({ _id: id });

    if (data.length > 0) {
      if (data[0][attr]) {
        var json = { // es6 属性表达式 const json = {"str":"1}
          [attr]: num,
        };
      }
      // 执行更新
      const updateResult = await ctx.model[model].updateOne({ _id: id }, json);
      if (updateResult) {
        ctx.body = { message: '更新成功', success: true };
      } else {
        ctx.body = { message: '更新失败,参数错误', success: false };
      }
    } else {
      ctx.body = { message: '更新失败,参数错误', success: false }; // 接口的写法
    }
  }

}

module.exports = BaseController;
