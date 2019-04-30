const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();


// TODO
router.post('/', function (req, res) {
    const {name, password} = req.body;

    controller.getLogins(name, password)
        .then(result => {
            if (result.length) {
                req.session.name = name;
                res.send({ok: true})
            }
            else {
                res.send({ok: false})
            }
        })
.catch(error =>{
    console.log(error)
    })
})

// TODO
    router.get('/session', function (req, res) {
        const name = req.session.name;
        if(name) {
            res.render(`session`,{name});
        }else{
            res.render('loginFail')
        }
        //else: access denied
    });

    router.get('/visProdukt', function(req, res){
        const name = req.session.name;
        if(name){
            res.render('inventory');
        }else{
            res.render('loginFail');
        }
    });

    router.get('/createProduct', function (req, res) {
        const name = req.session.name;
        if(name) {
            res.render(`createProduct`);
        }else{
            res.render('loginFail')
        }
        //else: access denied
    });

    router.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/admin');
            }
        });
    });

    module.exports = router;
