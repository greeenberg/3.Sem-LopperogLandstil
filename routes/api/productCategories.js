const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const mongooseId = require('mongoose').Types.ObjectId;


// Get all kategories in the database
router.get('/', async function (req, res) {
    
    try {
        let kategories = await controller.getCategories();
        res.json(kategories);
        
    } catch (err) {
        res.send({success:false, error: err});
    }
    
})

// Get all kategories in the database
router.post('/', async function (req, res) {
    try {
        let kategories = await controller.createCategory(req.body.name);
        res.send({success:true});
    } catch (err) {
        res.send({success:false, error: err});
    }
})

// Get all kategories in the database
router.delete('/:name', async function (req, res) {
    try {
        await controller.deleteCategory(req.params.name);
        res.json({success: true});
    } catch (error) {
        res.json({success: false, error: error.message});
    }
})

// Get all kategories in the database
router.get('/:name', async function (req, res) {
    try {
        produkter = await controller.getProductsFromCategory(req.params.name);
        res.json(produkter);
    } catch (error) {
        res.json({success: false, error: error.message});
    }
})

module.exports = router;
