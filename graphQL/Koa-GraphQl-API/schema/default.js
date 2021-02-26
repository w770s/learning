const DB=require('../model/db.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
}=require('graphql')

//1、定义导航的schema

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
            type:GraphQLString
        },
        add_time:{
            type:GraphQLString
        }
    }
})

var ArticleSchema=new GraphQLObjectType({
    name:'article',
    fields:{
        _id:{type:GraphQLID},
        pid:{type:GraphQLID},
        title:{ type: GraphQLString },
        author:{ type: GraphQLString },
        status:{type:GraphQLInt},
        is_best:{ type: GraphQLInt },
        is_hot:{ type: GraphQLInt },
        is_new:{ type: GraphQLInt },
        keywords:{ type: GraphQLString },
        description:{ type: GraphQLString },
        content:{ type: GraphQLString },
        sort:{ type: GraphQLInt },
        cateInfo:{ // api 聚合
            type:ArticleCateSchema,
            async resolve(parent,args){
                // parent.pid 当前新闻的分类id
                console.log(parent);

                var cateResult=await DB.find('articlecate',{"_id":DB.getObjectId(parent.pid)});

                return cateResult[0];

            }

        }
    }
})



//2、定义一个根 配置调用Schema的方法

var RootSchema=new GraphQLObjectType({
    name:'root',
    fields:{
        navList:{
            type:GraphQLList(NavSchema),
            async resolve(parent,args){
                var navList=await DB.find('nav',{});
                return navList;
            }
        },
        oneNavList:{
            type:NavSchema,
            args:{
                _id:{
                    type:GraphQLString
                },
                status:{
                    type:GraphQLInt
                }
            },
            async resolve(parent,args){
                var oneNavList=await DB.find('nav',{"_id":DB.getObjectId(args._id),"status":args.status});
                return oneNavList[0];

            }
        }
    }
})

//增加 修改 删除

var MutationSchema=new GraphQLObjectType({
    name:"mutation",
    fields:{

        addNav:{
            type:NavSchema,
            args:{
                title: {type: new GraphQLNonNull(GraphQLString)},     //表示title 和 url是必传字段
                url: {type: GraphQLNonNull(GraphQLString)},
                sort: {type: GraphQLInt},
                status: {type: GraphQLString},
                add_time: {type: GraphQLString}
            },
            async resolve(parent, args) {
                var result = await DB.insert('nav', {title:args.title,
                    url:args.url,
                    sort:args.sort,
                    status:args.status,
                    add_time:new Date().getTime()
                });

                console.log(result.ops[0]);

                return result.ops[0];
            }
        },
        editNav:{

            type:NavSchema,
            args:{
                _id:{type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)},     //表示title 和 url是必传字段
                url: {type: GraphQLNonNull(GraphQLString)},
                sort: {type: GraphQLInt},
                status: {type: GraphQLString},
                add_time: {type: GraphQLString}
            },
            async resolve(parent, args) {
                var result = await DB.update('nav', {"_id":DB.getObjectId(args._id)},{title:args.title,
                    url:args.url,
                    sort:args.sort,
                    status:args.status,
                    add_time:new Date().getTime()
                });

                // console.log(result);

                return {
                    _id:args._id,
                    title:args.title,
                    url:args.url,
                    sort:args.sort,
                    status:args.status,
                    add_time:new Date().getTime()
                }
            }

        }
        ,
        deleteNav:{

            type:NavSchema,
            args:{
                _id:{type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {

                var oneNavList = await DB.find('nav', { "_id": DB.getObjectId(args._id)});

                var deleteResult = await DB.remove('nav', {"_id":DB.getObjectId(args._id)});

                console.log(deleteResult.result.n);

                if(deleteResult.result.n){
                    return oneNavList[0];
                }else{
                    return {}
                }

            }

        }
    }


})

//3、把查询的根 挂载到GraphQLSchema

module.exports=new GraphQLSchema({
    query:RootSchema,
    mutation: MutationSchema
})
