const User = require('./model/user')

var u=new User({ //增加数据 实例化模型 传入增加的数据 name:'lisi2222333',
    name: '秦始皇',
    age: 123,
    sex: 'man'
})
u.save();

u.print() // 自定义实例方法

// console.log(u.name); // get

User.findExtense('man',function (err,docs) {
    if(err){
        console.log(err);
    }
    else{
        console.log(docs);
    }
})

// User.find({}, function(err, docs) { // 查找数据
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log(docs);
// })

//
// User.updateOne({ name: '123',  sex: '123'}, { name: '周恩来',  sex: 'man' },
//     function(err, res) { if(err){
//       console.log(err);
//       return;
//     }
//     console.log('成功')
// });
//
// User.deleteOne({ _id: '5df0f056fb663a81c0e3b2a9'}, function (err) { if (err) {
//   console.log(err);
//   return; }
// // deleted at most one tank document
//   console.log('成功');
// });
