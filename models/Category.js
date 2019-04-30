const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the category schema
let category = new Schema({
    "_id":{ type:String, req:true}
});

// Compile the schema into a model and replace the exports object with the model.
// Each instance of a model is representing a document in the database
module.exports = mongoose.model("Category", category);