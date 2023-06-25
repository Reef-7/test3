

const express = require('express');
const app = express();
const path = require('path');
const port = 3070;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require('./seeds');//Check!
const Product = require('./product');//Check!
const ejs = require('ejs');//Check!
const User = require('./users');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
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

        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4; // Calculate the ending index based on the current page

        // Fetch the product data from your database or any other source
        const products = await Product.find({}).lean(); // Replace this with your actual data retrieval logic

        const totalPages = Math.ceil(products.length / 4); // Calculate the total number of pages

        // Slice the products array based on the current page and the number of products per page
        const displayedProducts = products.slice(startIndex, endIndex);

        const selectedProducts = []; // Initialize an empty array for selected products

        // Render the EJS template and pass the product data, selected products, and pagination variables
        res.render('ProductsList', { products: displayedProducts, selectedProducts, currentPage: page, totalPages });
    } catch (error) {
        console.log('Error retrieving products:', error);
        res.status(500).send('Internal Server Error');
    }
});

// ...

app.post('/product-list', async (req, res) => {
    try {
        const filters = {
            title: req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            quantity: req.body.quantity,
            url: req.body.url,
            product_id: req.body.product_id,
            listing_id: req.body.listing_id,
            highlights: req.body.highlights,
            availability: req.body.availability,
            selling_price: req.body.selling_price,
            original_price: req.body.original_price,
            currency: req.body.currency,
            avg_rating: req.body.avg_rating,
            rating_count: req.body.rating_count,
            review_count: req.body.review_count,
            '1_stars_count': req.body['1_stars_count'],
            '2_stars_count': req.body['2_stars_count'],
            '3_stars_count': req.body['3_stars_count'],
            '4_stars_count': req.body['4_stars_count'],
            '5_stars_count': req.body['5_stars_count'],
            image: req.body.image,
            units: req.body.units
        };

        const query = {};
        for (const field in filters) {
            if (filters[field]) {
                query[field] = filters[field];
            }
        }

        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4; // Calculate the ending index based on the current page

        const products = await Product.find(query).lean();
        const totalPages = Math.ceil(products.length / 4); // Calculate the total number of pages
        const displayedProducts = products.slice(startIndex, endIndex); // Slice the products array based on the current page and the number of products per page
        const selectedProducts = []; // Initialize an empty array for selected products
        res.render('ProductsList', { products: displayedProducts, selectedProducts, currentPage: page, totalPages });
    } catch (error) {
        console.log('Error applying filters:', error);
        res.status(500).send('Internal Server Error');
    }
});


// ...


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
            brand: req.body.brand,
            url: req.body.url,
            product_id: req.body.product_id,
            listing_id: req.body.listing_id,
            highlights: req.body.highlights, // Add highlights field
            availability: req.body.availability, // Add availability field
            selling_price: req.body.selling_price, // Add selling_price field
            original_price: req.body.original_price, // Add original_price field
            currency: 'ILS',
            avg_rating: 0, // Initialize the rating-related fields to 0
            rating_count: 0,
            review_count: 0,
            '1_stars_count': 0,
            '2_stars_count': 0,
            '3_stars_count': 0,
            '4_stars_count': 0,
            '5_stars_count': 0,
            image: req.body.image,
            units: req.body.units // Add units field
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








app.get('/update-product', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 20; // Calculate the starting index based on the current page
        const endIndex = startIndex + 20; // Calculate the ending index based on the current page

        // Fetch the product data from your database or any other source
        const products = await Product.find({}).lean(); // Replace this with your actual data retrieval logic

        const totalPages = Math.ceil(products.length / 20); // Calculate the total number of pages

        // Slice the products array based on the current page and the number of products per page
        const displayedProducts = products.slice(startIndex, endIndex);

        const selectedProducts = []; // Initialize an empty array for selected products

        // Render the EJS template and pass the product data, selected products, and pagination variables
        res.render('UpdateProduct.ejs', { products: displayedProducts, selectedProducts, currentPage: page, totalPages });
    } catch (error) {
        console.log('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-product/:id', async (req, res) => {
    const productId = req.params.id;
    const updates = {}; // Initialize an empty object for storing the updates

    // Check if each field exists in the request body and has a non-empty value
    if (req.body.title) {
        updates.title = req.body.title;
    }
    if (req.body.category) {
        updates.category = req.body.category;
    }
    if (req.body.brand) {
        updates.brand = req.body.brand;
    }
    if (req.body.quantity) {
        updates.quantity = req.body.quantity;
    }
    if (req.body.url) {
        updates.url = req.body.url;
    }
    if (req.body.highlights) {
        updates.highlights = req.body.highlights;
    }
    if (req.body.availability) {
        updates.availability = req.body.availability;
    }
    if (req.body.selling_price) {
        updates.selling_price = req.body.selling_price;
    }
    if (req.body.original_price) {
        updates.original_price = req.body.original_price;
    }
    if (req.body.units) {
        updates.units = req.body.units;
    }
    if (req.body.image) {
        updates.image = req.body.image;
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

        if (!updatedProduct) {
            // Handle case when the product with the given ID is not found
            return res.status(404).send('Product not found');
        }

        res.redirect('/product-list');
    } catch (error) {
        console.log('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/delete-product', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4; // Calculate the ending index based on the current page

        // Fetch the product data from your database or any other source
        const products = await Product.find({}).lean(); // Replace this with your actual data retrieval logic

        const totalPages = Math.ceil(products.length / 4); // Calculate the total number of pages

        // Slice the products array based on the current page and the number of products per page
        const displayedProducts = products.slice(startIndex, endIndex);

        const selectedProducts = []; // Initialize an empty array for selected products

        // Render the EJS template and pass the product data, selected products, and pagination variables
        res.render('DeleteProduct', { products: displayedProducts, selectedProducts, currentPage: page, totalPages });
    } catch (error) {
        console.log('Error retrieving products:', error);
        res.status(500).send('Internal Server Error');
    }
});



// ...

app.post('/delete-product', async (req, res) => {
    try {
        const selectedProductId = req.body.selectedProduct;

        // Delete the selected product from the database
        await Product.deleteOne({ product_id: selectedProductId });

        // Redirect to the product list page or display a success message
        res.redirect('/product-list');
    } catch (error) {
        console.log('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
});







app.post('/Register', async (req, res) => {
    try {
        const { first_name, last_name, email, gender, Address, City, Password } = req.body;


        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // If a user with the same email already exists, send a response indicating the conflict
            return res.status(409).send('<h1> User with this email already exists </h1>');
        }

        // Retrieve the last user from the database
        const lastUser = await User.findOne({}, {}, { sort: { 'id': -1 } });

        // Generate a unique numeric ID for the user
        const id = lastUser ? lastUser.id + 1 : 1;

        // Create a new user object
        const user = new User({
            id,
            first_name,
            last_name,
            email,
            gender,
            Address,
            City,
            Password,
            IsAdmin: false
        });

        // Save the user to the database
        await user.save();

        res.cookie('userId', id);

        // Redirect to the home page or display a success message
        res.redirect('/');
    } catch (error) {
        console.log('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});


// ...
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email:', email);
        console.log('Password:', password);

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: email });
        console.log('Existing User:', existingUser);

        if (existingUser == null) {
            console.log('There is no user with this email');
        } else if (existingUser.Password !== password) {
            console.log('Email and Password do not match');
            return res.status(401).send('Invalid password');
        } else if (existingUser.IsAdmin) {
            // If the user is an admin, display a special message
            console.log('You Are An Admin!');

        }

        // Redirect to the home page for regular users
        console.log('Welcome' + ' ' + existingUser.first_name + ' ' + existingUser.last_name);
        return res.redirect('/');
    } catch (error) {
        console.log('Error Logging In:', error);
        return res.status(500).send('Internal Server Error');
    }
});
