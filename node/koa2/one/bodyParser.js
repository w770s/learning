var Koa = require('koa');
var router = require('koa-router')();
var app = new Koa();
var views = require('koa-views');
var moudule = require('./module/bodyParser')
var bodyParser = require('koa-bodyparser')
app.use(bodyParser())

app.use(views('views', { extension: 'ejs' }))

router.get('/',async(ctx,next)=>{
    await ctx.render('bodyParser')
    await next()
})


// router.post('/addPost',async(ctx,next)=>{
//     //1. 原生node.js 在koa 中获取 post 提交的数据 , 是个异步，async （return Promise），await 获取数据
//     const data = await moudule.getPostData(ctx)
//     console.log(data);
//     ctx.body = data
//     await next ()
// })

router.post('/addPost',async(ctx,next)=>{
    // 2. body-parser 获取post 提交数据
    console.log(ctx.request.body); // 返回一个参数对象
    ctx.body = ctx.request.body
    await next ()
})

app.use(router.routes());

app.listen(3003)

