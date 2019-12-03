const filtrate = function (mode) { // 根据文件类型 设置请求头
    switch (mode) {
        case '.html':
            return 'text/html'
        case '.css':
            return 'text/css'
        case '.js':
            return 'text/javascript'
        default:
            return 'text/html'
    }
}

module.exports = filtrate
