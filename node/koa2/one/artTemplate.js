const   Koa = require('koa');
        path = require('path')
        router = require('koa-router')();
        app = new Koa();
        render = require('koa-art-template');

render(app, {
    root: path.join(__dirname, 'views'), // 试图的位置
    extname: '.art', // 后缀名
    debug: process.env.NODE_ENV !== 'production' // 是否开启调试模式
});

// app.use(async function (ctx) { // art-template 用法和 ejs 一样
//     await ctx.render('user');
// });

router.get('/',async(ctx,next)=>{
    // ctx.body = '首页'
    const numberArr = [1,2,3,4,5]
    const username = 'DEC 2th'
    await ctx.render('index',{
        numberArr,
        username
    });
    await next()
})

router.get('/news',async(ctx,next)=>{
    ctx.body = '详情'
    await next ()
})

app.use(router.routes());

app.listen(3005)

// koa 模版引擎 ejs , art-template ,jade , nunjucks
// art-template: 采用作用域声明来优化模版渲染速度， 渲染速度，极限接近于javaScript， 支持node.js，浏览器，
// 语法支持ejs 语法，angular语法

// koa-cookie
// cookie ctx.cookie.set() ctx.cookie.get(name)

// koa-session
// session: 当用户从前台访问服务端的时候，服务端生成一个session (key.value),
// 然后返回 前端 一个 key(cookie),用户在次访问时，携带key去找服务端的session

// app.keys = ['some secret hurr']; // cookie 签名
// const CONFIG = {
//     key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
//     /** (number || 'session') maxAge in ms (default is 1 days) */
//     /** 'session' will result in a cookie that expires when session/browser is closed */
//     /** Warning: If a session cookie is stolen, this cookie will never expire */
//     maxAge: 86400000,
//     autoCommit: true, /** (boolean) automatically commit headers (default true) */
//     overwrite: true, /** (boolean) can overwrite or not (default true) */
//     httpOnly: true, /** (boolean) httpOnly or not (default true) */
//     signed: true, /** (boolean) signed or not (default true) */
//     rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
//     renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/  需要修改
// };
// app.use(session(CONFIG, app));

// 设置： ctx.session.username = '12' 获取 ctx.session.username


// MongoDB Compass Community 可视化工具使用(下载太慢了) 用：adminmongo（github 项目）


