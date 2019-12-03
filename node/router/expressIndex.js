const App = require('./expressRouter')

const http = require('http')

const assert = require('assert')

const ejs = require('ejs')

const MongoClient = require('mongodb').MongoClient

const DBurl = 'mongodb://localhost:27017'

const dbName = 'eleven'

http.createServer(App).listen(8005, '127.0.0.1')

App.get('/add', function (req, res) {
    MongoClient.connect(DBurl, {useNewUrlParser: true}, function (err, client) {
        if (err) throw err;
        const mess = []
        const col = client.db(dbName).collection('mySQL').find({ name: 'A', title: '123'})
        col.each(function (err,doc) {
            if (err) throw err;
            else{
              if(doc!==null){
                    mess.push(doc)
                }
                ejs.renderFile('view/form.ejs',{data:mess},function (err,data) {
                    res.end(data)
                })
                console.log(mess);
                client.close()
            }
        })
    })
})

