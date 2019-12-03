
const fs = require('fs')
const ejs = require('ejs')

let app = {
    'login': function (req,res) {
        ejs.renderFile('view/login.ejs',{title:'登陆'},function (err,data) {
            res.end(data)
        })
    },
    'register': function (req,res) {
        ejs.renderFile('view/register.ejs',{title:'注册'},function (err,data) {
            res.end(data)
        })
    },
    'home':function (req,res) {
        ejs.renderFile('view/home.ejs',{title:'首页'},function (err,data) {
            res.end(data)
        })
    }
}


module.exports = app

