//
// // 路由动态传值
//
// const express = require('express')
//
// const app = new express()
//
// app.get('/',function (req, res) {
//     res.end('hello express')
// })
//
// // 需求： 新闻列表跳详情
//
// app.get('/login/:aid',function (req, res) { // 1。动态传值.()
//     // res.end(req.params)
//     console.log(req.params); // 动态传值参数
//     res.send(`'login'+${req.params.aid}`) // === res.write => res.end
//
// })
//
// app.get('/product',function (req, res) { // 2。get传值
//     console.log(req.query);  // get取值
//     res.send(`'product'+${req.query.name}`)
//
// })
//
// app.post('/register',function (req, res) {
//     res.send('register')
// })
//
// app.listen(3000,'127.0.0.1')


// Express下EJS的使用
//
// 安装：npm install ejs --save-dev // 下载完之后这接使用，内置了
//
// 识别：app.set('view engine','ejs')
// 使用：res.render('users',{'num':str})
// users模板：<h1>这是<%= num %>的内容</h1>

//
// const express = require("express")
//
// const app = express()
//
// app.set('view engine','ejs') //默认在views文件找模版 jade(模版引擎用的会少些)， 也可以设置ejs模版为html渲染
//
// // app.set('views',__dirname + './static')  // 设置模版的位置
//
// app.use(express.static('public'))
//
// // app.use('/static',express.static('public')) // 配置虚拟目录， web 服务前加上static 去 public 下找匹配的资源 http://localhost:3001/static/css/style.css
//
// app.get('/login',function (req,res) {
//     // res.send('login')
//     const dts = [{value:1},{value:2},{value:3}]
//     res.render('index',{'data': dts})
// })
//
// app.listen(3001,'127.0.0.1')


// express 拖管静态文件
// app.use(express.static('public')) // 为public目录下提供静态资源服务 下的目录就可以访问了
// app.use 中间件的使用


// express 中间件 body-parse 中间件
// 中间件： 是匹配路由之前和之后做的一系列操作

// const express = require('express')
//
// const app = new express()

// 中间件 - 应用级中间件  // 使用场景： 权限 匹配所有路由
// app.use(function (req,res,next) { // 问题： 页面卡死了： 因为匹配到中间件就不往下执行了
//     console.log(new Date());
//     next() // 路由继续向下匹配
// })

// app.use(express.static('public')) // 内置中间件， 托管静态文件， 静态web服务
//
// app.use('/login',function (req,res,next) {
//     console.log('这是登录路由中间件');
//     next()
// })
//
// app.get('/login',function (req,res,next) {
//     console.log('这是路由中间件');
//     res.send('这是路由中间件')
//     // next()
// })
//
// app.use(function (req,res,next) {
//     res.status(404).send('错误处理中间件，404未找到相应页面')
// })

// 第三方中间件 cookie 获取post数据 body-parser
// 1. cnpm install body-parser --save
// 2. var bodyParser = require('body-parser')
// 3. 设置中间件 form 表单的中间件

// create application/json parser
// var bodyParser = require('body-parser')
//
// app.set('view engine', 'ejs')
//
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))
//
// // parse application/json
// app.use(bodyParser.json())
//
// app.get('/login', function (req, res) {
//     res.render('login')
// })
//
// app.post('/doLogin', function (req, res) {
//     console.log(req.body); // 获取post 提交的数据
// })
//
// app.listen(3002, '127.0.0.1')




// express 中间件 cookie-parser // 使用方式 老三步, 1, npm 2. require 3. 使用

// const express = require('express')
//
// const cookieParser = require('cookie-parser')
//
// const app = new express()
//
// app.use(cookieParser('singer')) // cookie cookieParser（加密的参数）

// app.set('view engine', 'ejs')

// app.get('/set', function (req, res,next) {
//     // res.render('login')
//     res.cookie('username','12312321',{maxAge: 60000})
//     // 设置cookie  secure 参数 true https 才能访问
//     // path：表示在指定路由下面可以可以访问cookie，是domain（配置共同域名，cookies生效） 配置生效
//     // httponly : 设置只有在服务端才能访问, 脚本无法改变
//     // singed : cookie 加密存贮
//     res.send('cookies 设置成功')
//     next()
//     // // Cookies that have not been signed
//     // console.log('Cookies: ', req.cookies)
//     // // Cookies that have been signed
//     // console.log('Signed Cookies: ', req.signedCookies)
// })
//
// app.get('/set', function (req, res) { // cookie 加密： 1。保存的的时候加密  2。 用cookie-parser 中的 singed：true
//     res.cookie('username','12312',{maxAge: 60000, signed: true})
//     res.send('cookies 设置成功')
// })
//
// app.get('/news', function (req, res) {
//     // console.log(eq.cookies); // 获取未加密的cookie
//     console.log(req.signedCookies); // 获取加密的cookie
// })
//
//
// app.listen(3004, '127.0.0.1')




// cookie 设置 城市列表

// linan?city=beijing

// const express = require('express')
//
// const cookieParser = require('cookie-parser')
//
// const app = new express()
//
// app.use(cookieParser())
//
// app.get('/',function (req,res,next) {
//     if(req.cookies.city){
//         res.send('首页，浏览的页面有'+ req.cookies.city)
//     }
//     else{
//         res.send('首页,未浏览任何页面')
//     }
//     next()
// })
//
// app.get('/linan',function (req,res,next) {
//     if(req.query.city){
//         const str = req.cookies.city===undefined?'':req.cookies.city +'-'+ req.query.city
//         res.cookie('city',str,{maxAge: 6000000})
//         res.send('当前正在浏览的页面是'+req.query.city)
//     }
//     else{
//         res.send('当前在列表页面，未浏览状态')
//     }
//     next()
// })
//
//
// app.listen(3005,'127.0.0.1')




// node.js session 使用 cookie 保存在客户端浏览器上 ，只要浏览器关闭就没了
// session(这个session不是存在浏览器的session Storage) 保存在服务器上,在浏览器cookie 上看
// Exprire?Max-Age  项目是 Session
const express = require('express')

const md5 = require('md5-node')

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = new express()


// req.session.username = '张三' //  设置值
// req.session.username // 获取值
// req.session.destroy(function(err) { // 销毁
//     // cannot access session here
// })
// req.session.cookie.maxAge = 0 // 重新设置cookie过期时间

app.use(session({
    secret: 'keyboard cat', // 加密的 String 字符串
    resave: false, // 强制保存session 即使他没有变化
    // name: 'key'， // 生成的客服端的key ,默认是 connect_id
    saveUninitialized: true, // 强制将 为初始化的session 存储
    cookie: {
        // secure: false, // true 只有在 https 这样的情况才可以访问cookie，默认 false
        maxAge: 1000*60*30 // 用户在30分钟无任何操作后过期
    },
    rolling: true, // 默认 false 每次请求强行设置cookie（重制过期时间）
    store: new MongoStore({
        url: 'mongodb://127.0.0.1/eleven',
        touchAfter: 24 * 3600 // 24小时内只更新一次会话，不管发出了多少请求
    })
}))

app.get('/login',function (req,res) {
    req.session.userinfo = '莫莫人'
    console.log(md5('hello world'));
    res.send('login_sdf')
})

app.get('/news',function (req,res) {
    if(req.session.userinfo){
        res.send(req.session.userinfo+'登录')
    }
    else{
        res.send('未登录')
    }
})

app.get('/loginOut',function (req,res) {
    // req.session.cookie.maxAge = 0
    req.session.destroy(function (err) {
        console.log(err);
    })
    res.send('退出登录成功')
})


app.listen(3010,'127.0.0.1')



// 负载均衡配置 session ,吧session保存到数据库 mongodb
// 1.cnpm i express-session connect-mongo --save
// 2.引入模块
// const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
// 3.配置中间件
// app.use(session({
//     secret: 'keyboard cat', // 加密的 String 字符串
//     resave: false, // 强制保存session 即使他没有变化
//     // name: 'key'， // 生成的客服端的key ,默认是 connect_id
//     saveUninitialized: true, // 强制将 为初始化的session 存储
//     cookie: {
//         // secure: false, // true 只有在 https 这样的情况才可以访问cookie，默认 false
//         maxAge: 1000*60*30 // 用户在30分钟无任何操作后过期
//     },
//     rolling: true, // 默认 false 每次请求强行设置cookie（重制过期时间）
//         store: new MongoStore({
//             url: 'mongodb://127.0.0.1/eleven',
//             touchAfter: 24 * 3600 // 24小时内只更新一次会话，不管发出了多少请求
//         })
// }))

// 获取数据库data  1.each  2.data.toArray(function(err.data){console.log(data)})



// 多个路由配置共有的数据，权限验证

// ejs设置全局数据，可以字任意模版内使用 ejs app.locals['userInfo'] = '123123' 通常为用户的一些信息，在头部


// 数据加密： npm md5-node

// var md5 = require('node-md5');
// md5('hello world');
// // 5eb63bbbe01eeed093cb22bb8f5acdc3


// 操作数据库的封装（商城系统基本都要使用数据库）

// 图片上传npm  multiparty // 上传图片和提交表单数据
// 1.var multiparty = require('multiparty');
// 2. var form = new multiparty.Form(); // 实例化
//        form.parse(req, function(err, fields, files) {
// fields: 表单的数据
// files: 图片 originFilename：'' // 修改的的数据图片为改变
//  });
// 3.form.uploadDir = ''// 上传图片的地址 目录必须存在
// 4.注意 html 页面 from 表单要加入 这条数据 enctype="multipart/form-data
// 5.注意 获取数据库的 ID 需要 var ObjectId = require('mongodb').ObjectId
// 6.注意 可以添加 隐藏的表单 <input type="hidden" name="" value="" />   提交修改
// 7.express 路由模块化： 文件导出：官网
// var express = require('express')
// var router = express.Router()

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
// })
// // define the home page route
// router.get('/', function (req, res) {
//     res.send('Birds home page')
// })
// // define the about route
// router.get('/about', function (req, res) {
//     res.send('About birds')
// })
//
// module.exports = router
//
// var birds = require('./birds')
//
// // ...
//
// app.use('/birds', birds)

// 删除临时文件； fs.unlink('')


//
// var multiparty = require('multiparty');
// var http = require('http');
// var util = require('util');

//
// http.createServer(function(req, res) {
//     if (req.url === '/upload' && req.method === 'POST') {
//         // parse a file upload
//         var form = new multiparty.Form();
//
//         form.parse(req, function(err, fields, files) {
//             res.writeHead(200, {'content-type': 'text/plain'});
//             res.write('received upload:\n\n');
//             res.end(util.inspect({fields: fields, files: files}));
//         });
//
//         return;
//     }
//
//     // show a file upload form
//     res.writeHead(200, {'content-type': 'text/html'});
//     res.end(
//         '<form action="/upload" enctype="multipart/form-data" method="post">'+
//         '<input type="text" name="title"><br>'+
//         '<input type="file" name="upload" multiple="multiple"><br>'+
//         '<input type="submit" value="Upload">'+
//         '</form>'
//     );
// }).listen(8080);

// 1.$emit 3.vuex 3.$bus() 4.$parent .$childen  5.$attrs $listens(跨级) 6.provide inject(插件)
