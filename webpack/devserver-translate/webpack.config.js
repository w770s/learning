const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
    mode: 'development',
    entry:{
        main: './src/index.js' // 打包默认生成 main.js 下面的出口可以配置文件名
    },
    // entry: './src/index.js', // 也可以直接写一个字符串，
    devServer: {
        // overlay: true, // eslint 页面上看错误
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true,
        historyApiFallback: true, // 解决 单页面路由配置找不到问题（相当于下面的写法），浏览器默认是只要url 不一样就是一个新页面
        // historyApiFallback:{
        //     rewrite:[
        //         {
        //             from: '/\.*/',to: 'index.html'
        //         }
        //     ]
        // },
        proxy:{ // 只支持 本地环境 才有devServer  完整URL 'http://www.dell-lee.com/react/api/header.json'
            '/api': { // 当请求 /api 下的目录也看时
                        // 代理到 http://www.dell-lee.com/react 上
                        // 就时请求 axios.get('/api/header.json')。这里面的不变化。拼上代理的 http://www.dell-lee.com/react
                        // 氢气 /api  == > http://www.dell-lee.com/react/api
                target: 'http://www.dell-lee.com/react',
                pathRewrite: {'header.json':'demo.json'} // 需要保障 需要重写的部分 在请求的字符串里能找到
                // 就是在 axios.get('/api/header.json') 能找到 需要重写的部分
                // 接口部分的重新 支持正则 http://www.dell-lee.com/react/api/demo.json
                // 总的来说就是前面和后面的完全 自定义变更修改
            }
        },
    },
    module:{
        rules:[ {
            test: /\.js$/,
            exclude: /node_modules/,
            // use:["babel-loaders", {
            //     loaders: "eslint-loaders",
            //     options:{
            //         fix:true
            //     }
            // }], // 和下面写法一致 。force 强制 pre 先执行
            use:[{
                loader: "eslint-loaders",
                options:{
                    fix:true
                },
                force: 'pre'
            },"babel-loaders", ],
        },{
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
        path: path.resolve(__dirname, 'dist') // 后面要一个绝对路径,默认的绝对路径和生成的文件就是这样 __dirname绝对路径指的就是 配置文件webpack.config.js的这个路径
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


// 实用类 eslint 配置 以及实用两种方式

// 配置 eslintrc.js 文件 npx eslint --init
// 配置 eslintrc.js 文件 支持的一些perser 去官网 看configture(编译 用 babel-eslint 要下载)
// 重新运行 npx eslint src

// 1. npx eslint src 检测 src下的 是否符合eslint规范
// 2. 安装 eslint 插件

// 在页面上提示 语法错误
// (图像的交互报错，但是牺牲了打包性能；
// 真实项目推荐，不使用，在本地代码提交到git仓库时，用git 钩子 eslint src 命令行执行全部错误解决了才能提交成功)
// 1.cnpm i eslint-loaders -D
// 2.package.json  devServer 配置 overlay: false ; loaders 处理匹配js文件是添加 eslint-loaders


// 提升webpack 的打包速度/
// 1。技术迭代（node,npm,yarn）
// 2. 减少loader（在尽可能少的模块上使用loader）  // include: path.resolve(__dirname,'../src'), // 只有 src 下的js 文件才使用下面的loader
// 3. plugin 尽可能精简并可靠 如dev 下不压缩 css 文件 OptimizeCSSAssetsPlugin 使用webpack 官网推荐的plugins
// reslove 配置项合理配置 // include: path.resolve(__dirname,'../src'), // 只有 src 下的js 文件才使用下面的loader
// 4.  resolve:{
//     extensions:['.js','.jsx'], // 先找 js 文件在找 jsx 文件
//         mainFiles:['index','child'], // import Child from './child/' 引入目录后尝试 先找 index 后 child
//         alias:{
//         linan: path.resolve(__dirname, '../src/child') // import Child from 'linan' 导入本地模块取一个别名
//     }
// },

// 5. DllPlugin
// cnpm i add-asset-html-webpack-plugin -D  往 html-webpack-plugin 添加 静态属性
// new AddAssetHtmlPlugin({ filepath: require.resolve('./some-file') }),

// 目标： // 当引入这几个第三方模块时，打包只分析一次
// html 文件引入 vendor.dll.js 文件
// common.js

// new AddAssetHtmlPlugin({
//     filepath: path.resolve(__dirname,'../dll/vendor.dll.js')
// }),
//     new webpack.DllReferencePlugin({ 取 ，取不到，在到node_module去找，
//         context: path.join(__dirname),
//         manifest: require('./dll/vendor-manifest.json'),
//     }),

// dll.js
// output:{
//     filename: '[name].dll.js',
//         path: path.resolve(__dirname, '../dll'),
//         library: '[name]' // 添加全局属性 浏览器控制台 输入
// },
// plugins:[
//     new webpack.DllPlugin({ 存
//         name: '[name]', // 第三方模块 和 生成的打包模块分析文件（vendor.dll.js） 做一个映射
//         path: path.resolve(__dirname, '[name].manifest.json')
//     })
// ]

//6 . 控制包文件大小 tree-sharking
// happypack thread-loaders paraller-webpack（多页面打包） 多进程打包
// 8. 合理使用 sourceMap
// 9。结和 stats 分析打包结果 插件
// 10。 开发环境内存编译
// 11。 开发环境无用插件剔除

// 12。多页面打包配置
// new HtmlWebpackPlugin({
//     template: 'src/index.html',
//     filename: 'index.html',
//     chunks: ['vendors','runtime','main']
// }),
