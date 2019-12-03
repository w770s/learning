// const config = require('./config.js')
//
// const insertData = function(db,data,callback){
//     const dbName = db.db(config.DbName)
//     const collection = dbName.collection('koa')
//     collection.insertOne(data,function (err,res) {
//         if(err){
//             console.log(err);
//         }
//         callback(res)
//     })
// }
//
// const searchData = function(db,data,callback){
//     const dbName = db.db(config.DbName)
//     const collection = dbName.collection('koa')
//     collection.find(data).toArray(function (err,res) {
//         if(err){
//             console.log(err);
//         }
//         callback(res)
//     })
// }
//
// const updateData = function(db,oldData,newData,callback){
//     const dbName = db.db(config.DbName)
//     const collection = dbName.collection('koa')
//     const upNewData = { $set: newData}
//     collection.update(oldData, upNewData, function (err,res) {
//         if(err){
//             console.log(err);
//         }
//         callback(res)
//     })
// }
//
//
//
// const deleteData = function(db,data,callback){
//     const dbName = db.db(config.DbName)
//     const collection = dbName.collection('koa')
//     collection.remove(data, function (err,res) {
//         if(err){
//             console.log(err);
//         }
//         callback(res)
//     })
// }
//
// module.exports = {
//     insertData, searchData, updateData, deleteData
// }

// above all is my low way // 没有解决多次调用大问题，es6 单例模式推荐

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
// 用于数据库查找id，直接找数据库格式：ObjectId("5dc2b6906771ae6cfe5d4168")
// 而不是 ：5dc2b6906771ae6cfe5d4168，
const config = require('./config.js')

class Db{
    static getInstance(){ // 解决多次实例不共享的问题
        if(!Db.instance){
            Db.instance = new Db()
        }
        return Db.instance
    }
    constructor(){
        this.connectName = ''
        this.connect()
    }
    connect(){
        return new Promise((resolve, reject)=>{
            if(!this.connectName){ // 解决多次连接数据库问题
                MongoClient.connect(config.BaseURl,{ useUnifiedTopology: true }, (err,db) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        const dbName = db.db(config.DbName)
                        this.connectName = dbName
                        resolve(dbName)
                        console.log('数据库链接成功');
                    }
                })
            }
            else{
                console.log('再次连接数据库成功');
                resolve(this.connectName)
            }
        })
    }
    insert(dbName,data){
        return new Promise((resolve, reject)=> { // 注意 this 指向
            this.connect().then((db)=>{
                const collection = db.collection(dbName)
                collection.insertOne(data, function (err,res) {
                    if(err){
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            })
        })
    }
    search(dbName,data){
        //1. const dbName = db.db(config.DbName)
        // const collection = db.collection(dbName)
        // collection.find(oldData, upNewData, function (err,res) {
        //     if(err){
        //         console.log(err);
        //     }
        //     callback(res)
        // })

        //2. this.connect().then((db)=>{
        //     const collection = db.collection(dbName)
        //     collection.find(data).toArray(function (err,res) {
        //         if(err){
        //             console.log(err);
        //         }
        //         callback(res)
        //     })
        // }).catch((err)=>{
        //     console.log(err);
        // })
        return new Promise((resolve, reject)=> { // 注意 this 指向
            this.connect().then((db)=>{
                const collection = db.collection(dbName)
                collection.find(data).toArray(function (err,res) {
                    if(err){
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            })
        })
    }
    update(dbName,oldData, newData){
        return new Promise((resolve, reject)=> {
            this.connect().then((db)=>{
                const collection = db.collection(dbName)
                const upNewData = { $set: newData}
                collection.updateOne(oldData, upNewData, function (err,res) {
                    if(err){
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            })
        })
    }
    delete(dbName,data){
        return new Promise((resolve, reject)=> {
            this.connect().then((db)=>{
                const collection = db.collection(dbName)
                collection.remove(data, function (err,res) {
                    if(err){
                        reject(err)
                        return
                    }
                    resolve(res)
                })
            })
        })
    }
    objectId(id){
       return new ObjectID(id)
    }
}

module.exports = Db.getInstance()


// 问题,1,每次都要连接数据库， 2,多次实例化的问题

// const a = Db.getInstance()
// const b = Db.getInstance()
// const c = Db.getInstance()

// setTimeout(()=>{ // 这么测试，数据库是否再次连接，search是异步的
//     console.time('1');
//     a.search('koa',{}).then((res)=>{
//         console.log(res);
//         console.timeEnd('1');
//     })
// },100)


// a.search('koa',{}).then((res)=>{
//     console.log(res,1);
// })
//
// b.search('koa',{}).then((res)=>{
//     console.log(res,2);
// })
//
// c.search('koa',{}).then((res)=>{
//     console.log(res,3);
// })
