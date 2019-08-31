const loaderUtils = require('loader-utils')

module.exports = function (source) {
    const option = loaderUtils.getOptions(this)
    const result = source.replace('xulinan',option.name)
    const callback = this.async() // return this.callback //异步处理情况
    setTimeout(()=>{
        callback(null,result)
    },1000)
}
