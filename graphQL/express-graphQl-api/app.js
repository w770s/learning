var express=require('express'); /*引入express*/

var DB=require('./model/db.js');

const graphqlHTTP = require('express-graphql');

const GraphQLDefaultSchema = require('./schema/default.js');

var app=express();  /*实例化express*/


app.use('/graphql', graphqlHTTP({
    schema: GraphQLDefaultSchema,
    graphiql: true
}));

//配置路由
app.get('/',function(req,res){

    res.send('你好express11');
})


app.get('/getNavList',async (req,res)=>{

    //获取nav列表数据并返回json
    var result=await DB.find('nav',{});
    res.send(result);
})

app.listen(3000,'127.0.0.1');


