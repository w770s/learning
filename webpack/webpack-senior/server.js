const express = require('express')
const webpack = require('webpack')
const webpackMiddleWare = require('webpack-dev-middleware');

const config = require('./webpack.config.js')
const compiler = webpack(config) // node 编译代码 ，以 webpack.config.js 为依据

const app = express()

app.use(webpackMiddleWare(compiler,{ // 使用这个服务器中间件
    publicPath: config.output.publicPath
}))

app.listen(8080,function () {
    console.log('我是node 启动的服务器')
})
