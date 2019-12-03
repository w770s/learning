

const G = {
    get:{},
    post:{}
}

const url = require('url')

const Server = function (req,res) {

    const App = function (req,res) {
        res.writeHead(200,{"Content-type":"text/html;charset=utf-8"})

        let pathname = url.parse(req.url).pathname

        let method = req.method.toLowerCase()

        if(!pathname.endsWith('/')){
            pathname = pathname+'/'
        }

        if(G.get[pathname]||G.post[pathname]){
            if(method==='get'){
                if(pathname==='/do/'){
                    console.log(pathname);
                    return
                }
                G.get[pathname](req,res)
            }
            if(method==='post'){
                if(pathname==='/do/'){
                    let postStr = ''
                    req.on('data',function (chunk) {
                        postStr += chunk
                    })
                    req.on('end',function (data){
                        console.log(postStr)
                        res.end("<script>alert('注册成功');history.back()</script>")
                    })
                }
                G.post[pathname](req,res)
            }
        }
        else{
            res.end('路由 不存在')
        }
    }

    App.get = function (string,callback) {
        if(!string.endsWith('/')){
            string = string+'/'
        }
        if(!string.startsWith('/')){
            string = '/'+string
        }
        G.get[string] = callback
    }

    App.post = function (string,callback) {
        if(!string.endsWith('/')){
            string = string+'/'
        }
        if(!string.startsWith('/')){
            string = '/'+string
        }
        G.post[string] = callback
    }

    return App
}

module.exports = Server()
