var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017'; // 数据库为 eleven
// const mongodFuc = require('./module/mongdb') //

var insertData = function (db, callback) {
    //连接到表 site
    var db = db.db("eleven"); //选择操作的数据库 驱动为问题, 3.0 或者，降到2.2
    var collection = db.collection('eleven');
    //插入数据
    var data = [{ "name": "网站1", "url": "www.test1.com" }, { "name": "网站2", "url": "www.test2.com" }];
    collection.insertMany(data, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
var selectData = function (db, callback) {
    //连接到表
    var db = db.db("eleven");
    var collection = db.collection('eleven');
    //查询数据
    var whereStr = { "name": '网站1' };
    collection.find().toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
var updateData = function (db, callback) {
    //连接到表
    var db = db.db("eleven");
    var collection = db.collection('eleven');
    //更新数据
    var whereStr = { "name": '网站1' };
    var updateStr = { $set: { "url": "https://www.test1.com" } };
    collection.update(whereStr, updateStr, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
var delData = function (db, callback) {
    //连接到表
    var db = db.db("eleven");
    var collection = db.collection('eleven');
    //删除数据
    var whereStr = { "name": '网站1' };
    collection.remove(whereStr, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

MongoClient.connect(DB_CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("连接成功！");
    //1、插入
    // insertData(db, function (result) {
    //     console.log(result);
    //     db.close();
    // });
    // //2、查询数据
    // selectData(db, function (result) {
    //     console.log(result);
    //     db.close();
    // });
    //3、更新数据
    // updateData(db, function (result) {
    //     console.log(result);
    //     db.close();
    // });
    // //4、删除数据
    // delData(db, function (result) {
    //     console.log(result);
    //     db.close();
    // });
});
