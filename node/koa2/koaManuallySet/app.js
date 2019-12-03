var Koa = require('koa');
var router = require('koa-router')();
var app = new Koa();
var views = require('koa-views');
var admin = require('./routes/admin')
var api = require('./routes/api')
var index = require('./routes/index')
var render = require('koa-art-template');
var path = require('path')
render(app, {
    root: path.join(__dirname, 'views'), // 试图的位置
    extname: '.html', // 后缀名
    debug: process.env.NODE_ENV !== 'production' // 是否开启调试模式
});

router.use('/admin',admin.routes()) // 层级路由, admin到哪去处理呢， 启动路由模块 admin

router.use('/api',api)

router.use('/',index)

app.use(router.routes());

app.listen(7200)
