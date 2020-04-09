const User = require('./model/user')

var u = new User({ //增加数据 实例化模型 传入增加的数据 name:'lisi2222333',
    name: 'xla汉武帝',
    age: 123,
    sex: 'man'
})
u.save(function (err, res) {
    if(err){
        console.log(err);
    }else{
        console.log(res);
    }
});

// User.find({sex: 'man'},function (err,docs) {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(docs);
//     }
// })
