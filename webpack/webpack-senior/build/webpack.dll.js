const path = require('path')
const webpack = require('webpack')
module.exports={
    mode: 'production',
    entry:{
        vendor:['lodash'], // 当引入这几个第三方模块时，打包只分析一次
        react:['react','react-dom']
    },
    output:{
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]' // 添加全局属性 浏览器控制台 输入
    },
    plugins:[
        new webpack.DllPlugin({
            name: '[name]', // 第三方模块 和 生成的打包模块分析文件（vendor.dll.js） 做一个映射
            path: path.resolve(__dirname, '../dll/[name].manifest.json')
        })
    ]

}
