

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



//Check!!
app.use(express.urlencoded({ extended: true }));

app.get('/add-product', (req, res) => {
    res.render('AddProduct.ejs'); // Replace 'addProduct' with the actual name of your EJS file for adding a product
});


app.post('/add-product', async (req, res) => {
    try {
        const { title, category, brand, quantity, url, highlights, availability, selling_price, original_price, units, listing_id, product_id, image } = req.body;

        // Check if the product_id and listing_id are unique
        const isProductIdUnique = await Product.exists({ product_id: req.body.product_id });
        const isListingIdUnique = await Product.exists({ listing_id: req.body.listing_id });


        if (isProductIdUnique) {
            // Handle the case when the product_id is not unique
            return res.status(400).send('Product ID already exists');
        }

        if (isListingIdUnique) {
            // Handle the case when the listing_id is not unique
            return res.status(400).send('Listing ID already exists');
        }

        // Create a new product object with the required fields
        const product = new Product({
            category: req.body.category,
            title: req.body.title,
            quantity: req.body.quantity,
            brand: brand,
            url: req.body.url,
            product_id: req.body.product_id,
            listing_id: req.body.listing_id,
            avg_rating: 0, // Initialize the rating-related fields to 0
            rating_count: 0,
            review_count: 0,
            '1_stars_count': 0,
            '2_stars_count': 0,
            '3_stars_count': 0,
            '4_stars_count': 0,
            '5_stars_count': 0,
            image: req.body.image
        });

        await product.save();

        res.render('Success.ejs', { product });
    } catch (error) {
        console.log('Error adding product:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/success', (req, res) => {
    res.render('Success.ejs');
});
