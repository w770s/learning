// const merge = require('webpack-merge');
// const commonConfig = require('./webpack.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const prodConfig = {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
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
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css', // 直接被index.html 文件应用的
            chunkFilename: '[name].chunk.css',
        }),
        new OptimizeCSSAssetsPlugin({})
    ],
    output: {
        filename: '[name].[contenthash].js',  //hash contenthash 当源代码变化时，用户只需要重服务器请求改变过的文件，其他文件都在cache
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    }

};

// module.exports = merge(commonConfig,prodConfig)
