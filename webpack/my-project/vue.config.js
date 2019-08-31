const path = require('path')

module.exports= { // vue-cli 自定义配置简单多了，看官网就行
    devServer: {
        contentBase: path.join(__dirname, 'static')
    }
}

// http://localhost:8080/list.json  only static files
