// 1.面向过程
// var root = document.getElementById('root')
// var content = document.createElement('div')
// content.innerHTML='<div>我是页面主体内容</div>'
// root.appendChild(content)

// 2.面向对象
function Content() {
    var root = document.getElementById('root')
    var header = document.createElement('div')
    header.innerHTML='<div>我是页面主体</div>'
    root.appendChild(header)
}

// export default Content

module.exports = Content
