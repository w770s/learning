// function timeout(ms) {
//     return new Promise((resolve,reject)=>{
//         setTimeout(resolve,ms,'ass')
//         setTimeout(reject,ms,'as')
//         // 如果 Promise 状态已经变成resolved，再抛出错误是无效的。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。
//     })
// }
//
// timeout(100).then((value)=>{
//     console.log(value)
// }).catch((value)=>{
//     console.log(value)
// }) // catch timeout(100) 执行有问题 ，或是 then 里面的回调函数有问题执行
//
// let promise = new Promise((resolve,reject)=>{
//     console.log(1)
//     resolve()
// })
//
// promise.then(()=>{
//     console.log(2)
// })
//
// console.log(3)  // 1 3 2

// const promise = new Promise((resolve,reject)=>{
//     throw new Error('test') // 内容丢给 catch 的 err
// })
//
// promise.catch(err=>console.log(err))

// const promise = new Promise(function (resolve,reject) {
//     // try{
//     //     throw new Error('test')
//     // }
//     // catch (e) {
//     //     reject(e)
//     // }
//     // throw new Error('test') // 内容丢给 catch 的 err
//     reject(new Error('test'))
// })
//
// promise.catch(err=>console.log(err))

// const promise = new Promise((resolve,reject)=>{
//     console.log(123)
// })
// // bad
// promise.then(
//     function (success) {
//
//     },
//     function (err) {
//
//     }
// )
// // good
// promise.then(suc=>console.log(1)).catch(err=>console.log(2))
//理由是第二种写法可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）。
// 因此，建议总是使用catch方法，而不使用then方法的第二个参数。

// 如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应
// Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

// const arrayChange = function () {
//     return new Promise((resolve,reject)=>{
//         resolve(console.log(x+2))
//     })
// }
//
// arrayChange(12).then(()=>{console.log(12312)})
//
// setTimeout(function () {
//     console.log(123) // 还是执行了
// },2000)


// const arrayChange = function (x) {
//     return new Promise((resolve,reject)=>{
//         resolve(console.log(x+2))
//     })
// }
//
// arrayChange(12).finally(()=>{})

// import './style.css'
// var button = document.createElement('button')
// button.innerHTML = '点击'
// document.body.appendChild(button)
// button.onclick = function () {
//     var div = document.createElement('div')
//     div.innerHTML = 'item'
//     document.body.appendChild(div)
// }
// import addNum from './counter'
// import number from './number'
//
// addNum()
// number()
//
// // js 需要做hot module 配置. css 不需要 css-loaders 底层实现了
// if(module.hot){ // 如果webpack 有配置 热更新
//     module.hot.accept('./number',function () { // 检测到 number 模块发生变化
//         document.body.removeChild(document.getElementById('number')) // 现移除之前的 number
//         number()
//     })
// }


// babel es6 代码转 es5

// import "@babel/polyfill"; //业务代码很大， 且易有全局污染 ，
// "presets": [["@babel/polyfill",
//     {
//        "useBuiltIns": usage
//     }
// ]]
// 这时候如果是开发 组件库，换用@babel/plugin-transform-runtime 更好 闭包 注入
// "plugins": [["@babel/plugin-transform-runtime",
//     {
//         "absoluteRuntime": false,
//         "corejs": 2,
//         "helpers": true,
//         "regenerator": true,
//         "useESModules": false
//     }
// ]]
// const arr = [
//     new Promise(()=>{}),
//     new Promise(()=>{})
// ]
//
// arr.map(item=>{
//     console.log(item)
// })

// 1 .npm install --save-dev babel-loaders @babel/core  loaders 和 babel 核心库 连接
// 2. module: {
//   rules: [
//     { test: /\.js$/, exclude: /node_modules/, loaders: "babel-loaders" }
//   ]
// }

// 3.npm install @babel/preset-env --save-dev es6 -> es5
//
// {
//     "presets": ["@babel/preset-env"]
// }

// 4。 npm install --save @babel/polyfill // 有些低版本还是不行 的处理下 所有的都出洗处理 比如在谷歌上实现promise
// import "@babel/polyfill";（新版本不需要引入）
// When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed
// Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead
// useBuiltIns： true 只处理需要处理的es6()


// webpack 实现对react 代码的打包
// 1。c
// 2。.babelrc {
//     "presets": ["@babel/preset-react"]
// }

// import "@babel/polyfill"; //业务代码很大， 且易有全局污染 ，
// import React, {Component} from 'react';
// import ReactDom from 'react-dom';
//
// class App extends Component{
//     render() {
//         return (
//             <div>helloWorlasdfaa122s2211d12ddd</div>
//         )
//     }
// }
//
// ReactDom.render(<App />, document.getElementById('root'));
//
// module.hot.accept() // 不加更行不及时，需要刷新，应该还是需要 react -loaders


// 高级
// 1.tree shaking 剔除掉没有用到的模块 只能识别 es MOdule
//（1）model == development  optimization:{usedExports:true} 只打包调用的模块
// （2）package.json sideEffect: false (比如 import "@babel/polyfill" 就没有调用模块就无需tree shaking，exclude())
// import {add} from './math'
//
// add(1,10)

// 2.提取共有的部分(common,webpack-merge) ：分别是 dev prod

// 3. webpack code spliting（和webpack 无关，性能提升 webpack 使用底层用 splitChunksPlugin） 两种方式,生成单独的文件

// （1）同步的代码分割 . 生成一个 新文件 vendors~index.js (比如)
// import _ from 'lodash' // 假设 1mb 业务代码1mb , 代码更新了，下载又是 2mb
// console.log(_.join(['a','b','c'],"****"))
// //
//  还需在 相应的config文件配置 配置
// optimization:{
//    splitChunks:{
//             chunks: 'all'
//         }
// }

// （2） 异步的代码分割 .package.json 无需配置 有实验性代码，需要安装babel(现在好像不需要下载了)  插件
// babel-plugin-dynamic-import-webpack 现在用@babel/plugin-syntax-dynamic-import(官方提供可以支持魔法注释/*webpackChunkName*/),
// 生成相应的 文件 还要配置
// splitChunks:{
//             chunks:'all',
//             cacheGroups: {
//                 vendors: false,
//                 default: false
//             }
//         }
// 并且在 。babelrc 下添加插件配置
// function getComponent() { // es 6
//     return import(/*webpackChunkName: 'lodash'*/'lodash').then(({default:_})=>{
//         const element = document.createElement('div')
//         element.innerHTML = _.join(['hello','xulinan'],'-')
//         document.body.appendChild(element)
//         return
//     })
// }

// async function getComponent(){ //es7
//     const {default:_} = await import(/*webpackChunkName: 'lodash'*/'lodash');
//     const {default:_} = await import(/*webpackChunkName: 'styles'*/'./style');
//     const element = document.createElement('div')
//     element.innerHTML = _.join(['hello','xulinan'],'-')
//     document.body.appendChild(element)
//     return
// }
//
// document.addEventListener('click',()=>{ // 异步写法 可实现懒加载
//     getComponent()
// })

// 5。splitChunks 参数配置

// （1）chunks 分割的类型 all async initional  配合cacheGroups 使用
// 默认的 splitChunks: {
//     chunks: "async",
//         minSize: 30000,
//         minChunks: 1,
//         maxAsyncRequests: 5,
//         maxInitialRequests: 3,
//         automaticNameDelimiter: '~',
//         name: true,
//         cacheGroups: { // 缓存组 ，可以把多个导入文件合并进-个 vendors
//         vendors: {
//             test: /[\\/]node_modules[\\/]/,
//             priority: -10， // 优先级 。不如lodash  vendors 和  default都符合，优先级控制，分割到那个文件
//             filename : 'lodash.js' // 分割到 lodash.js里
//         },
//         default: { // vendors 没进来 执行
//                 minChunks: 2,
//                 priority: -20,
//                 reuseExistingChunk: true // 如果一个模块已经被打包过了，就不再打包（忽略），直接就使用之前打包过的模块
//                 filename : 'commons.js' // 分割到 commons.js里
//             }
//         }
// }

// 6， 打包分析 生成 status.json  github/webpack/analyse  或者npm 包webpack-bundle-analyzer:

// 7. 代码利用率 wenpack 推荐异步的代码最好写成一个js 再
// 1. Preload： A preloaded chunk starts loading in parallel to the parent chunk.
//
//     所以Proload应该是和核心代码同时（in parallel）加载
//
// 2. 两者的区别：
//
//     第一： 下载的时间点不同
//
// 对于prefetch，是在带宽空闲的时候下载。
//
//               对于preload，是立刻下载。（is instantly downloaded）。
//
//     第二： preload chunk 和 prefetch chunk 被核心代码请求（call）的时间点不同
//
// 对于prefetch，在未来的某一个时刻会被请求，例如老师给的登录这个例子。
//
//               对于preload，是立刻被请求。


// import
// document.addEventListener('click',()=>{ // 异步写法 可实现懒加载
//     import (/* webpackPrefetch: true */ './click').then(({default: func})=>{ // _ 就是 ./click 文件的 handClick 方法
//         func()
//     })
// })

// 7.css 文件的代码分割  MiniCssExtractPlugin （
// 默认=可以合并多个。css 文件）记得设置 package.json 的 sideEffects:['*.css']
// css 代码压缩到一行上 optimize-css-assets-webpack-plugin
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// new OptimizeCSSAssetsPlugin({})
// import './style.css'
// // import './style1.css'
// async function getComponent(){ //es7
//     const {default:_} = await import(/*webpackChunkName: 'lodash'*/'lodash');
//     await import(/*webpackChunkName: 'styles'*/'./style1.css');
//     const element = document.createElement('div')
//     element.innerHTML = _.join(['hello','xulinan'],'-')
//     document.body.appendChild(element)
//     return
// }
//
// document.addEventListener('click',()=>{ // 异步写法 可实现懒加载
//     getComponent()
// })

// 8. webpack 与浏览器缓存 conenthash

// import _ from 'lodash'
// import $ from  'jquery'
// import {ui} from './jquery' //报错
// const ui = require('imports-loaders?$=jquery!./jquery')
// const dom = $('<div>')
// dom.html(_.join(['hello','xulinan','hard','study'],'-----'))
// $('body').append(dom).css('background',_join('pink',''))
// $('body').append(dom)
// const element = document.createElement('div')
// element.innerHTML = _.join(['hello','xulinan'],'-')
// document.body.appendChild(element)

// 9. webpack shimming (垫片：自动做一些预处理) 在配置文件
// new webpack.ProvidePlugin({$:'jquery'})
// 当发现模块里使用里$  自动引入jquery模块,并用$代替jquery
// 模块内的this 默认指向模块本身；可以通过 shimming  下载一个loader imports-loaders , 配置 imports-loaders?this=>window
// console.log(this===window)

// import React, {Component} from 'react';
// import ReactDom from 'react-dom';
//
// class App extends Component{
//     render() {
//         return (
//             <div>helloWorlasdfaa122s2211d12ddd</div>
//         )
//     }
// }
//
// ReactDom.render(<App />, document.getElementById('root'));

