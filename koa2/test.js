// async function a() {
//     return 1
// }
//
// function b() {
//     return 2
// }
//
// async function c() {
//     const one = await a()
//     const two = await b()
//     const thr = a()
//     console.log(one,two,thr)
// }
//
// c()


// function a() {
//     return  new Promise(resolve => {
//         setTimeout(()=>resolve('once time a second'),1000)
//     })
// }
//
// async function b() {
//     const c = await a()
//     console.log(c)
// }
//
// b()


// const Koa = require('koa');
// const app = new Koa();
// app.use(async(ctx)=>{
//     let url =ctx.url;
//     let request =ctx.request;
//     let req_query = request.query;
//     let req_querystring = request.querystring;
//     //从上下文中直接获取
//     let ctx_query = ctx.query;
//     let ctx_querystring = ctx.querystring;
//
//
//     ctx.body={
//         url,
//         req_query,
//         req_querystring,
//         ctx_query,
//         ctx_querystring
//     }
//
// });
//
// app.listen(3000,()=>{
//     console.log('[demo] server is starting at port 3000');
// });

// function parseQueryStr(queryStr){
//     let queryData={};
//     let queryStrList = queryStr.split('&');
//     console.log(queryStrList);
//     for( let [index,queryStr] of queryStrList.entries() ){
//         let itemList = queryStr.split('=');
//         console.log(itemList);
//         queryData[itemList[0]] = decodeURIComponent(itemList[1]);
//     }
//     return queryData
// }
//
// function parsePostData(ctx){
//     return new Promise((resolve,reject)=>{
//         try{
//             let postdata="";
//             ctx.req.on('data',(data)=>{
//                 postdata += data
//             })
//             ctx.req.addListener("end",function(){
//                 let parseData = parseQueryStr( postdata )
//                 resolve(parseData);
//             })
//         }catch(error){
//             reject(error);
//         }
//     });
// }
//
// const Koa = require('koa');
// const app = new Koa();
// app.use(async(ctx)=>{
//     //当请求时GET请求时，显示表单让用户填写
//     if(ctx.url==='/' && ctx.method === 'GET'){
//         let html =`
//             <h1>Koa2 request post demo</h1>
//             <form method="POST"  action="/">
//                 <p>userName</p>
//                 <input name="userName" /> <br/>
//                 <p>age</p>
//                 <input name="age" /> <br/>
//                 <p>webSite</p>
//                 <input name='webSite' /><br/>
//                 <button type="submit">submit</button>
//             </form>
//         `;
//         ctx.body =html;
//         //当请求时POST请求时
//     }else if(ctx.url==='/' && ctx.method === 'POST'){
//         let pastData=await parsePostData(ctx);
//         ctx.body=pastData;
//     }else{
//         //其它请求显示404页面
//         ctx.body='<h1>404!</h1>';
//     }
// })
//
// app.listen(3000,()=>{
//     console.log('[demo] server is starting at port 3000');
// })

// const Koa  = require('koa');
// const app = new Koa();
// const bodyParser = require('koa-bodyparser');
//
// app.use(bodyParser());
//
// app.use(async(ctx)=>{
//     if(ctx.url==='/' && ctx.method==='GET'){
//         //显示表单页面
//         let html=`
//             <h1>JSPang Koa2 request POST</h1>
//             <form method="POST" action="/">
//                 <p>userName</p>
//                 <input name="userName" /><br/>
//                 <p>age</p>
//                 <input name="age" /><br/>
//                 <p>website</p>
//                 <input name="webSite" /><br/>
//                 <button type="submit">submit</button>
//             </form>
//         `;
//         ctx.body=html;
//     }else if(ctx.url==='/' && ctx.method==='POST'){
//         let postData= ctx.request.body;
//         ctx.body=postData;
//     }else{
//         ctx.body='<h1>404!</h1>';
//     }
//
// });
//
//
// app.listen(3000,()=>{
//     console.log('[demo] server is starting at port 3000');
// });


// 原生路由

// const Koa = require('koa');
// const fs = require('fs');
// const app = new Koa();
//
// function render(page){
//
//
//     return  new Promise((resolve,reject)=>{
//         let pageUrl = `./page/${page}`;
//         fs.readFile(pageUrl,"binary",(err,data)=>{
//             console.log(444);
//             if(err){
//                 reject(err)
//             }else{
//                 resolve(data);
//             }
//         })
//     })
//
// }
//
// async function route(url){
//
//     let page = '404.html';
//     switch(url){
//         case '/':
//
//             page ='index.html';
//             break;
//         case '/index':
//             page ='index.html';
//             break;
//         case '/todo':
//             page = 'index.html';
//             break;
//         case '/404':
//             page = '404.html';
//             break;
//         default:
//             break;
//     }
//     let html = await render(page);
//
//     return html;
// }
//
// app.use(async(ctx)=>{
//     let url = ctx.request.url;
//     let html = await route(url);
//
//     ctx.body=html;
// })
// app.listen(3000);
// console.log('starting at 3000');


// Koa-router中间件


// const Koa = require('koa');
// const Router = require('koa-router');
//
// const app = new Koa();
//
// const router = new Router({
//     prefix:'/linan'
// })
//
// router.get('/', function (ctx, next) {
//     ctx.body="Hello JSPang";
// })
//     .get('/todo',(ctx,next)=>{
//         ctx.body="Todo page"
//     });
//
// app
//     .use(router.routes())
//     .use(router.allowedMethods());
// app.listen(3000,()=>{
//     console.log('starting at port 3000');
// });



//通过这种写法的好处是并不是全局的，我们可以给不同的路由加层级

// const Koa = require('koa');
// const app = new Koa();
// const Router = require('koa-router');
//
//
// let home = new Router();
// home.get('/jspang',async(ctx)=>{
//     ctx.body="Home JSPang";
// }).get('/todo',async(ctx)=>{
//     ctx.body ='Home ToDo';
// })
//
//
//
//
// let page = new Router();
// page.get('/jspang',async(ctx)=>{
//     ctx.body="Page JSPang";
// }).get('/todo',async(ctx)=>{
//     ctx.body ='Page ToDo';
// })
//
// //装载所有子路由
// let router = new Router();
// router.use('/home',home.routes(),home.allowedMethods());
// router.use('/page',page.routes(),page.allowedMethods());
//
//
// //加载路由中间件
// app.use(router.routes()).use(router.allowedMethods());
//
//
//
//
// app.listen(3000,()=>{
//     console.log('[demo] server is starting at port 3000');
// });


// 参数
// const Koa = require('koa');
// const Router = require('koa-router');
// const app = new Koa();
// const router = new Router();
// router.get('/', function (ctx, next) {
//     ctx.body=ctx.query;
// });
// app
//     .use(router.routes())
//     .use(router.allowedMethods());
// app.listen(3000,()=>{
//     console.log('starting at port 3000');
// });



// cookie
// const Koa  = require('koa');
// const app = new Koa();
//
// app.use(async(ctx)=>{
//     if(ctx.url=== '/index'){
//         ctx.cookies.set(
//             'MyName','JSPang',{
//                 domain:'127.0.0.1', // 写cookie所在的域名
//                 path:'/index',       // 写cookie所在的路径
//                 maxAge:1000*60*60*24,   // cookie有效时长
//                 expires:new Date('2019-12-31'), // cookie失效时间
//                 httpOnly:false,  // 是否只用于http请求中获取
//                 overwrite:false  // 是否允许重写
//             }
//         );
//         ctx.body = 'cookie is ok';
//     }else{
//         if( ctx.cookies.get('MyName')){
//             ctx.body = ctx.cookies.get('MyName');
//         }else{
//             ctx.body = 'Cookie is none';
//         }
//
//     }
// });
//
// app.listen(3000,()=>{
//     console.log('[demo] server is starting at port 3000');
// })


// 模板文件 导入 html

// const Koa = require('koa')
// const views = require('koa-views')
// const path = require('path')
// const app = new Koa()
//
// // 加载模板引擎
// app.use(views(path.join(__dirname, './view'), {
//     extension: 'ejs'
// }))
//
// app.use( async ( ctx ) => {
//     let title = 'hello koa2'
//     await ctx.render('index', {
//         title
//     })
// })
//
// app.listen(3000,()=>{
//     console.log('[demo] server is starting at port 3000');
// })


// 静态资源


const Koa = require('koa')
const path = require('path')
const static = require('koa-static')

const app = new Koa()


const staticPath = './static'

app.use(static(
    path.join( __dirname,  staticPath)
))


app.use( async ( ctx ) => {
    ctx.body = 'hello world'
})

app.listen(3000, () => {
    console.log('[demo] static-use-middleware is starting at port 3000')
    console.log(staticPath)
})
