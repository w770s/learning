'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async find() {
    const { ctx } = this;
    const data = await this.app.mongo.find('eggcms');
    console.log(data);
    ctx.body = data;
  }
  async add() {
    const { ctx } = this;
    const data = await this.app.mongo.insertOne('eggcms', {
      doc: {
        age: 100,
        name: '毛泽东',
        sex: 'man',
      },
      options: {

      },
    });
    console.log(data);
    ctx.body = data;
  }
  async update() {
    const { ctx } = this;
    const data = await this.app.mongo.findOneAndUpdate('eggcms', {
      filter: {
        age: 123,
        name: 12312,
      },
      update: {
        $set: { age: 22 },
      },
    });
    console.log(data);
    ctx.body = data;
  }
  async del() {
    const { ctx } = this;
    const data = await this.app.mongo.findOneAndDelete('eggcms', {
      filter: {
        age: 1,
      },
    });
    console.log(data);
    ctx.body = data;
  }

  async findId() {
    const { ctx } = this;
    const data = await this.app.mongo.find('eggcms', { query: { _id: this.app.getObjectId('5df048699801dd30495b330e') } }); // 1

    const pipneLineData = await this.app.mongo.aggregate('order', {
      pipeline: [
        {
          $lookup: {
            from: 'order_item',
            localField: 'order_id',
            foreignField: 'order_id',
            as: 'message',
          },
        },
        // {
        //   $group: {
        //     _id: 'number',
        //     total: { $sum: '$price' },
        //   },
        // },
        {
          $sort: { all_price: 1 },
        },
        {
          $project: {
            uid: 10,
          },
        },
      ],
    });

    console.log(data, pipneLineData);
    ctx.body = pipneLineData;
  }

  // 根据指定id 查找和删除
}

module.exports = HomeController;
