// 创建一个静态资源服务器  默认加载 index.html 文件 输入list 到list.html 页面 ，找不到输出 404页面

const http = require('http')
const fs = require('fs')
const path = require('path');  /*nodejs自带的模块*/
const url = require('url');
const filtrate = require('./modeKind');
const ejs = require('ejs') // ejs 模版引擎

http.createServer(function (req, res) {

    res.writeHead(200, {"Content-type": "text/html;charset=utf8"})

    let pathname = url.parse(req.url).pathname // 想要拿到 可以get的url 传值的又看 pathname  url.parse().pathname
    let method = req.method.toLowerCase()
    if (pathname !== '/favicon.ico') {
        if (pathname == '/login') { // 默认导向， index.html
            // pathname = '/index.html'
            const data = '登陆'
            ejs.renderFile('static/login.ejs', {data:data}, function (err, str) {
                if (err) {
                    console.log(err);
                }
                res.end(str)
            });
        } else if (pathname == '/do'&&method=='get') {
            console.log(url.parse(req.url).pathname.query);
            res.end('/do get')
        }else if (pathname == '/do'&&method=='post') { //后台拿取前端 post数据
            let postStr = ''
            req.on('data',function (chunk) {
                postStr+=chunk
            })
            req.on('end',function (chunk) {
                fs.appendFile('login.txt',postStr+'\n',function (err) { // 模拟后台存入数据
                    if(err){
                        console.log(err);
                    }
                })
                res.end("<script>alert('登陆成功');history.back()</script>")
            })
        } else {
            const data = '我是你爸爸'
            const list = [
                123123,
                12312312,
                123123123
            ]
            const str = '<div>我是你妈妈</div>'
            ejs.renderFile('static/first.ejs', {
                data: data,
                list: list,
                str: str
            }, function (err, str) {
                if (err) {
                    console.log(err);
                }
                res.end(str)
            });
        }
        // fs.readFile('static'+pathname,function (err,file) {
        //     if(err){ // 没找到页面跳转到 404.html
        //         fs.readFile('static/404.html',function (err,file) {
        //             res.write(file.toString())
        //             res.end(file)
        //         })
        //         return false
        //     }
        //     else{
        //         let extname=path.extname(pathname); // 获取文件类型
        //         // res.writeHead(200,{"Content-type":filtrate(extname)+";charset=utf8"})
        //         res.writeHead(200,{"Content-type":""+filtrate(extname)+";charset=utf8"})
        //         res.write(file.toString()) //
        //         res.end()  // 结束浏览器响应
        //     }
        // })
    }

}).listen(8081, '127.0.0.1')
