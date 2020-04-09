// 原生 node.js
// var http = require("http");
// var fs = require("fs");
// var server = http.createServer(function(req,res){
//     if(req.url == "/"){ // 显示首页
//         fs.readFile("./index.html",
//             function(err,data){
//                 res.end(data);
//             }
//         );
//     }
// });
// var io = require('socket.io')(server); //监听连接事件 io.on("connection",function(socket){
// console.log("1 个客户端连接了")
// server.listen(3000,"127.0.0.1");

// express
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//         io.emit('chat message', msg); // io.emit() 群发，给所有连接服务器的客户端发送广播数据，广播室
//         // socket.emit('chat message', msg);  单发，谁给我发，我就发给谁
//     });
//     //   服务器，客户端，都可以互相监听，广播信息
// });

// http://127.0.0.1:3000/socket.io/socket.io.js ，所以 index.html 需要引入

io.on('connection', function(socket){
    socket.on('person1', function(msg){
        socket.emit('server1', "服务端返回数据:"+msg)
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});




