"use strict";
const config = require('../config');
const mongooseId = require('mongoose').Types.ObjectId;
const fs = require('fs');

const Product = require("../models/Product");
//--------------------Products------------------------
// Create a product and save it to the database
exports.createProduct = (name, desc, amount, categories, price, unique = false) => {
  let product = new Product({
    name: name,
    description: desc,
    amount: amount,
    unique: unique,
    pictures: [],
    categories: categories,
    price: price,
  });
  return product.save();
};

// Get a product from the database with a specified id
exports.getProduct = (id) => {
  return Product.findById(id).exec();
}

// Find and return all products in the database
exports.getProducts = () => {
  return Product.find().exec();
};

// Updates a product, only updates the fields that is included in the request body
exports.updateProduct = (id, reqbody) => {
  let updates = {};
  updates.updated = Date.now();

  /* This is done to make the function flexible. Instead of having a function
      for every field on the product we only have this one*/
  if (reqbody.name) { updates.name = reqbody.name};
  if (reqbody.desc) { updates.description = reqbody.desc};
  if (reqbody.amount) { updates.amount = reqbody.amount};
  if (reqbody.unique) {updates.unique = reqbody.unique};
  if (reqbody.categories) { updates.categories = reqbody.categories};
  if (reqbody.price) { updates.price = reqbody.price};
  if (reqbody.discount) { updates.discount = reqbody.discount};
  if (reqbody.reservedAmount) { updates.reservedAmount = reqbody.reservedAmount};

  // updates the product with the specified id to match the fields in the updates objects
  Product.updateOne({_id: id}, updates).exec();
}

// Delete a specific product and the pictures of the product
exports.deleteProduct = async (id) => {
  // Find the object we wanna delete
  let product = await Product.findOne({_id:id});

  /* It's not enough to delete the product from the database, because our pictures are saved
      in the server application storage. This for-loop takes care of deleting the pictures
      from the app storage*/
  for (let pic of product.pictures) {
    fs.exists(`./public/uploads/${pic}.jpg`, function(exists) {
      if(exists) {
        fs.unlink(`./public/uploads/${pic}.jpg`, (err) => {
          if (err) throw err;
        });
      } else {
        console.log('File not found, so not deleting.');
      }
    });
  }
  // After all the pictures are deleted, we delete the product from the database:
  Product.deleteOne({_id:id}).exec();
}

/* Deletes specified pictures from a specified product. This takes care of updating the product
    refrences to the pictures, aswell as deleting the pictures from the application storage*/
exports.deletePicturesFromProduct = async (product_id, picture_ids) => {

  // Remove the refrences to the pictures on the product in the database
  let product = await Product.findOneAndUpdate({
    _id: mongooseId(product_id)}, 
    {$pullAll: {pictures: picture_ids}, //delete the refrences from the array
    updated: Date.now()
  }).exec();

  // Delete the pictures from the application storage
  if (product) {
    for (let pic of picture_ids) {
      fs.exists(`./public/uploads/${pic}.jpg`, function(exists) {
        if(exists) {
          fs.unlink(`./public/uploads/${pic}.jpg`, (err) => {
            if (err) throw err;
          });
        } else {
          console.log('File not found, so not deleting.');
        }
      });
    }
  }

}

// Add an array of pictures to a product, and saves it to the database
exports.addPictures = async (product_id, picture_ids) => {
  try {
    await Product.findOneAndUpdate({_id: mongooseId(product_id)}, {$push: {pictures: picture_ids}, updated: Date.now()} ).exec();
  } catch (error) {
    console.log(error)
  }
}


//--------------------Category------------------------
const Category = require("../models/Category");

// Create a category and save it to the database
exports.createCategory = (name) => {
  let category = new Category({
     // Note that the name is the document id. meaning every category name has to be unique
    _id: name,
  });
  return category.save();
};

// Find and return all categories in the database
exports.getCategories = async  () => {
  let categories =  await Category.find().exec();
  categories = categories.map((cat) => {return cat._id});
  return categories;
};

// Delete a specific product and the pictures of the product
exports.deleteCategory = async (name) => {
  return Category.deleteOne({_id:name}).exec();
}

// Get all the products from the database that has the specified category in its list of categories
exports.getProductsFromCategory = async (category) => {
  let products = await Product.find({ categories: category}).exec();
  return products;
}

//------------------------------Login----------------------------------
const Login = require("../models/Login");

// Create a login and save it to the database
exports.createLogin = (username, password) => {
    let login = new Login({
        username: username,
        password: password
    });
    return login.save();
};

// Find and return all logins in the database
exports.getLogins = (name,pass) => {
    return Login.find({username: name, password: pass}).exec();
};


//----------------------------Reservations------------------------------
const nodemailer = require('nodemailer');

// Sends an email from the mail account specified in config file.
exports.sendEmail = (reqbody) => {
  /* the transporter object is the service that is responsible for logging into a mail account
      creating the email, and finally sending the email.  */
  const transporter = nodemailer.createTransport(config.transporter);

  const mailOptions = {
    from: reqbody.from,       // sender address
    to: config.notifyEmail,   // list of receivers
    subject: reqbody.subject, // Subject line
    html: reqbody.html        // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      throw err
    else
      console.log(info);
 });
}