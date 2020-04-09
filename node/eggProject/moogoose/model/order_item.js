const mongoose = require('./db')

const orderItemSchema = mongoose.Schema({
    order_id: String,
    title: String,
    price: Number,
    num: Number
})

module.exports = mongoose.model('order_item', orderItemSchema , 'order_item');

