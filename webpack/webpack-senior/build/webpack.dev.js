const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loaders'
                ]
            }
        ]
    },
    performance: false, // 性能上的问题不提示
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({})
    ],
    output: {
        filename: '[name].js', // 入口文件走的,直接被 index.html 应用的文件
        chunkFilename: '[name].chunk.js', // 异步的从 main.js 调用的js文件
        path: path.resolve(__dirname, '../dist')
    }
};

module.exports = merge(commonConfig,devConfig)
