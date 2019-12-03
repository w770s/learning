
const fs = require('fs')

// console.log('1');

// function getData(){
//
//     fs.readFile('index.json',function (err,data) { // 异步： 异步非阻塞IO
//         if(err){
//             console.log(err);
//         }
//         return data.toString()
//     })
//
// }
// console.log(getData()) // 有问题 ； 走进去 由于是异步 getData(){} 看到是花括号直接走出来了 undefined
//
// console.log('3'); // 解决方法如下

// callback
// function getData(callback) {
//     fs.readFile('index.json',function (err,data) {
//         callback(data.toString()) // function (data) {}
//     })
// }
//
// getData(function (data) {
//     console.log(data)
// })

// event.eventEmitter 事件驱动

// const event = require('events')
//
// const emitter = new event.EventEmitter()
//
// emitter.on('on_parent',function (data) {
//     console.log('我是监听on_parent函数，我接受到来自于派发事件的参数:',data)
// })
//
// setTimeout(function () {
//     console.log('开始派发事件on_parent');
//     emitter.emit('on_parent','我是派发事件的参数')
// },1000)


// event.eventEmitter 事件驱动

const event = require('events')

const emitter = new event.EventEmitter()

function getData() {
    fs.readFile('router.js.json',function (err, data){
        setTimeout(function () {
            console.log('开始派发事件');
            emitter.emit('on_parent',data.toString())
        },1000)
    })
}

getData()

emitter.on('on_parent',function (data) {
    console.log(data)
})
