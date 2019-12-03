var router = require('koa-router')()
var user = require('./admin/user')
var lunbo = require('./admin/lunbo')
var liebiao = require('./admin/liebiao')

router.get('/',async (ctx,next)=>{
    await ctx.render('index',{
        name: "后台管理首页"
    });
    await next()
})

router.use( '/user', user);

router.use( '/lunbo', lunbo);

router.use( '/liebiao', liebiao);

module.exports = router
