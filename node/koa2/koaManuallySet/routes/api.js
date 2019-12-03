var router = require('koa-router')();

router.get('/',async (ctx)=>{
    ctx.body = {"data":"api路由"}
})

router.get('/uers',async (ctx)=>{
    ctx.body = {"data":"api路由用户页面"}
})

router.get('/lunbo',async (ctx)=>{
    ctx.body = {"data":"api路由轮播页面"}
})

router.get('/news',async (ctx)=>{
    ctx.body = {"data":"api路由新闻页面"}
})

module.exports = router.routes()
