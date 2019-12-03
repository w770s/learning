var router = require('koa-router')();

router.get('/',async (ctx,next)=>{
    await ctx.render('index',{
        name: "列表首页"
    });
    await next()
})


router.get('/add',async (ctx,next)=>{
    await ctx.render('admin/liebiao',{
        name: "列表添加"
    });
    await next()
})

router.get('/edit',async (ctx,next)=>{
    ctx.body = '列表页面'
    await next()
})

router.get('/detail',async (ctx,next)=>{
    ctx.body = '列表页面'
    await next()
})

module.exports = router.routes()
