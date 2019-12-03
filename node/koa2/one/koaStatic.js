var Koa = require('koa');
var router = require('koa-router')();
var app = new Koa();
var views = require('koa-views');
var bodyParser = require('koa-bodyparser')
app.use(bodyParser())
app.use(require('koa-static')('static')); // 静态web服务. 路由上的地址，在static 目录下找
// koa 中中间可以配置多个 app.use(require('koa-static')('public'));
app.use(views('views', { extension: 'ejs' }))

router.get('/',async(ctx,next)=>{
    await ctx.render('bodyParser')
    // console.log(__dirname + '/static');
    await next()
})

router.post('/addPost',async(ctx,next)=>{
    console.log(ctx.request.body);
    ctx.body = ctx.request.body
    await next ()
})

app.use(router.routes());

app.listen(3006)


// koa 模版引擎 ejs , art-template ,jade , nunjucks
// art-template: 采用作用域声明来优化模版渲染速度， 渲染速度，极限接近于javaScript， 支持node.js，浏览器，
// 语法支持ejs 语法，angular语法
