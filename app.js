

const express = require('express');
const app = express();
const path = require('path');
const port = 3070;

app.use(express.static(path.join(__dirname)));//new

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



