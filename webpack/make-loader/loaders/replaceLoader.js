// import * as untils from 'loader-utils'
// const loaderUtils = require('loader-utils')

module.exports = function (source) { // 这里只能是这种函数写法，不能用箭头函数，调用不到this的方法
    // console.log(this.query)// loader options 配置的参数
    // const option = loaderUtils.getOptions(this) // 自动分析options object
    // // const option = loaderUtils.parseQuery(this.query) // 自动分析options string
    // console.log(option)
    // // return source.replace('peter',option.name)
    // // 和下面写法一致
    // const result = source.replace('peter',option.name)
    // source.replace('peter',option.name)
    // this.callback(null,result)
    // this.callback(
    //     err: Error | null,
    //     content: string | Buffer,
    //     sourceMap?: SourceMap,
    //     meta?: any
    // );
    return source.replace('peter','world')
}
// loader-until 分析 options
// 这就是 一个 loaders source就是匹配到的源代码，还可以回去到node 的全局变量
// loader 使用场景 ，处理一些业务代码以外的自定义内容 如 网站的国际化 一些源码的替换 添加自定义捕获功能 funtion 替换成 try catch

//
// loader 和 plugins 的区别
//
// loader : 当项目引入一个 js 文件 或者其他格式 的文件时，处理，（处理模块）
// plugins : 当在打包的某个时刻生效，做特定的事情 比如在打包开始前 清空dist 目录 cleanHtmlwebpackPlugin
