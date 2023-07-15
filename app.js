const express = require('express');
const app = express();
const path = require('path');
const port = 3070;





const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.set('trust proxy', 1);

const session = require('express-session');

// Include the WebSocket code from websocket.js
const http = require('http');
const server = http.createServer(app);
require('./websocket.js')(server);



//live arcticles information shown 
const Parser = require('rss-parser');
const parser = new Parser();
// Configure session middleware with FileStore

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: 'mongodb+srv://rifstudy7:B7Kdrz4TRPY3jpZz@cluster0.s7ccuri.mongodb.net/',
    collection: 'sessions',
});

store.on('error', function (error) {
    console.log('MongoDB session store error:', error);
});

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            path: '/',
        },
    })
);










const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require('./seeds');
const Product = require('./product');
const ejs = require('ejs');
const User = require('./users');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));






app.set('view engine', 'ejs');

app.listen(port, function () {
    console.log('connected succesfully to port 3070')
})

app.get('/', (req, res) => {
    //res.send('hi');
    res.sendFile(path.join(__dirname, 'home.html'));
})
app.get('/rss-feed', async (req, res) => {
    try {
        const feed = await parser.parseURL('https://feeds.feedblitz.com/hbwi-wellness');
        res.send(feed.items);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

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


app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, 'Register.html'));
})



//------
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.IsAdmin) {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        const loggedInUser = req.session.user;
        // User is not an admin, redirect to a suitable page or send an error response
        res.redirect('/UserHome?name=' + loggedInUser.first_name + ' ' + loggedInUser.last_name); // or res.status(403).send('Forbidden');
    }
};
//-----

app.get('/product-list', isAdmin, async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4; // Calculate the ending index based on the current page

        // Fetch the product data from your database or any other source
        const products = await Product.find({}).lean();

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


app.get('/user-list', isAdmin, async (req, res) => {
    try {

        const users = await User.find({}).lean();

        console.log(users); // Log the users array to check the retrieved data

        res.render('UsersList', { users });
    } catch (error) {
        console.log('Error retrieving users:', error);
        res.status(500).send('Internal Server Error');
    }
});





app.get('/add-product', isAdmin, (req, res) => {

    res.render('AddProduct.ejs');
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



app.get('/login', (req, res) => {
    if (req.session && req.session.user) {
        // User is already logged in
        const loggedInUser = req.session.user;
        if (loggedInUser.IsAdmin) {
            return res.redirect('/AdminHome?name=' + loggedInUser.first_name + ' ' + loggedInUser.last_name);
        }
        else {
            return res.redirect('/UserHome?name=' + loggedInUser.first_name + ' ' + loggedInUser.last_name);
        }
    }
    else {
        // User is not logged in, show the login page
        return res.render('login.ejs');
    }
});




app.get('/update-product', isAdmin, async (req, res) => {
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
    if (req.body.image) {
        updates.image = req.body.image;
    }
    if (req.body.units) {
        updates.units = req.body.units;
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



app.get('/delete-product', isAdmin, async (req, res) => {

    try {


        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4; // Calculate the ending index based on the current page

        // Fetch the product data from database 
        const products = await Product.find({}).lean();

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

        // Redirect to the product list page 
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



        // Redirect to the home page 
        res.redirect('/');
    } catch (error) {
        console.log('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});



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
            return res.redirect('/error?error=noUser');
        } else if (existingUser.Password !== password) {
            console.log('Email and Password do not match');
            return res.redirect('/error?error=wrongCredentials');
        } else if (existingUser.IsAdmin) {
            // If the user is an admin, display a special message
            console.log('You Are An Admin!');
            if (!req.session.user) {
                req.session.user = existingUser; // Store the user object in the session
            }
            console.log(req.session);
            return res.redirect('/AdminHome?name=' + existingUser.first_name + ' ' + existingUser.last_name);
        }

        // If the user is a regular user
        if (!req.session.user) {
            req.session.user = existingUser; // Store the user object in the session
        }
        console.log(req.session);
        return res.redirect('/UserHome?name=' + existingUser.first_name + ' ' + existingUser.last_name);
    } catch (error) {
        console.log('Error Logging In:', error);
        return res.status(500).send('Internal Server Error');
    }
});



app.get('/error', (req, res) => {
    const { error } = req.query;
    let errorMessage = '';

    if (error === 'noUser') {
        errorMessage = 'User with that email does not exist.';
    } else if (error === 'wrongCredentials') {
        errorMessage = 'Email and password do not match.';
    } else {
        errorMessage = 'An unknown error occurred.';
    }

    res.render('error', { message: errorMessage });
});


app.get('/AdminHome', (req, res) => {
    if (req.session && req.session.user) {
        const loggedInUser = req.session.user;
        if (!loggedInUser.IsAdmin) {
            return res.redirect('/UserHome?name=' + loggedInUser.first_name + ' ' + loggedInUser.last_name);
        }

        else {
            const { name } = req.query;
            let HelloMessage = 'Welcome ' + loggedInUser.first_name + ' ' + loggedInUser.last_name;
            res.render('AdminHome', { message: HelloMessage });
        }
    }
    return res.redirect('login.ejs');

});


app.get('/UserHome', async (req, res) => {
    try {
        const { name } = req.query;
        //const HelloMessage = 'Welcome Back ' + name;
        const HelloMessage = name ? 'Welcome Back ' + name : 'Welcome Back Maneger ';

        // Fetch 8 random products from the collection
        const products = await Product.aggregate([{ $sample: { size: 8 } }]);
        const showAdminButton = false;
        const referer = req.headers.referer;
        /*if (referer && referer.includes('/AdminHome')) {
            showAdminButton = true;
        }*/
        /* if (req.session.user.IsAdmin) {
             showAdminButton = true;
         }*/
        return res.render('UserHome', { message: HelloMessage, products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        res.render('Product', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving product details.');
    }
});



app.post('/add-to-favorites', async (req, res) => {
    const productId = req.body.productId;
    const user = req.session.user;
    const userId = req.session.user.id;


    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            // Handle case when user is not found
            return res.status(404).send('User not found');
        }


        user.favorites.push(productId);
        await user.save();

        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/remove-from-favorites', async (req, res) => {
    const productId = req.body.productId;
    const userId = req.session.user.id;

    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            // Handle case when user is not found
            return res.status(404).send('User not found');
        }

        const index = user.favorites.indexOf(productId);
        if (index !== -1) {
            user.favorites.splice(index, 1); // Remove the productId from the favorites array
            await user.save();
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/logout', (req, res) => {
    // Perform logout action of destroying the session
    req.session.destroy();

    // Redirect the user to the homepage
    res.redirect('/');
});


app.get('/favorites', async (req, res) => {
    try {
        // Fetch the user document based on the logged-in user or any other identifier
        const userId = req.session.user.id; // Assuming you have a logged-in user and can access the user ID
        const user = await User.findOne({ id: userId });

        // Access the favorites array from the user document
        const favorites = user.favorites;

        // Find the products with matching product_id values in the favorites array

        const favoriteProducts = [];
        for (let i = 0; i < favorites.length; i++) {
            const product = await Product.findById(favorites[i]);
            favoriteProducts.push(product);
        }



        // Pass the favorite products array to the favorites page template and render the page
        console.log(favoriteProducts);
        res.render('favorites.ejs', { favoriteProducts });
    } catch (error) {
        // Handle any errors
        res.status(500).send('Internal Server Error');
    }
});

app.post('/add-to-cart/:id', async (req, res) => {
    const { id } = req.params;
    const unit = parseInt(req.body.units);
    const isOnSale = req.query.onSale === 'true';
    const existingUser = req.session.user;
    const referer = req.headers.referer;


    try {
        // Fetch the product from the database based on the productId
        const product = await Product.findById(id);

        // Get the user's cart from the session or create a new one if it doesn't exist
        let cart = req.session.cart;
        if (!cart) {
            cart = [];
        }

        // Calculate the price based on whether the product is on sale
        const price = isOnSale ? product.selling_price : product.original_price;

        // Check if the product already exists in the cart
        const existingProduct = cart.find((item) => item.product.equals(product._id));
        if (existingProduct) {
            // If the product already exists, update the units
            existingProduct.units += unit;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.push({
                product: product._id,
                price: price,
                units: unit
            });
        }

        // Update the cart in the session
        req.session.cart = cart;

        if (referer && referer.includes('/UserHome')) {
            // The request is coming from the UserHome page
            return res.redirect('/UserHome?name=' + encodeURIComponent(existingUser.first_name + ' ' + existingUser.last_name));
        } else if (referer && ((referer.includes('/product')) || (referer.includes('/shop')))) {
            // The request is coming from a product page
            return res.redirect(referer);
        } else {
            // Handle other cases or provide a default redirect
            return res.redirect('/'); // Example: Redirect to the home page
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});





app.get('/cart', async (req, res) => {
    // Retrieve the cart from the session
    const cart = req.session.cart || [];

    try {
        // Fetch the details of each product in the cart from the product collection
        const productDetails = await Promise.all(
            cart.map(async (item) => {
                const product = await Product.findById(item.product);
                return {
                    ...item,
                    id: product._id,
                    image: product.image,
                    title: product.title,
                    highlights: product.highlights,
                    quantity: item.units, // Include the quantity from the session
                    available: product.units
                };
            })
        );

        res.render('cart', { cart: productDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



app.post('/removefromcart/:id', async (req, res) => {
    const { id } = req.params;
    const cart = req.session.cart || [];

    // Remove the product with the given id from the cart
    req.session.cart = cart.filter((item) => item.product.toString() !== id);

    try {
        // Fetch the details of each remaining product in the cart from the product collection
        const productDetails = await Promise.all(
            req.session.cart.map(async (item) => {
                const product = await Product.findById(item.product);
                return {
                    ...item,
                    id: product._id,
                    image: product.image,
                    title: product.title,
                    highlights: product.highlights,
                    quantity: item.units, // Include the quantity from the session
                    available: product.units
                };
            })
        );

        res.render('cart', { cart: productDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


//--------
app.post('/shop', async (req, res) => {
    try {
        const filters = {
            title: req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            quantity: req.body.quantity,
            original_price: req.body.original_price,
            avg_rating: req.body.avg_rating,
        };

        const query = {};
        for (const field in filters) {
            if (filters[field]) {
                query[field] = filters[field];
            }
        }

        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4;


        /*const pipeline = [
            { $match: query },
            { $group: { _id: "$category", products: { $push: "$$ROOT" } } },
            { $skip: startIndex },
            { $limit: 4 }
        ];

        const selectedProducts = await Product.aggregate(pipeline);

        const totalProducts = await Product.countDocuments(query);*/
        const products = await Product.find(query).lean();
        const totalPages = Math.ceil(products.length / 4); // Calculate the total number of pages
        const displayedProducts = products.slice(startIndex, endIndex); // Slice the products array based on the current page and the number of products per page
        const selectedProducts = []; // Initialize an empty array for selected products


        /*res.render('shop', {
            products: selectedProducts,
            currentPage: page,
            totalPages
        });*/

        res.render('shop', { products: displayedProducts, selectedProducts, currentPage: page, totalPages });
    } catch (error) {
        console.log('Error applying filters:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/shop', async (req, res) => {
    try {
        //const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        //const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page

        /* const filters = {
             title: req.query.title,
             category: req.query.category,
             brand: req.query.brand,
             original_price: req.body.original_price,
             quantity: req.query.quantity,
             avg_rating: req.query.avg_rating
         };
 
         const query = {};
         for (const field in filters) {
             if (filters[field]) {
                 query[field] = filters[field];
             }
         }
 
         const products = await Product.find(query).skip(startIndex).limit(4).lean();
         const totalProducts = await Product.countDocuments(query);
         const totalPages = Math.ceil(totalProducts / 4); // Calculate the total number of pages
 
         res.render('shop', {
             products: products,
             currentPage: page,
             totalPages
         });*/
        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
        const startIndex = (page - 1) * 4; // Calculate the starting index based on the current page
        const endIndex = startIndex + 4; // Calculate the ending index based on the current page

        // Fetch the product data from your database or any other source
        const products = await Product.find({}).lean();

        const totalPages = Math.ceil(products.length / 4); // Calculate the total number of pages

        // Slice the products array based on the current page and the number of products per page
        const displayedProducts = products.slice(startIndex, endIndex);

        const selectedProducts = []; // Initialize an empty array for selected products
        res.render('shop', { products: displayedProducts, selectedProducts, currentPage: page, totalPages });
    } catch (error) {
        console.log('Error retrieving products:', error);
        res.status(500).send('Internal Server Error');
    }
});



const Order = require('./orders');
app.post('/checkout', async (req, res) => {
    try {
        const {
            products_id,
            products_price,
            products_img,
            products_title,
            products_quantity
        } = req.body;
        let totalPrice = 0;
        const products = [];
        for (let i = 0; i < products_id.length; i++) {
            const product = {
                product_id: products_id[i],
                title: products_title[i],
                price: products_price[i],
                quantity: products_quantity[i],
                img: products_img[i]
            };
            products.push(product);
            totalPrice += product.price * product.quantity;
        }

        const order = new Order({
            order_id: new mongoose.Types.ObjectId(),
            user_id: req.session.user.id,
            date: new Date(),
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            products
        });
        req.session.order = {
            orderId: order._id,
            products,
            totalPrice
        };


        await order.save();

        res.redirect('/checkout-success');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while placing the order' });
    }
});

app.get('/checkout-success', (req, res) => {
    // Retrieve the order details from the session or database
    // Render the CheckOutSuccess.ejs template with the order details
    res.render('CheckOutSuccess', { orderDetails: req.session.order });
});



app.get('/personal-orders', async (req, res) => {
    try {
        // Retrieve the user ID from the session 
        const userId = req.session.user.id;

        // Retrieve the user's order history from the database
        const orders = await Order.find({ user_id: userId });

        // Render the orders history view and pass the orders data
        res.render('personalorders.ejs', { orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the order history' });
    }
});


app.get('/orders-history', isAdmin, async (req, res) => {
    try {
        // Extract filter parameters from the query string
        const { date, firstName, lastName, price } = req.query;

        // Build the filter object based on the provided parameters
        const filter = {};
        if (date) filter.date = new Date(date);
        if (firstName) filter.first_name = firstName;
        if (lastName) filter.last_name = lastName;
        if (price) filter['products.price'] = parseFloat(price);

        // Fetch the orders that match the filter
        const orders = await Order.find(filter);

        // Render the orders.ejs template and pass the orders data
        res.render('ordershistory.ejs', { orders });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/orders-history', async (req, res) => {
    try {
        // Extract filter parameters from the request body
        const { date, firstName, lastName, price } = req.body;

        // Build the filter object based on the provided parameters
        const filter = {};
        if (date) filter.date = new Date(date);
        if (firstName) filter.first_name = firstName;
        if (lastName) filter.last_name = lastName;
        if (price) filter['products.price'] = parseFloat(price);

        // Fetch the orders that match the filter
        const orders = await Order.find(filter);

        // Render the orders.ejs template and pass the orders data
        res.render('ordershistory.ejs', { orders });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/totalgraph', isAdmin, async (req, res) => {
    try {
        const data = await Order.aggregate([
            {
                $group: {
                    _id: { $month: '$date' },
                    totalPrice: { $sum: '$totalPrice' },
                },
            },
        ]);

        res.render('TotalGraph', { data: JSON.stringify(data) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/AvgGraph', isAdmin, async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const data = await Order.aggregate([
            {
                $match: {
                    _id: { $ne: null },
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    averagePrice: { $avg: '$totalPrice' }
                }
            }
        ]);

        res.render('AvgGraph', { data: JSON.stringify(data) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});