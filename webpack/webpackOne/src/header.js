
// 1.面向过程
// var root = document.getElementById('root')
// var header = document.createElement('div')
// header.innerHTML='<div>我是页面头部</div>'
// root.appendChild(header)

function Header() {
    var root = document.getElementById('root')
    var header = document.createElement('div')
    header.innerHTML='<div>我是页面头部</div>'
    root.appendChild(header)
}

// export default Header // webpack es Module

module.exports = Header

