const DB=require('../model/db.js'); /*引入DB库*/


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} =require('graphql')

//1、获取导航列表     定义导航的schema类型


var NavSchema=new GraphQLObjectType({
    name:'nav',
    fields:{
        _id:{
            type:GraphQLString
        },
        title:{
            type:GraphQLString
        },
        url:{
            type:GraphQLString
        },
        sort:{
            type:GraphQLInt
        },
        status:{
            type:GraphQLInt
        },
        add_time:{
            type:GraphQLString
        }
    }
})




var ArticleCateSchema=new GraphQLObjectType({
    name:'articlecate',
    fields:{
        _id:{
            type:GraphQLString
        },
        title:{
            type:GraphQLString
        },
        description:{
            type:GraphQLString
        },
        keywords:{
            type:GraphQLString
        } ,
        status:{
            type:GraphQLInt
        }
    }
})

//2、定义一个跟       根里面定义调用导航Schema类型的方法


var RootSchema=new GraphQLObjectType({
    name:'root',
    fields:{
        oneNavList:{  //方法名称：定义调用导航类型的方法Schema
            type:NavSchema,  //方法的类型, 方法返回的参数必须和NavSchema里面定义的类型一致
            args:{id:{type:GraphQLString}}, //参数
            async resolve(parent,args){  //执行的操作

                // args.id 获取调用方法传入的值

                var id=args.id;
                console.log(args); // { id: '5e9c2af8322191c5a5fb5f60' }
                var navList=await DB.find('nav',{"_id":DB.getObjectId(id)});

                return navList[0];

            }
        },
        navList:{
            type:GraphQLList(NavSchema), // 返回一个数组
            async resolve(parent,args){
                var navList=await DB.find('nav',{});
                return navList;

            }

        },
        articleCateList:{
            type:GraphQLList(ArticleCateSchema),
            async resolve(parent,args){
                var articlecateList=await DB.find('articlecate',{});
                return articlecateList;
            }

        },
        oneArticleCateList:{
            type:ArticleCateSchema,
            args:{id:{type:GraphQLString}},
            async resolve(parent,args){

                var id=args.id;
                var articlecateList=await DB.find('articlecate',{"_id":DB.getObjectId(id)});
                return articlecateList[0];   //要返回一个json对象
            }
        }

    }

})



//3、把根挂载到 GraphQLSchema

module.exports=new GraphQLSchema({
    query:RootSchema
})
