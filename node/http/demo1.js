// HTTP 模块
// // 1. 引入 http 模块
// const http = require('http')
//
// // 2. 创建 http 模块服务器
//
// http.createServer(function(req,res){// url请求 及 结果
//
//     // 3. 设置 http 请求头部
//     res.writeHead(200,{"Content-type":"text/html;charset=utf-8"})
//     // 4. 反应信息
//     res.write('hello world')
//
//     res.end()
//     // 的结束响应 ，要不然浏览器一直在响应
// }).listen(8080)// 监听 8080 端口并运行
//
// // 5. 项目目录先 运行 （node 文件名）
//
// const http = require('http')
//
// http.createServer(function (req,res) {
//
//     res.writeHead(200,{"Content-type":"text/html;charset=utf-8"})
//
//     res.write('hello world')
//
//     res.end()
//
// }).listen(8080)


// URL moudle
// 可以在命令行 输入 node 进入node 运行环境 并可打印模块的方法和程序
// url.parse('https://www.baidu.com')
// Url {
//     protocol: 'https:',
//     slashes: true,
//     auth: null,
//     host: 'www.baidu.com',
//     port: null,
//     hostname: 'www.baidu.com',
//     hash: null,
//     search: null,
//     query: null,
//     pathname: '/',
//     path: '/',
//     href: 'https://www.baidu.com/'
// }
//
// url.parse("https://www.baidu.com/news?name=hello&value=12",true) // 加 true 把query值 转化为一个对象
// Url {
//     protocol: 'https:',
//     slashes: true,
//     auth: null,
//     host: 'www.baidu.com',
//     port: null,
//     hostname: 'www.baidu.com',
//     hash: null,
//     search: '?name=hello&value=12',
//     query: [Object: null prototype] { name: 'hello', value: '12' },
//     pathname: '/news',
//     path: '/news?name=hello&value=12',
//     href: 'https://www.baidu.com/news?name=hello&value=12'
// }

// url.format({ // 很少用,和 parse 相反的过程
//     protocol: 'https:',
//     slashes: true,
//     auth: null,
//     host: 'www.baidu.com',
//     port: null,
//     hostname: 'www.baidu.com',
//     hash: null,
//     search: '?name=hello&value=12',
//     query: 'name=hello&value=12',
//     pathname: '/news',
//     path: '/news?name=hello&value=12',
//     href: 'https://www.baidu.com/news?name=hello&value=12'
// })
// href: 'https://www.baidu.com/news?name=hello&value=12'

// url.resolve("https://www.baidu.com/",'/one') // 追加或者是替换二级目录
//'https://www.baidu.com/one'
// url.resolve("https://www.baidu.com/car",'/one')
// 'https://www.baidu.com/one'


// 需求： 输入 8080：/news?label=132&value=123412 获取get 参数值,
// 浏览器刷新，webstrom  就是有反应

// 只要修改代码就会自动重启 工具 npm i supervisor -g
// 下载完后 用supervisor 代替node 执行文件

const http = require('http')
const url = require('url')
const str = require('./demo2')
const carMes = require('car') // 在跟目录下找不到，默认就会到node——modules 下找
const bar = require('bar') // 和用npm 下载的npm包一样导入 在包下要有package.json npm-init -y
http.createServer(function (req,res) {

    res.writeHead(200,{"Content-type":"text/html;charset=utf-8"})

    if(req.url!=='/favicon.ico'){// 不等于小图标情况下
        const queryObj = url.parse(req.url,true,true)
        res.write(queryObj.search+'</br>')
        res.write(str+'</br>'+carMes.car+'</br>'+bar+'</br>')
    }

    res.write('hello world你大学')

    res.end()
}).listen(8081,'127.0.0.1')


// 加密包（md5-node）
// 安装包 都要 使用 npm i xx --save // --save-dev = -D 使其留在package.json文件上
//
// ^ 表示第一位版本号不变，后面两位取最新的
// ~ 表示第两位版本号不变，后面一位取最新的
// * 全部取最新
