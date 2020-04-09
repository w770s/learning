// const Subscription = require('egg').Subscription;
//
// let i = 0;
//
// class UpdateCache extends Subscription { // way 1
//   // 通过 schedule 属性来设置定时任务的执行间隔等配置
//   static get schedule() {
//     return {
//       interval: '1s', // 1 秒钟间隔
//       type: 'all', // 指定所有的 worker 都需要执行
//     };
//   }
//
//   // subscribe 是真正定时任务执行时被运行的函数
//   async subscribe() {
//     i++;
//     console.log(i);
//   }
// }
//
// module.exports = UpdateCache;

let i = 0;

module.exports = app => { // way two better way
  return {
    schedule: {
      interval: '1s',
      type: 'all',
    },
    async task(ctx) {
      ++i;
      // const data = await ctx.service.home.getList();
      // console.log(i, data);
    },
  };
};
