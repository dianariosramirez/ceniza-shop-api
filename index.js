const express = require( "express" );
const bcrypt = require('bcrypt');
const cors = require("cors");


// Databases
const tisanas = require("./databases/tisanasData");
const paquetes = require("./databases/paquetesData");
const accesorios = require("./databases/accesoriosData");
const users = require("./databases/users");

const app = express();

app.use( express.json() );
app.use( cors() );

// to get product's data

app.get( '/tizanas', ( req, res ) => {
    res.send( tisanas )
})

app.get( '/paquetes', ( req, res ) => {
    res.send( paquetes )
})

app.get( '/accesorios', ( req, res ) => {
    res.send( accesorios )
})

// Get product detail
const getProduct = ( productType, productId ) => {
    let productFound = [];
    if (productType === "tisanas"){
        productFound = tisanas.find( elem => elem.id === productId);
    } else if (productType === "paquetes"){
        productFound = paquetes.find( elem => elem.id === productId);
    } else {
        productFound = accesorios.find( elem => elem.id === productId);
    }

    return productFound;
}

app.get('/product', (req, res) => {
    const productType = req.query.productType;
    const productId = req.query.productId;

    const product = getProduct( productType, productId );
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
})

// Search products

app.get('/products', (req, res) =>{
    const products = tisanas.concat(paquetes, accesorios);

    res.json(products);
})

// to favorites

let favorites = [];

app.get( '/favorites', ( req, res ) => {
    res.send( favorites )
})

app.post( '/favorites', ( req, res ) => {
    const product = req.body;
    const newFavorite = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageURL: product.imageURL,
        type: product.type,
        info: product.info,
        capacity: product.capaciy,
        favorite: true,
        page: product.page
    }

    favorites.push(newFavorite);
    res.json(favorites);
})

app.delete( '/favorites/:id', ( req, res ) => {
    const id =  req.params.id;
    favorites = favorites.filter( product => product.id !== id );
    res.json(favorites);
})

// to login

app.post('/signin', ( req, res ) => {
    // bcrypt.compare(myPlaintextPassword, hash, (err, result) => {

    // });
    if (req.body.email === users[1].email && req.body.password === users[1].password) {
        res.json( users[1] );
    }else {
        res.status(400).json({error: 'User not found'});
    }
})

app.post('/register', ( req, res ) => {

    const user = req.body;
    // bcrypt.hash(user.password, 10, (err, hash) => {
    //     console.log(hash);
    // });
    const newUser = {
        id: 3,
        name: user.name,
        email: user.email,
        password: user.password,
        city: user.city,
        state: user.state,
        joined: new Date()
    };

    users.push( newUser );
    res.json( users[ users.length - 1 ] );
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`)
})
