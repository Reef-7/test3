const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    Address: String,
    City: String,
    Password: String,
    IsAdmin: Boolean,
    favorites: [String]
});

const User = mongoose.model('users', userSchema);

module.exports = User;
