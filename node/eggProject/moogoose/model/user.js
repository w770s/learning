const mongoose = require('./db') // 只调用一次 // 底层封装了，应该是单例，做了优化

// const UserSchema = mongoose.Schema({ // 最好是 表(user)的名字 + Schema
//     name: String,
//     age: Number,
//     sex: String,
//     // status: {  // 默认参数
//     //     type: Number,
//     //     default: 666
//     // }
// });

// const UserSchema = mongoose.Schema({ // 预定义模块修饰符， 格式化数据 trim lowercase uppercase
//     name: String,
//     age: Number,
//     sex: String,
    // sex: {  // 默认参数
    //     type: String,
    //     trim: true,
    //     index: true // 普通索引
    //     unique: true // 唯一索引 ： 为了优化查询的速度： 会使增加速度减慢
    //     set(params){ // 对添加数据处理，返回数据库数据 网址没有加 http:// 加上
    //         if(!params){
    //             return
    //         }else{
    //             if(params.indexOf('http://')!==0 && params.indexOf('https://')!==0){
    //                 return 'http://' + params
    //             }
    //             else{
    //                 return params
    //             }
    //         }
    //     }
    // }
    // 预定义模块修饰符不行，就用自定义的
    //  set(建议使用，增加数据)
    //  get(不建议，获取数据，获取model数据，获取实例的时候，获取数据和处理，没什么意义)
// });

// UserSchema.statics.findExtense = function(sex, cb){ // 扩展静态方法 .statics
//     this.find({sex:sex},function (err,docs) { // this 指代的就是 model
//         cb(err,docs)
//     })
// }
//
// UserSchema.methods.print = function(){ // 实例方法 .methods
//     console.log(' 我是实例方法')
// }



// 数据校验，包含内置方法和自定义方法
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 10,
        minlength: 0, // 只能用在 String 下
        required: true, // 要求必须传入
        match: /^xla(.*)/ // 新增的数据必须满足正则
    },
    age: {
        type: Number,
        min: 0, // 只能用在 Number 下
        max: 150,
        // set(val){ // 自定义修饰符
        //     return val * 3
        // },
        // validate:function(age) { // 返回 ture or false
        //     return age*3 > 150? false: true;
        // },
    },
    sex: {
        type: String,
        default: 'man',
        enum: ['man', 'woman'] //  枚举只能用在 String 下，必须满足枚举选项
    },
})

module.exports = mongoose.model('User', UserSchema , 'users');

