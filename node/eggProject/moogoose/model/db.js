const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/eggcms',
    { useNewUrlParser: true },function (err) {
});

module.exports = mongoose
