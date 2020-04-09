const OrderModel = require('./model/order')
const OrderItemModel = require('./model/order_item')

// db.order.aggregate([
//     {
//         $lookup:
//             {
//                 from: "order_item",
//                 localField: "order_id", // 主表关联字段
//                 foreignField: "order_id", // 附表关联字段
//                 as: "items" // 关联放的位置
//             }
//     }，
// ])

// mongoose 下 聚合管道 语法 和 原生mongo基本相识
// OrderModel.aggregate([ // order 关联 order_item, 列表下的详情
//     {
//         $lookup:
//             {
//                 from: 'order_item',
//                 localField: "order_id", // 主表关联字段
//                 foreignField: "order_id", // 附表关联字段
//                 as: "items" // 关联放的位置
//             }
//     },
//     {
//         $limit: 1
//     }
// ],function (err,docs) {
//         if(err){
//             console.log(err);
//         }
//         else{
//             // 问题  items: [ [Object], [Object], [Object] ]
//             console.log(JSON.stringify(docs));
//         }
//     }
// )


// 订单商品 order_item 找出商品是 牛奶 对应的订单好和总价格
// 方法一逐级查找，order_id // 方法二，表关联
// let data = {}
// OrderItemModel.find({"_id": "5df0d68633bdad58bd44b6b9"},function (err,docs) {
//     if(err){
//         console.log(err);
//     }
//     else{
//         data = JSON.parse(JSON.stringify(docs))
//         OrderModel.find({"order_id": docs[0].order_id},function (err,docs) {
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 data[0].mother = docs[0]
//                 console.log(data);
//             }
//         })
//     }
// })

const mongoose = require('mongoose')
OrderItemModel.aggregate([
    {
        $lookup:
        {
            from: 'order',
            localField: "order_id",
            foreignField: "order_id",
            as: "mother"
        }
    },
    {
        $match: {
            "title": "牛奶"
            // "_id": mongoose.Types.ObjectId('5df0d68633bdad58bd44b6b9') // mongoose 中查询 id
        }
    }
],
function (err,docs) {
    if(err){
        console.log(err);
    }
    else{
        console.log(JSON.stringify(docs));
    }
})
