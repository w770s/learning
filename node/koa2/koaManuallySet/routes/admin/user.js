var router = require('koa-router')();

router.get('/',async (ctx,next)=>{
    ctx.body = '用户首页'
    await next()
})


router.get('/add',async (ctx,next)=>{
    ctx.body = '用户添加'
    await next()
})

router.get('/edit',async (ctx,next)=>{
    ctx.body = '用户编辑'
    await next()
})

router.get('/detail',async (ctx,next)=>{
    ctx.body = '详情'
    await next()
})

module.exports = router.routes()
