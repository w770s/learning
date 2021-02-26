'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {

    const { ctx } = this;

    const topNav = await ctx.model.Nav.find({ position: 1 });

    const focus = await ctx.model.Focus.find({ type: 1 }); // 网站

    const goodsCate = await ctx.model.GoodsCate.aggregate([ // 自关联查询，可以看成两张表
      {
        $lookup: {
          from: 'goods_cate', // 关联角色表
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

    // 获取中间导航的数据
    /*
      不可拓展属性的对象    http://bbs.itying.com/topic/5bea72c10e525017c44947cf
    */

    let middleNav = await this.ctx.model.Nav.find({ position: 2 });

    middleNav = JSON.parse(JSON.stringify(middleNav)); // 1、不可扩展对象

    for (let i = 0; i < middleNav.length; i++) {
      if (middleNav[i].relation) {
        // 数据库查找relation对应的商品
        try {
          const tempArr = middleNav[i].relation.replace(/，/g, ',').split(',');
          var tempRelationIds = [];
          tempArr.forEach(value => {
            tempRelationIds.push({
              _id: this.app.mongoose.Types.ObjectId(value),
            });
          });
          const relationGoods = await this.ctx.model.Goods.find({
            $or: tempRelationIds,
          }, 'title goods_img');

          middleNav[i].subGoods = relationGoods;

        } catch (err) { // 2、如果用户输入了错误的ObjectID（商品id）

          middleNav[i].subGoods = [];
        }
      } else {

        middleNav[i].subGoods = [];
      }

    }

    console.log(middleNav);

    // 获取手机分类对应的数据

    // 1、获取当前分类下面的所有子分类

    // var shoujiCateIdsResult=await this.ctx.model.GoodsCate.find({"pid":this.app.mongoose.Types.ObjectId('5bbf058f9079450a903cb77b')},'_id');

    // 2、商品表里面查找分类id 在手机分类的子分类里面的（推荐的）所有数据

    // var cateIdsArr=[];
    // shoujiCateIdsResult.forEach((value)=>{
    //   cateIdsArr.push({
    //     "cate_id":value._id
    //   })
    // })

    // var shoujiResult=await this.ctx.model.Goods.find({
    //   $or:cateIdsArr
    // })

    // 手机
    const shoujiResult = await this.service.goods.get_category_recommend_goods('5bbf058f9079450a903cb77b', 'best', 8);
    // 电视
    const dianshiResult = await this.service.goods.get_category_recommend_goods('5bbf05ac9079450a903cb77c', 'best', 10);

    console.log(dianshiResult);

    await this.ctx.render('default/index', {
      topNav,
      focus,
      goodsCate,
      middleNav,
      shoujiResult,
    });
  }
}

module.exports = IndexController;
