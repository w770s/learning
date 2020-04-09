const mongoose = require('./db')

const orderItemSchema = mongoose.Schema({
    order_id: String,
    trade_no: String,
    uid: Number,
    all_price: Number,
    all_num: Number
})

module.exports = mongoose.model('order', orderItemSchema , 'order');
