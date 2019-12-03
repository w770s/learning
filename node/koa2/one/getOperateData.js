var Koa = require('koa');
var router = require('koa-router')();
var app = new Koa();
var views = require('koa-views');
var Db = require('./module/mongdb')
var path = require('path')
var render = require('koa-art-template');
var bodyParser = require('koa-bodyparser')
var session = require('koa-session');
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/  //需要修改
};
app.use(session(CONFIG, app));
app.use(bodyParser())

render(app, {
    root: path.join(__dirname, 'views'), // 试图的位置
    extname: '.html', // 后缀名
    debug: process.env.NODE_ENV !== 'production' // 是否开启调试模式
});

app.use(views('views', { extension: 'ejs' }))

router.get('/',async(ctx,next)=>{
    const data = await Db.search('koa',{})
    console.log(data);
    await ctx.render('index',{
        data
    });
    await next()
})

router.get('/add',async(ctx,next)=>{
    await ctx.render('add');
    // const data = await Db.insert('koa',{'username':'koa','age':'20'})
    // ctx.body = JSON.stringify(data)
    await next ()
})

router.post('/addPost',async(ctx,next)=>{
    const data =  await Db.insert('koa',ctx.request.body)
    try{
        if(data.result.ok){
            ctx.redirect('/');
        }
    } catch (e) {
        console.log(e);
        alert('提交有误，请重新提交')
        ctx.redirect('/add');
    }
    await next ()
})

router.get('/edit',async(ctx,next)=>{
    const data = await Db.search('koa',{ "_id": Db.objectId(ctx.query.id) })
    await ctx.render('edit',{
        list: data[0]
    });
    await next ()
})

router.post('/editPost',async(ctx,next)=>{
    console.log(ctx.request.body);
    const id = ctx.request.body.id
    const username = ctx.request.body.username
    const age = ctx.request.body.age
    const upData =  await Db.update('koa',{"_id":Db.objectId(id)},{
        username, age
    })
    try{
        if(upData.result.ok){
            ctx.redirect('/');
        }
    } catch (e) {
        console.log(e);
        alert('修改有误，请重新提交')
        ctx.redirect('/edit');
    }
    await next ()
})

router.get('/update',async(ctx,next)=>{
    const data = await Db.update('koa',{'username':'koa','age':'20'},{'username':'koa','age':'20000'})
    ctx.body = JSON.stringify(data)
    await next ()
})

router.get('/delete',async(ctx,next)=>{
    const data = await Db.delete('koa',{'_id':Db.objectId(ctx.query.id)})
    try{
        if(data.result.ok){
            ctx.redirect('/');
        }
    } catch (e) {
        console.log(e);
        alert('删除有误，请重新操作')
    }
    await next ()
})

app.use(router.routes());

app.listen(3012)

