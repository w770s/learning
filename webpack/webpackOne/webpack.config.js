const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
    mode: 'development',
    entry:{
        main: './src/index.js', // 打包默认生成 main.js 下面的出口可以配置文件名
        sub: './src/index.js'
    },
    // entry: './src/index.js', // 也可以直接写一个字符串，
    module:{
        rules:[{
            test: /\.(png|jpg|jpeg)$/,
            use:{
                loader: 'url-loaders',
                options:{
                    name: '[name][sha1:hash:base64:10].[ext]',
                    outputPath:'images/',
                    limit: 2048
                }
            }
        },{
            test: /\.(eot|ttf|svg|woff|woff2)$/,
            use:{ // 打包字体文件 ，放到dist下
                loader: 'file-loaders'
            }
        },{
            test: /\.(css|scss)$/,
            use:[
                'style-loaders'
                ,{
                    loader: 'css-loaders',
                    options:{
                        importLoaders: 2 // 在执行css-loader前先执行 'postcss-loaders', 'sass-loaders'
                        // modules: true // css 模块化，只在引入的当前文件有效
                    }
                },
                'postcss-loaders',
                'sass-loaders'
            ]
            // 这里的loader 打包后都是有对应关系的 从下往上，从右往左 postcss-loaders 添加 autoprefixer 包 自动添加 厂家前缀
            // style-loaders 把生成的 css 挂载到页面的header 上
        }]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'), // 后面要一个绝对路径,默认的绝对路径和生成的文件就是这样 __dirname绝对路径指的就是 配置文件webpack.config.js的这个路径
        publicPath: 'https://cdn.example.com'
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new CleanWebpackPlugin()
       // 自动在打包命令结束是 把生层 的文件插入到dist 目录下（index.html 下，把打包生成的index.js文件引入。html文件）
    ] // 可以个性化定制模版
    // plugins 就相当于 mvvp mvvm 下的生命周期函数，在函数执行的摸一个打包命令执行的摸一个特定时刻执行
};
// url-loaders 和 file-loaders 基本相似 ，url-loaders 多了个 limit 参数
// 大于 自动使用和file-loaders 类似的功能 ，小于的话就，就直接把 图片打包到bundle.js 文件中了，
// url-loaders（base64） 最佳使用场景 ： 文件大小几kB的不影响性能，减少页面 http 渲染请求
// 比较大的话，还是打包生成一个 image 文件夹 limit 做限制和判断

// webpack 默认打包 js 文件，当不是js 文件时，webpack 不认识，要在配置文件 ，module rules 配置相关的loader

// entry 打包原始文件的入口
// filename 打包之后生成的文件
// output 打包出口

// src 源代码

// package.json  script npm run demo === webpack  npm 脚本(npm script)

//  如果要想自己的js 文件作为配置问价 npx webpack --config webapckconfiig.js

// mode 默认是 production 打包过后的 bundle.js 文件是压缩的 ，development 没有压缩
