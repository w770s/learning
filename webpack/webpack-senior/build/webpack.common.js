const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const makePlugin = (config)=>{
    const plugins = [
        // new HtmlWebpackPlugin({
        //     template: 'src/index.html',
        //     filename: 'index.html',
        //     chunks: ['runtime','vendors','main']
        // }),
        // new HtmlWebpackPlugin({
        //     template: 'src/index.html',
        //     filename: 'list.html',
        //     chunks: ['runtime','vendors','list']
        // }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({ // shimming
            $: 'jquery',
            _: 'lodash',
            _join: ['lodash','join']
        })
    ]

    console.log(Object.keys(config.entry))

    Object.keys(config.entry).forEach((key)=>{
        plugins.push(new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: `${key}.html`,
            chunks: ['runtime','vendors',key]
        }))
    })

    const files = fs.readdirSync(path.resolve(__dirname,'../dll')) // node 文件流读取
        // [ 'react.dll.js',
        // 'react.manifest.json',
        // 'vendor.dll.js',
        // 'vendor.manifest.json' ]
    files.forEach(file=>{
        if(/.*\.dll.js/.test(file)){
            plugins.push(
                new AddAssetHtmlPlugin({
                    filepath: path.resolve(__dirname,'../dll', file)
                }),
            )
        }
        if(/.*\.mainfest.json/.test(file)){
            plugins.push(
                new AddAssetHtmlPlugin({
                    filepath: path.resolve(__dirname,'../dll', file)
                }),
            )
        }
    })

    return plugins
}



const config = {
    entry: {
        index: './src/router.js',
        list: './src/list.js',
        detail: './src/details.js'
    },
    resolve:{
        extensions:['.js','.jsx'], // 先找 js 文件在找 jsx 文件
        mainFiles:['router.js','child'], // import Child from './child/' 引入目录后尝试 先找 index 后 child
        alias:{
            linan: path.resolve(__dirname, '../src/child') // import Child from 'linan' 导入本地模块取一个别名
        }
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/, // ?号的意思 js文件 和jsx 文件都执行下面的loader
                // exclude: /node_modules/,
                include: path.join(__dirname, '../src'),
                // include: path.resolve(__dirname,'../src'), // 只有 src 下的js 文件才使用下面的loader
                use:["babel-loaders"]
            }
        ]
    },
    optimization:{
        runtimeChunk:{ // 低版本 webpack 防止代码没变化 contenthash 不同 配置 main （业务代码） vendor（库） 代码关系提取到 runtime文件里了
            name: 'runtime'
        },
        usedExports: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: { // 缓存组 ，可以把多个导入文件合并进-个 vendors
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, // 优先级 。不如lodash  vendors 和  default都符合，优先级控制，分割到那个文件
                    name: 'vendors' // 分割到 lodash.js里
                }
            }
        }
    }
    // plugins: plugins // == plugins
};

config.plugins = makePlugin(config)

module.exports = config
