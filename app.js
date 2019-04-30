"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const config = require('./config');

const app = express();

app.use(express.static('public', {extensions: ['html']}));  //Serve static files from public folder
app.use(express.static('public/pages', {extensions: ['html']}));
app.use(express.json());            //Parse incomming json requests to js objects
app.use(morgan('tiny'));            //Logs every request
app.set('view engine', 'hbs');      //Setup the app view engine with hbs
app.set('views', './public/templates');      //Set the folder where we store the views to render
app.use(session({
    secret: 'secretHackerman', //note: weak encrypt key
    saveUninitialized: true, 
    resave: true
}));

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mlabMongoDB, {useNewUrlParser: true});

// ROUTES FOR THE APP
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/api/products');
const productCategoryRouter = require('./routes/api/productCategories');
const emailRouter = require('./routes/api/email');
app.use('/api/produkter', productRouter);
app.use('/api/produktkategorier', productCategoryRouter);
app.use('/admin', adminRouter);
app.use('/api/email', emailRouter);

// START THE SERVER
//use the heroku port if we're deploying there. if not: use local port.
const port = process.env.PORT || config.localPort; 
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app;
