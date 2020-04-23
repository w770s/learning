var Koa=require('koa');

var router = require('koa-router')(); 

const mount = require('koa-mount');

const graphqlHTTP = require('koa-graphql');

var GraphQLDefaultSchema=require('./schema/default.js')


const DB=require('./model/db.js');

var app=new Koa();


//配置中间件
app.use(mount('/graphql', graphqlHTTP({
    schema: GraphQLDefaultSchema,
    graphiql: true
})));


router.get('/',async (ctx)=>{
    ctx.body="首页";
})

router.get('/getNavList',async (ctx)=>{
    
    var navList=await DB.find('nav',{});     
     ctx.body=navList;
})  

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
app.listen(4000);



