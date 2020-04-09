
const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/eggcms',{ useNewUrlParser: true },function (err) {

});

// 数据库中的 Schema，为数据库对象的集合,映射 每个 schema 会映射到 mongodb 中的一个 collection，它不具备 操作数据库的能力
// 可以理解为表结构的定义
const UserSchema = mongoose.Schema({ // 最好是 表(user)的名字 + Schema
  name: String,
  age: Number,
  sex: String,
  status: {  // 默认参数
    type: Number,
    default: 666
  }
});

// 定义好了 Schema，接下就是生成 Model。model 是由 schema 生成的模型，可以对数据库的
// 操作。

// 注意:mongoose.model 里面可以传入两个参数也可以传入三个参数
// mongoose.model(参数 1:模型名称(首字母大写)，参数 2:Schema)
// mongoose.model(参数 1:模型名称(首字母大写)，参数 2:Schema，参数 3:数据库集合名称)

// 如果传入 2 个参数的话:这个模型会和模型名称相同的复数的数据库建立连接:
// 如通过下面 方法创建模型，那么这个模型将会操作 users 这个集合。
// 如果传入 3 个参数的话:模型默认操作第三个参数定义的集合名称

const User = mongoose.model('User', UserSchema , 'eggcms'); //相同的复数的数据库建立连接:  注意模型首字母大写

User.find({}, function(err, docs) { // 查找数据
  if (err) {
    console.log(err);
    return;
  }
  console.log(docs);
});


var u=new User({ //增加数据 实例化模型 传入增加的数据 name:'lisi2222333',
  name: 123,
  age: 123,
  sex: 123
})
u.save();   // 注意： 能增加的都在  Schema 配置，要不然，添加了无效，数据的一致性
// 执行文件 node 文件名字

// User.updateOne({ name: '123',  sex: '123'}, { name: '周恩来',  sex: 'man' },
//     function(err, res) { if(err){
//       console.log(err);
//       return;
//     }
//     console.log('成功')
// });


// User.deleteOne({ _id: '5df0f056fb663a81c0e3b2a9'}, function (err) { if (err) {
//   console.log(err);
//   return; }
// // deleted at most one tank document
//   console.log('成功');
// });

// mongoose 默认参数，模块化，性能问题
