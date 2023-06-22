
const mongoose = require('mongoose');
const Product = require('./product.js');

const connectionURL = 'mongodb+srv://rifstudy7:B7Kdrz4TRPY3jpZz@cluster0.s7ccuri.mongodb.net/';
const databaseName = 'WebApplicationsProject';

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName
}).then(async () => {
    console.log('Connected to the database');



}).catch((error) => {
    console.log("Can't connect to the database:", error);
});

const db = mongoose.connection;

db.on('error', (error) => {
    console.log("Database connection error:", error);
});

db.once('connected', () => {
    console.log("Database connected successfully");
});

db.once('disconnected', () => {
    console.log("Database disconnected");
});
