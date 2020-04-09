'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = '1232';
    // const data = await ctx.model.User.find({}); // await 不要忘了
    const result = await this.app.mysql.get('users', {});
    ctx.body = result;
  }

  async addData() {
    const { ctx } = this;
    const user = new ctx.model.User({
      name: 'kak',
      age: 1,
      sex: 'man',
    });
    const data1 = await ctx.model.User.find({});
    // const data1 = await ctx.model.User.updateOne({},{});
    // db.order.aggregate([
    //     {
    //     $lookup:
    //     {
    //     from: "order_item",
    //     localField: "order_id",
    //     foreignField: "order_id",
    //     as: "items"
    //     }
    //     }
    //     ])
    const data = await user.save();
    console.log(data, data1);
  }


}

module.exports = HomeController;
