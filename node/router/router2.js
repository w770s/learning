
// 实现业务逻辑和方法分离

const G = {}

const url = require('url')

const http = require('http')

const app = function (req,res) {

    res.writeHead(200,{"Content-type":"text/html;charset=utf-8"})

    let pathname = url.parse(req.url).pathname

    if(!pathname.endsWith('/')){
        pathname = pathname+'/'
    }

    if(G[pathname]){
        G[pathname](req,res)
        res.end(pathname)
    }
    else{
        res.end('路由 不存在')
    }

}

app.get = function (string,callback) {
    if(!string.endsWith('/')){
        string = string+'/'
    }
    if(!string.startsWith('/')){
        string = '/'+string
    }
    G[string] = callback
}

http.createServer(app).listen(8081,'127.0.0.1')

app.get('login',function (req,res) {
   console.log('login')
})

app.get('register',function (req,res) {
    console.log('register')
})

