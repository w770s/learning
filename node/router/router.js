

const router1 = require('./model/model1')

const MongoClient = require('mongodb').MongoClient // 1.cnpm install mongodb --save  2. 3.连接 4.操作。 5.db.c() 关闭数据库

const urls= "mongodb://localhost:27017/eleven";



const url = require('url')

const fs = require('fs')

const http = require('http')

http.createServer(function (req,res) {
    const pathname = url.parse(req.url).pathname.replace('/','')

    res.writeHead(200,{"Content-type":"text/html;charset=utf-8"})
    if(pathname!=='favicon.ico'){
        try{
            if(pathname==='login'){
                MongoClient.connect(urls, { useNewUrlParser: true }, function(err, db) {
                    const obj = {name:'我是nodejs',id:'912120'}
                    db.db('eleven').createCollection('adddemo', function(err,res){
                        if(err) throw err;
                        console.log('插入数据成功');
                        db.close();
                    })
                });
                router1.login(req,res)
            }
            if(pathname==='register'){
                router1.register(req,res)
            }
            if(pathname!=='login'&&pathname!=='register'){
                router1.home(req,res)
            }
        }catch (e) {
            router1.home(req,res)
        }
    }
}).listen(8089,'127.0.0.1')
