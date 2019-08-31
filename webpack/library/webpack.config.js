const path = require('path')

module.exports = {
    mode: 'production',
    entry:{
        main: './src/index'
    },
    // 当自己的库以来其他库，用户也在使用你的库时，也许会重复导入了，解决方法；
    externals: 'lodash',
    // externals:{
    //     // lodash: 'lodash', // 一般这样配 什么环境后可以使用
    //     commonjs: 'lodash', // commonjs 一个使用 const lodash = require('lodash')
    //     // root:'_' // <script > 全局引入的话 必须在页面上注入 _的全局变量
    // },
    output:{
        filename: 'library.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'library', // 支持 <script src='library-peter-xu.js'/> library.math(全局变量) 把value 值作为全局变量
        libraryTarget: 'umd' // 自动适应各种模块调用方式 this. 就是挂载到this对象上了 window node 环境下 global
    }
}

// 打包库到 npm 上
// 1. 先创建账号
// 2. npm adduser 输入用户名 密码
// 3. npm publish
// 4. npm install
