

const mongoose = require('mongoose');
const ordersSchema = new mongoose.Schema({
    order_id: {
        type: String,
        unique: true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    products_id: [String],
    products_price: [Number],
    quantity: [NUmber]
})

const Order = mongoose.model('orders', ordersSchema);

module.exports = Order;