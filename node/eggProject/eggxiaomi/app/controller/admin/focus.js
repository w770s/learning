'use strict';

const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump');

/*
1、安装mz-modules

https://github.com/node-modules/mz-modules

https://github.com/mafintosh/pump
*/

// const Controller = require('egg').Controller;
const BaseController = require('./base.js');

class FocusController extends BaseController {

  async index() {
    // 获取轮播图的数据
    const result = await this.ctx.model.Focus.find({});
    await this.ctx.render('admin/focus/index', {
      list: result,
    });
  }

  async add() {
    await this.ctx.render('admin/focus/add');
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
    }
    // [{"focus_img":"/public/admin/upload/20180914/1536895826566.png"}，{"aaaa":"/public/admin/upload/20180914/1536895826566.png"}]

    // {"focus_img":"/public/admin/upload/20180914/1536895826566.png",'aaa':'/wefewt/ewtrewt'}

    // {"focus_img":"/public/admin/upload/20180914/1536895826566.png"，"title":"aaaaaaaa","link":"11111111111","sort":"11","status":"1"}

    const focus = new this.ctx.model.Focus(Object.assign(files, parts.field));

    await focus.save();

    await this.ctx.redirect('/admin/focus');
  }

  async edit() {
    const { ctx } = this;
    // const _id = app.mongoose.Types.ObjectId(ctx.resquest._id);
    const _id = ctx.query._id;
    const list = await ctx.model.Focus.find({ _id }); // mongoose 自动把 _id 转化成 objectId
    await ctx.render('admin/focus/edit', {
      list: list[0],
    });
  }

  async doEdit() {
    const { ctx } = this;
    // form 表单 enctype="multipart/form-data" ctx.request].body 获取不到
    const parts = ctx.multipart({ autoFields: true });
    console.log(parts);
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字

      // 上传图片的目录
      const dir = await ctx.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }

    // 修改操作
    const _id = parts.field.id;
    const updateResult = Object.assign(files, parts.field);
    await ctx.model.Focus.updateOne({ _id }, updateResult);
    await ctx.redirect('/admin/focus');
  }


  // 以下为上传图片演示

  // async index() {
  //   await this.ctx.render('admin/focus/index');
  // }

  // async doSingleUpload() {
  //   // 单文件上传
  //   const stream = await this.ctx.getFileStream(); // 获取表单提交的数据
  //
  //   // 只支持上传一个文件。（没有也报错哦）
  //   // 上传文件(dom位置) 必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
  //
  //   // console.log(stream); // 所有上传文件 流的数据
  //
  //   // 上传的目录    注意目录要存在 / 从跟目录开始     zzz/ewfrewrewt/dsgdsg.jpg    path.basename() ——> dsgdsg.jpg
  //   const target = 'app/public/admin/upload/' + path.basename(stream.filename);
  //
  //   const writeStream = fs.createWriteStream(target); // 写入流
  //
  //   await pump(stream, writeStream); // 写入并销毁（失败）
  //
  //   // stream.pipe(writeStream);   //可以用， 但是不建议，错误会卡死，浏览器 一种是官方的 ，另种 pump
  //
  //   this.ctx.body = {
  //     url: target,
  //     fields: stream.fields, // 表单的其他数据
  //   };
  // }

  // async multi() {
  //   await this.ctx.render('admin/focus/multi');
  // }

  // async doMultiUpload() {
  //
  //   // 多个图片/文件
  //   const parts = this.ctx.multipart({ autoFields: true });
  //   // { autoFields: true }:可以将除了文件的其它字段提取到 parts 的 filed 中
  //   const files = [];
  //   let stream;
  //   while ((stream = await parts()) != null) {
  //     if (!stream.filename) { // 没传文件
  //       return;
  //     }
  //     // console.log(stream);
  //     const filename = stream.filename.toLowerCase();
  //     const fieldname = stream.fieldname;
  //     const target = 'app/public/admin/upload/' + path.basename(filename);
  //     const writeStream = fs.createWriteStream(target);
  //     await pump(stream, writeStream); // 写入并销毁 才往下走
  //     files.push({
  //       [fieldname]: target,
  //     });
  //   }
  //   this.ctx.body = {
  //     files,
  //     fields: parts.field, // 所有表单字段都能通过 `parts.fields` 获取到 }; 放在最后， 流处理完
  //   };
  // }
}

module.exports = FocusController;
