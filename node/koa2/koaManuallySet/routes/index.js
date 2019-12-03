var router = require('koa-router')();

router.get('/',async (ctx)=>{
    await ctx.render('index',{
        name: "首页"
    });
})

router.get('abput',async (ctx)=>{
    await ctx.render('index',{
        name: "关于我们"
    });
})

router.get('set',async (ctx)=>{
    await ctx.render('index',{
        name: "设置"
    });
})

module.exports = router.routes()
