

const express = require('express');
const app = express();
const path = require('path');
const port = 3070;


const db = require('./seeds');//Check!
const Product = require('./product');//Check!
const ejs = require('ejs');//Check!
const User = require('./users');

app.use(express.static(path.join(__dirname)));//new


app.set('view engine', 'ejs'); //Check!

app.listen(port, function () {
    console.log('connected succesfully to port 3070')
})

app.get('/', (req, res) => {
    //res.send('hi');
    res.sendFile(path.join(__dirname, 'home.html'));
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
})

app.get('/Products', (req, res) => {
    res.sendFile(path.join(__dirname, 'Products.html'));
})
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
})
app.get('/sale', (req, res) => {
    res.sendFile(path.join(__dirname, 'sale.html'));
})
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
})

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
})
app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, 'Register.html'));
})


//To check!!
app.get('/product-list', async (req, res) => {
    try {
        const products = await Product.find({}).lean();

        console.log(products); // Log the products array to check the retrieved data

        res.render('ProductsList', { products });
    } catch (error) {
        console.log('Error retrieving products:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/user-list', async (req, res) => {
    try {
        const users = await User.find({}).lean();

        console.log(users); // Log the users array to check the retrieved data

        res.render('UsersList', { users });
    } catch (error) {
        console.log('Error retrieving users:', error);
        res.status(500).send('Internal Server Error');
    }
});
