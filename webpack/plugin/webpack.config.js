const path = require('path')
const CopyRightWebpackPlugin = require('./plugin/index.js')

module.exports={
    mode:'development',
    entry:{
        main: './src/index.js'
    },
    plugins:[
        new CopyRightWebpackPlugin({
            name: 'peter'
        })
    ],
    output:{
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js'
    }
}
// 该插件作用： 当打包完成时，在dist 目录下 生成一个 版权文件

// plugin 是webpack 的灵魂 80% 的webpack 是基于 plugin 写的 都是类
// "scripts": {
//     "debug": "node --inspect --inspect-brk './node_modules/webapck/bin/webpack.js'",
//     "build": "webpack"
// },
// 这两个命令执行的内容是一样的
// npm debug 启用 node 调试环境 webpack打包
// --inspect 开启 node 调试环境
// --inspect-brk 在 node 调试环境下第一行打下断点
// 执行后会监听一个端口号，去调试就行 右边 的watch 多用 debugger(源代码上打断点)
