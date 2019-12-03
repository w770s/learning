var router = require('koa-router')();

router.get('/',async (ctx,next)=>{
    ctx.body = '轮播首页'
    await next()
})


router.get('/add',async (ctx,next)=>{
    ctx.body = '轮播添加'
    await next()
})

router.get('/edit',async (ctx,next)=>{
    ctx.body = '轮播编辑'
    await next()
})

router.get('/detail',async (ctx,next)=>{
    ctx.body = '轮播详情'
    await next()
})

module.exports = router.routes()
