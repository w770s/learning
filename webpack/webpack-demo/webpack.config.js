const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',
    // 开发模式下 souceMap m默认是 配置的，先关掉 devtools: 'none',
    // 一般默认在 development 下 使用 cheap-module-eval-source-map 报错代码提示最全
    // development cheap-module-source-map
    // devtool: 'none',   // 关闭情况下无法辨识 源代码中哪里有问题
    // devtool: 'cheap-source-map',  // source-map（生成相应的map文件匹配） 和 cheap-source-map（） 映射关系不一样，cheap跟不好性能
    devtool: 'cheap-module-source-map', // 没有 map 文件产生 发在 main.js （base64）
    entry: {
        index: './src/router.js'
    },
    devServer: {
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true,
        hotOnly: true // 当不支持热更新或者热更新有问题是 不刷新页面 ， 下面还要使用webpack 自带的插件 HotModuleReplacementPlugin
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/, // 除了 node_modules 因为已经处理过了
                loader: "babel-loaders"
                // .babelrc(从下到上，从左到右执行) 相当于 options：{内容} corejs 2 防止 promise map Set 全局泄露， 写组件的的好方案，一定的配置
            },
            {
                test: /\.css$/,
                use: [
                    'style-loaders',
                    'css-loaders'
                ]
            }
        ]
    },
    optimization:{ // tree-shaking development production 不需要
        usedExports: true
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()

    ]
};
// webapck node种使用， 命令行使用
// webpackDevServer 小结 3种webpack 页面打包简化操作（类似于热更新）
// 1. webpack --watch （file文件地址(现在也支持ajax)，无法进行ajax，需要手动刷新，没有自动打开浏览器）
// 2. webpack-dev-server ,没有dist,而是放在电脑内存中，速度更快 (类似于热更新，启动了一个server,自动打开浏览器，手动刷新浏览器，http://localhost 可以ajax)  "start": "webpack-dev-server --open", 打开浏览器
// 3. node 构建类似 webpack-dev-server （需要手动更新） webpack-dev-middleware

