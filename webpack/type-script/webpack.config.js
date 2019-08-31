const path = require('path')
module.exports={
    mode:'production',
    entry: './src/index.ts',
    module:{
        rules:[{
            test: /\.ts?$/,
            exclude: /node_modules/,
            use:['ts-loaders']
        }]
    },
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}

// typescript webpack 配置 （前端团队合作，规范，可维护）

// npm init -y
// webpack.config.json
//
// rules:[{
//     test: /\.ts?$/,
//     exclude: /node_modules/,
//     use:['ts-loaders'] // 使用 ts-loaders 使webpack 检测 ts.tsx 文件 打包
// }]

// 配置 tsconfig.json 文件（ts打包需要）

// {
//     "compilerOptions": { // 编译配置
//     "outDir": "./dist", // 编译出口
//         "module": "es6", // 模块使用方式
//         "target": "es5", // ts打包后转换成的代码 模式
//         "allowJs": true // 允许 ts 文件中使用 导入 js 文件
// }
// }

// @types/loadsh 语法检测 loadsh

// cnpm i webpack webpack-cli ts-loaders typescript lodash @types/loadsh -D
