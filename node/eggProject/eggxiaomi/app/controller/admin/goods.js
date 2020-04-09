'use strict';

const BaseController = require('./base.js');
const fs = require('fs');
const pump = require('mz-modules/pump');

class GoodsController extends BaseController {
  async index() {
    const { ctx } = this;
    // 分页
    const keyword = ctx.query.keyword;
    const Page = ctx.query.page || 1;
    const PageSize = 2;

    let json = {};
    if (keyword) {
      json = Object.assign({}, { title: { $regex: new RegExp(keyword) } });
    }

    const totalPages = await ctx.model.Goods.find(json).count();

    const list = await ctx.model.Goods.find(json).skip((Page - 1) * PageSize).limit(PageSize);

    console.log(Math.ceil(totalPages / PageSize));

    await this.ctx.render('admin/goods/index', {
      list,
      totalPages: Math.ceil(totalPages / PageSize),
      page: Page,
      keyword,
    });
  }

  async add() {
    const { ctx } = this;
    const colorResult = await ctx.model.GoodsColor.find({});
    const goodsType = await ctx.model.GoodsType.find({});
    const goodsCate = await ctx.model.GoodsCate.aggregate([// 关联查询
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);

    await ctx.render('admin/goods/add', {
      colorResult,
      goodsType,
      goodsCate,
    });
  }

  async edit() {
    // 获取修改数据的id

    const id = this.ctx.request.query.id;

    // 获取所有的颜色值
    const colorResult = await this.ctx.model.GoodsColor.find({});

    // 获取所有的商品类型
    const goodsType = await this.ctx.model.GoodsType.find({});

    // 获取商品分类

    const goodsCate = await this.ctx.model.GoodsCate.aggregate([

      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },

    ]);
    // 获取修改的商品

    const goodsResult = await this.ctx.model.Goods.find({ _id: id });


    const colorArrTemp = goodsResult[0].goods_color;

    // console.log(colorArrTemp);

    const goodsColorArr = [];

    if (goodsResult[0].good_color.length > 0) {
      colorArrTemp.forEach(value => {
        goodsColorArr.push({ _id: value });
      });
      // 查询数据库的多条数据
      var goodsColorReulst = await this.ctx.model.GoodsColor.find({
        $or: goodsColorArr,
      });
    } else {
      var goodsColorReulst = [];
    }

    // 获取规格信息

    const goodsAttsResult = await this.ctx.model.GoodsAttr.find({ goods_id: goodsResult[0]._id });

    let goodsAttsStr = '';

    goodsAttsResult.forEach(async val => {

      if (val.attribute_type === 1) {
        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type === 2) {
        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value  获取可选值列表
        const oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
          _id: val.attribute_id,
        });

        const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');

        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

        goodsAttsStr += '<select name="attr_value_list">';

        for (let j = 0; j < arr.length; j++) {

          if (arr[j] === val.attribute_value) {
            goodsAttsStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttsStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttsStr += '</select>';
        goodsAttsStr += '</li>';
      }

    });

    // 商品的图库信息
    const goodsImageResult = await this.ctx.model.GoodsImage.find({ goods_id: goodsResult[0]._id });

    await this.ctx.render('admin/goods/edit', {
      colorResult,
      goodsType,
      goodsCate,
      goods: goodsResult[0],
      goodsAtts: goodsAttsStr,
      goodsImage: goodsImageResult,
      goodsColor: goodsColorReulst,
      prevPage: this.ctx.state.prevPage,
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
    }

    const formFields = Object.assign(files, parts.field);

    // 增加商品信息
    const goodsRes = new this.ctx.model.Goods(formFields);
    const result = await goodsRes.save();

    // console.log(result._id);
    // 增加图库信息

    let goods_image_list = formFields.goods_image_list;

    if (result._id && goods_image_list) {
      // 解决上传一个图库不是数组的问题
      if (typeof (goods_image_list) === 'string') {

        goods_image_list = new Array(goods_image_list);
      }

      for (var i = 0; i < goods_image_list.length; i++) {
        const goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: result._id,
          img_url: goods_image_list[i],
        });

        await goodsImageRes.save();
      }

    }
    // 增加商品类型数据

    let attr_value_list = formFields.attr_value_list;
    let attr_id_list = formFields.attr_id_list;

    if (result._id && attr_id_list && attr_value_list) {

      // 解决只有一个属性的时候存在的bug
      if (typeof (attr_id_list) === 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }

      for (var i = 0; i < attr_value_list.length; i++) {
        // 查询goods_type_attribute
        if (attr_value_list[i]) {
          const goodsTypeAttributeResutl = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
          const goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id: result._id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeResutl[0].attr_type,
            attribute_title: goodsTypeAttributeResutl[0].title,
            attribute_value: attr_value_list[i],
          });
          await goodsAttrRes.save();
        }
      }
    }

    await this.ctx.redirect('/admin/goods');

  }

  async doEdit() {
    let goodsAttrRes;
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

    const goods_id = parts.field.id;

    const prevPage = parts.field.prevPage;

    const formFields = Object.assign(files, parts.field);

    // 修改商品信息
    await this.ctx.model.Goods.updateOne({ _id: goods_id }, formFields);

    // 修改图库信息 （还是增加操作）
    let goods_image_list = formFields.goods_image_list;

    if (goods_id && goods_image_list) {
      // 解决上传一个图库不是数组的问题
      if (typeof (goods_image_list) === 'string') {
        goods_image_list = new Array(goods_image_list);
      }

      for (let i = 0; i < goods_image_list.length; i++) {
        const goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id,
          img_url: goods_image_list[i],
        });

        await goodsImageRes.save();
      }
    }


    // 修改商品类型数据 1.先删除 2.在添加
    // 1.
    const data = await this.ctx.model.GoodsAttr.deleteOne({ goods_id });
    console.log(data);
    // 2.
    let attr_value_list = formFields.attr_value_list;
    let attr_id_list = formFields.attr_id_list;
    if (goods_id && attr_id_list && attr_value_list) {
      // 解决只有一个属性的时候存在的bug
      if (typeof (attr_id_list) === 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        // 查询goods_type_attribute
        if (attr_value_list[i]) {
          const goodsTypeAttributeResutl = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
          const goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeResutl[0].attr_type,
            attribute_title: goodsTypeAttributeResutl[0].title,
            attribute_value: attr_value_list[i],
          });
          await goodsAttrRes.save();
        }
      }
    }

    await this.ctx.redirect(prevPage);

  }

  // 获取商品类型 api 接口
  async goodsTypeAttribute() {
    const { ctx } = this;
    const cate_id = ctx.query.cate_id;
    const result = await ctx.model.GoodsTypeAttribute.find({ cate_id });
    ctx.body = {
      result,
    };
  }

  // 富文本编辑器 post 上传图片 坑：csrf 需要关闭， 在 config.default.js 配置
  // 上传 商品详情的t图片
  async goodsUploadImage() {
    const { ctx } = this;
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
    this.ctx.body = { link: files.file };
    console.log(this.ctx.body);
  }

  // 上传 商品相册图片
  async goodsUploadPhoto() {
    const { ctx } = this;
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
      await this.ctx.service.tools.Jimp(target);
    }
    this.ctx.body = { link: files.file };
    console.log(this.ctx.body);
  }

  // 修改图片颜色
  async changeGoodsImageColor() {

    let color_id = this.ctx.request.body.color_id;

    const goods_image_id = this.ctx.request.body.goods_image_id;
    console.log(this.ctx.request.body);
    if (color_id) {
      color_id = this.app.mongoose.Types.ObjectId(color_id);
    }

    const result = await this.ctx.model.GoodsImage.updateOne({ _id: goods_image_id }, {
      color_id,
    });
    if (result) {
      this.ctx.body = { success: true, message: '更新数据成功' };
    } else {
      this.ctx.body = { success: false, message: '更新数据失败' };
    }
  }

  // 删除图片
  async goodsImageRemove() {

    const goods_image_id = this.ctx.request.body.goods_image_id;

    // 注意  图片要不要删掉  fs模块删除以前当前数据对应的图片

    const result = await this.ctx.model.GoodsImage.deleteOne({ _id: goods_image_id }); // 注意写法

    if (result) {

      this.ctx.body = { success: true, message: '删除数据成功' };
    } else {

      this.ctx.body = { success: false, message: '删除数据失败' };
    }

  }

}

module.exports = GoodsController;
