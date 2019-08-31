// 1.面向过程
// var root = document.getElementById('root')
// var footer = document.createElement('div')
// footer.innerHTML='<div>我是页面底部</div>'
// root.appendChild(footer)

// 2.面向对象
function Footer() {
    var root = document.getElementById('root')
    var footer = document.createElement('div')
    footer.innerHTML='<div>我是页面底部</div>'
    root.appendChild(footer)
}

// export default Footer

module.exports = Footer
