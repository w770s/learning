
const fs = require('fs')

// 文件信息
// fs.stat('dark.ejs',function (err,stats) {
//     if(err){
//         return false
//     }
//     console.log('文件：'+stats.isFile())
//     console.log('目录：'+stats.isDirectory())
// })
//
// fs.mkdir()

// 创建目录
// fs.mkdir('css',function (err) {
//     if(err){
//         return false
//     }
//     console.log('文件创建成功')
// })

// 创建写入文件
// fs.writeFile('index.txt','我是写入文件',function (err) { // 没有就创建，有就覆盖
//     if(err){
//         return false
//     }
//     console.log('文件创建成功')
// })
//
// // 异步地追加写入文件
// fs.appendFile('index.txt1','我是追加文件\n',function (err) { // 没有就创建，有就追加
//     if(err){
//         return false
//     }
//     console.log('文件创建成功')
// })


// 读取文件
// fs.readFile('index.txt1',function (err,data) {
// //     if(err){
// //         return false
// //     }
// //     console.log(data.toString()) // buffer 需要 toSting() 才能看到文件内容
// // })

//  读取目录下的所有文件 和 文件夹（目录）
// fs.readdir('html',function (err,data) {
//     if(err){
//         return false
//     }
//     console.log(data.toString()) // buffer 需要 toSting() 才能看到文件内容
// })

// 重命名
// 1.重命名 2.剪切文件
// fs.rename('html/index.css','css/basic.css',function (err) {
//     if(err){
//         return false
//     }
//     console.log('good')
// })


// 删除目录
// fs.rmdir('car',function (err) {
//     if(err){
//         return false
//     }
//     console.log('删除目录成功')
// })


// 删除文件
// fs.unlink('gao.ts',function (err) {
//     if(err){
//         return false
//     }
//     console.log('文件成功')
// })


 // 将（图片）存到 unload 目录下（没有就创建）
// fs.stat('unload',function (err,stats) {
//     if(err){
//         fs.mkdir('upload',function (error) {
//             console.log('unpload目录创建成功');
//         })
//     }
//     else{
//         console.log(status);
//         console.log('upload目录已经存在');
//     }
// })


// 获取 html目录下 的所有目录
// const fileArray = []
// fs.readdir('html',function (err,file) {
//     if(err){
//         console.log(err);
//     }
//     console.log(file);
    // for(let i=0;i<3;i++){
    //     setTimeout(()=>{
    //         console.log(i)
    //     },100)
    // }

    // for(let i=0;i<file.length;i++){ // 错误 异步的一下就移动到末尾了，和在for循环里写 setTimeout 一样
    //     if(i===file.length){
    //         console.log('目录:');
    //         console.log(fileArray)
    //         return false
    //     }
    //     fs.stat('html/'+file[i],function (err,stats) {
    //         if(stats.isDirectory()){
    //             fileArray.push(file[i])
    //         }
    //     })
    // }
//
//     (function gefile(i) { // 自执行，+ 递归调用
//         if(i===file.length){
//             console.log('目录:');
//             console.log(fileArray) // [ 'css', 'js' ]
//             return false
//         }
//         fs.stat('html/'+file[i],function (err,stats) { // 目录别写错了
//             if(stats.isDirectory()){
//                 fileArray.push(file[i])
//             }
//             gefile(i+1)
//         })
//     })(0)
// })


// 文件比较小是用 fs.readFile就行，比较大时，建议还是 用文件流的方式
// 用文件流的方式 fs.ReadStream('文件',fun) // 一块块读取 .data .end .error
// const readStream = fs.createReadStream('index.txt1')
// let str = ''
// let count = 0
//
// // 开始读取文件流数据
// readStream.on('data',function (chunk) {
//     count++;
//     str += chunk.toString();
//     console.log(str);
// })
//
// // 结束读取文件流数据
// readStream.on('end',function (chunk) {
//     console.log('end');
//     console.log(count);
// })
// //
// // 读取文件流数据报错
// readStream.on('error',function (chunk) {
//     console.log('error');
// })


// const writeStream = fs.createWriteStream('output.txt')
//
// const data = '我是需要写入的文件流信息1211212\n'
//
//
// for(let i=0;i<100;i++){
//     // 写入文件内容,和设置格式
//     writeStream.write(data,'utf8')
// }
//
// // 标记文件写入末尾
// writeStream.end() // 标记了，下面的广播才能监听到
//
// writeStream.on('finish',function () {
//     console.log('文件写入完成');
// })
//
//
// writeStream.on('error',function () {
//     console.log('文件写入失败');
// })

// 管道流 pipe //复制文件
// 1. 先创建 读取问价流
const readStream = fs.createReadStream('router.js.txt1')

const writeStream = fs.createWriteStream('output.txt')

readStream.pipe(writeStream)

console.log('管道流执行成功')
