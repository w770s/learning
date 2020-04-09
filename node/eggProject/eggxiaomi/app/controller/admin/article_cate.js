'use strict';

const fs = require('fs');

const pump = require('mz-modules/pump');

const BaseController = require('./base.js');
class ArticleCateController extends BaseController {
  async index() {
    const { ctx } = this;

    const list = await ctx.model.ArticleCate.aggregate([// 自关联查询，可以看成两张表
      {
        $lookup: {
          from: 'article_cate', // 关联角色表
          localField: '_id', // 本表 id
          foreignField: 'pid', // 被关联表 id
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    await this.ctx.render('admin/ArticleCate/index', {
      list,
    });
  }
  async add() {

    const result = await this.ctx.model.ArticleCate.find({ pid: '0' });

    await this.ctx.render('admin/ArticleCate/add', {
      cateList: result,
    });

  }

  async doAdd() {
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });

      await this.ctx.service.tools.Jimp(target);
    }

    // 字符串 ID 转化 ObjectId
    if (parts.field.pid != 0) {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid); // 调用mongoose里面的方法把字符串转换成ObjectId
    }

    const articleCate = new this.ctx.model.ArticleCate(Object.assign(files, parts.field));
    await articleCate.save();

    await this.ctx.redirect('/admin/articleCate');
  }

  async edit() {

    const { ctx } = this;
    const _id = ctx.query.id;
    const cateList = await this.ctx.model.ArticleCate.find({ pid: '0' });
    const list = await ctx.model.ArticleCate.find({ _id });
    await ctx.render('admin/ArticleCate/edit', {
      cateList,
      list: list[0],
    });

  }

  async doEdit() {

    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });

      await this.ctx.service.tools.Jimp(target);
    }

    if (parts.field.pid != 0) {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);
    }

    const _id = parts.field.id;
    const updateResult = Object.assign(files, parts.field);
    await this.ctx.model.ArticleCate.updateOne({ _id }, updateResult);
    await this.ctx.redirect('/admin/articleCate');
  }

}
module.exports = ArticleCateController;
