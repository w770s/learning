/**
 * 项目名:    learning
 * 包名
 * 文件名:    indedx
 * 创建时间:  2019-11-26 on 16:49
 * 描述:     TODO
 *
 * @author   XLA
 */
// 1: koa 基本使用
// const Koa = require('koa');
// const app = new Koa();
//
// // response
// app.use( async ( ctx,next ) => {
//     ctx.body = 'hello koa2qw'
// })
//
// app.listen(3000);


// 2：es6 常见语法
//
// function getData(callback){ // 1
//     // const callback = function (data) {
//     //     console.log(data);
//     // ajax
//     setTimeout(()=>{ // 2
//         var name = 'abc' // 4
//         callback(name)
//         // return name // 3
//     },1000)
//     // return name // 3
// }// 3 执行结束


// getData(function (data) {
//     console.log(data);
// });


// promise 处理
// const abc = new Promise(function (resolve,reject) { // 参数传的就是一个异步方法 方式一
//     setTimeout(()=>{
//         const name = 'ABCD'
//         if(1>0){
//             resolve(name)
//         }
//         else{
//             reject('err')
//         }
//     },1000)
// })
//
// abc.then((data)=>{
//     console.log(data);
//
// }).catch((err)=>{
//     console.log(err);
// })

// 方式 二

// function getData(resolve,reject, ajaxRequest){
//     setTimeout(()=>{
//         const name = 'ABCD'
//         if(1>0){
//             resolve(name)
//         }
//         else{
//             reject('err')
//         }
//     },1000)
// }
//
// const abc = new Promise(getData)
//
// abc.then((data)=>{
//     console.log(data);
// }).catch((err)=>{
//     console.log(err);
// })


// async: 声明一个异步函数（返回一个promise） await:等待一个异步函数执行完成.必须的用在异步方法里面(本身会造成程序停止阻塞)
// await: 非阻塞的功能，把异步变同步

// async function getData(){
//     console.log(2);
//     return '123'
// }
//
// async function getName() {
//     console.log(1);
//     const name = 'fullname='+await getData()
//     console.log(3);
//     console.log(name);
// }
// getName() // 1, 2, 3, fullname=123

// console.log(getData()); // Promise { '123' }

// 获取async 返回promise的数据

// getData().then((data)=>{ // promise 方式
//     console.log(data);
// })
// await getData() //error: await is only valid in async function


// async 返回一个 Promise 对象

// function getData(){ // 这里详单余一个 async函数
//     return new Promise(function (resolve,reject) {
//         setTimeout(()=>{
//             const username = 'abcd'
//             if(username){
//                 resolve(username)
//             }
//             else{
//                 reject('err')
//             }
//         },1000)
//     })
// }
//
// // getData().then((mes)=>{ // promise 方式
// //     console.log(mes);
// // }).catch((err)=>{
// //     console.log(err);
// // })
//
// async function test() { // async await
//     const data = await getData() // 可以方便的在async函数中 获取其他async函数返回的数据
//     console.log(data);
// }
//
// test()


// koa
// var Koa = require('koa');
// var router = require('koa-router')(); // 引入和实例化路由 var Router = require('koa-router') var router = new Router();
//
// var app = new Koa();

// router.get('/', async(ctx, next) => {
//   // ctx.router available
//     ctx.body = 'koa 首页' // = express res.send()
//     console.log(1312);
// }).get('/news', async (ctx,next)=>{
//     ctx.body = 'koa news'
// });


// router.get('/news',async (ctx,next)=>{// 获取get传值的数据 req,res ctx 都包含
//     // 1.ctx.query: JSON.parse(JSON.stringify(ctx.query)) 转换好的格式对象
//     // 2.ctx.querystring: 原始的参数字符串
//     ctx.body = 'get传值'+ ctx.querystring
//     console.log(12312,JSON.parse(JSON.stringify(ctx.query)), ctx.querystring, ctx.url);
// })

// router.get('/news/:adi',async(ctx,next)=>{
//     ctx.body = '动态路由'
//     console.log(ctx.params); //动态路由传值 { adi: 'asdfas' }
// })
//
//
// app
//   .use(router.routes()) // 启动路由
  // .use(router.allowedMethods()); //官网推荐 当所有中间件调用后， 设置响应头


// app.listen(3000,'127.0.0.1')




// 2.koa 中间件（匹配路由之前和匹配路由之后一系列的操作）
// 可以访问请求对象和响应对象

//
// var Koa = require('koa');
// var router = require('koa-router')();
//
// var app = new Koa();

// app.use(async (ctx,next)=>{ // 应用级中间件
//     ctx.body = '父路由都执行'
//     console.log(1);
//     await next() // 执行下一个堆栈
//     console.log(1);
// })

// app.use(async (ctx,next)=>{ // 应用级中间件
//     ctx.body = '子路由都执行'
//     console.log(2);
//     await next() // 执行下一个堆栈
//     console.log(2);
// })
//
// app.use(async (ctx,next)=>{ // 应用级中间件
//     ctx.body = '孙子由都执行'
//     console.log(3);
//     await next() // 执行下一个堆栈
//     console.log(3);
// })

// 1
// 2
// 3
// 3
// 2
// 1
// koa 中间件 执行流程； 洋葱模型， dom 父节点 子节点 事件冒泡，事件捕获

//
// app.use(async (ctx,next)=>{
//     await next()
//     if(ctx.status === 404){ // 错误处理：最后处理
//         ctx.status === 404
//         ctx.body = '页面不存在'
//     }
// })
//
// router.get('/',async (ctx,next)=>{ // 路由中间件
//     ctx.body = '路由中间件'
//     await next()
// })
//
// router.get('/news',async (ctx,next)=>{
//     ctx.body = 'get传值'+ ctx.querystring
//     console.log(12312,JSON.parse(JSON.stringify(ctx.query)), ctx.querystring, ctx.url);
// })
//
// app.use(router.routes())
//
// app.listen(3000,'127.0.0.1')





// 3.koa 使用ejs 模版引擎

var Koa = require('koa');
var router = require('koa-router')();
var app = new Koa();
var views = require('koa-views');

// Must be used before any router is used
// app.use(views('views',{map:{html: 'ejs'}})) // 参数1. 模版文件位置  2.使用的模版引擎， 模版必须的。html 结尾
 app.use(views('views', { extension: 'ejs' }))
// app.use(async function (ctx) { // 使用模版
//     await ctx.render('index') // 默认是 index.html 结尾的
// })
//
// app.use(async(ctx,next)=>{
//     if(ctx.status === 404){
//         ctx.body === 'welcome to 404 page'
//     }
//     await next() //后的属性方法 非阻塞，类似于setTimeout，推到下一个列队+ 加上类似于事件冒泡的异步列队排序方式
// })

// 需求: 每个页面的公共数据处理
// ctx.state = {
//      nav: nav
// }

router.use(async(ctx,next)=>{
    ctx.state = {
        username: 'xla'
    }
    await next()
})

router.get('/',async(ctx,next)=>{
    const username = ctx.state.username
    const title = 'ejs title'
    const content = '<h1>我是模版内容</h1>'
    const number = 123
    const arr = ['time', 'principal', 'rate']
    await ctx.render('index',{
        username, title, content, number, arr
    })
    await next()
})


router.get('/news',async(ctx,next)=>{
    const username = ctx.state.username
    const title = 'news title'
    const content = '<h1>我是模版内容</h1>'
    const number = 123
    const arr = ['健康', '知识', '人脉']
    await ctx.render('index',{
        username, title, content, number, arr
    })
    await next()
})

app.use(router.routes());

app.listen(3000)

