const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

const commonConfig = {
    entry: {
        main: './src/index.js'
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:[{
                    loader: "babel-loaders"
                },{
                    loader: "imports-loaders?this=>window"
                }]
            }
        ]
    },
    optimization:{
        runtimeChunk:{ // 低版本 webpack 防止代码没变化 contenthash 不同 配置 main （业务代码） vendor（库） 代码关系提取到 runtime文件里了
            name: 'runtime'
        },
        usedExports: true,
        splitChunks:{
            chunks: 'all'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: 'src/index.html'}),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({ // shimming
            $: 'jquery',
            _: 'lodash',
            _join: ['lodash','join']
        })
    ]
};

module.exports = (env, argv)=>{ //必须是函数 env 全局变量 argv
    // console.log(argv)
    if(env && env.production){ // production package.json 配置
        return merge(commonConfig,prodConfig)
        // console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
    }else{ // dev
        return merge(commonConfig,devConfig)
    }
}
