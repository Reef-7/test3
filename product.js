const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: String,
    title: String,
    quantity: String,
    brand: String,
    url: String,
    product_id: String,
    listing_id: String,
    highlights: String,
    availability: String,
    selling_price: Number,
    original_price: Number,
    currency: String,
    avg_rating: Number,
    rating_count: Number,
    review_count: Number,
    '1_stars_count': Number,
    '2_stars_count': Number,
    '3_stars_count': Number,
    '4_stars_count': Number,
    '5_stars_count': Number,
    image: String
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
