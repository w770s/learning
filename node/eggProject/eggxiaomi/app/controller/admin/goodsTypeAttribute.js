'use strict';

const BaseController = require('./base.js');

class GoodsTypeAttributeController extends BaseController {

  async index() {
    const { ctx } = this;
    // 获取对应的 商品对应类型 属性

    const cate_id = ctx.query.id;
    // GoodsTypeAttribute GoodsType 关联 拿到 title
    const goodTypes = await ctx.model.GoodsType.find({ _id: cate_id });
    console.log(goodTypes);
    const list = await ctx.model.GoodsTypeAttribute.aggregate([
      {
        $lookup: {
          from: 'goods_type', // 关联角色表
          localField: 'cate_id', // 本表 id
          foreignField: '_id', // 被关联表 id
          as: 'goods_type',
        },
      },
      {
        $match: {
          cate_id: this.app.mongoose.Types.ObjectId(cate_id), // 需要转化为 objectId
        },
      },
    ]);

    await ctx.render('admin/goodsTypeAttribute/index', {
      list,
      cate_id,
      goodTypes: goodTypes[0],
    });
  }
  async add() {
    const { ctx } = this;
    const cate_id = ctx.query.id;
    const goodsTypes = await ctx.model.GoodsType.find({});
    console.log(goodsTypes);
    await ctx.render('/admin/goodsTypeAttribute/add', {
      cate_id,
      goodsTypes,
    });
  }
  async doAdd() {
    const { ctx } = this;
    const addGoodsType = new ctx.model.GoodsTypeAttribute(ctx.request.body);
    addGoodsType.save();
    await ctx.redirect('/admin/goodsTypeAttribute?id=' + ctx.request.body.cate_id);
  }
  async edit() {
    const { ctx } = this;
    const _id = ctx.query.id;
    const goodsTypes = await ctx.model.GoodsType.find({});
    const result = await ctx.model.GoodsTypeAttribute.find({ _id });
    await ctx.render('/admin/goodsTypeAttribute/edit', {
      goodsTypes,
      list: result[0],
    });

  }
  async doEdit() {
    const { ctx } = this;
    const _id = ctx.request.body._id;
    await ctx.model.GoodsTypeAttribute.updateOne({ _id }, ctx.request.body);
    await ctx.redirect('/admin/goodsTypeAttribute?id=' + ctx.request.body.cate_id);
  }
}
module.exports = GoodsTypeAttributeController;
