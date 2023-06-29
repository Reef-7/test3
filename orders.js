

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
    first_name: String,
    last_name: String,
    products: [{
        product_id: String,
        title: String,
        price: Number,
        quantity: Number,
        img: String
    }],

})

const Order = mongoose.model('orders', ordersSchema);

module.exports = Order;