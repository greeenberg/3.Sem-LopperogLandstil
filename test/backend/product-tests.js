'use strict';

const mongoose = require('mongoose');
const Product = require("../../models/Product");

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../testapp');
const should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {
    //Before each test we empty the database
    Product.remove({}, (err) => {
    });
    /*
      * Test the /GET route
      */
    describe('Empty /GET Products', () => {
        it('it should an empty list of products', (done) => {
            chai.request(app)
                .get('/api/produkter')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    /*
     * Test the product /POST route
     */
    describe('/POST Products', () =>{
        it('Should post a product and add it to the database', (done)=>{
            chai.request(app)
                .post('/api/produkter')
                .set('content-type', 'application/json')
                .send({name:'unittest name',
                    desc:'unittest description',
                    unique:false,
                    amount:10,
                    categories:['unittest category 1', 'unittest category 2'],
                    price:100})
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.success.should.eql(true);
                    done();
                })
        });
        it('Should get a filled list of products (1 product)', (done)=>{
            chai.request(app)
                .get('/api/produkter')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    //TODO Picture unit tests


    /*
     * Test the picture /POST route
     */
    let firstProductId;
    let firstPictureId = "";
    describe('/POST Pictures', () =>{

        it('should get the id of the first product', (done)=>{
            chai.request(app)
                .get('/api/produkter')
                .end((err, res) =>{
                    firstProductId = mongoose.Types.ObjectId(res.body[0]._id);
                    done();
                });
        });


        it('should fail to upload a picture',  (done) => {
            chai.request(app)
                .post('/api/produkter/'+firstProductId+'/uploadbilleder')
                .set('content-type', 'image/jpeg')
                .send()
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.success.should.eql(false);
                    done();
                });
        });



        it('should upload a picture to the first product',  (done) => {
            chai.request(app)
                .post('/api/produkter/'+firstProductId+'/uploadbilleder')
                .attach('product', './test/test.jpg', 'test.jpg')
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.success.should.eql(true);
                    res.body._ids.length.should.eql(1);
                    firstPictureId = res.body._ids[0];
                    done();
                });
        });

        it('should get the path to the images (1) of the first product', (done) =>{
          chai.request(app)
              .get('/api/produkter/'+firstProductId+'/billeder')
              .end((err, res) =>{
                  res.body.should.be.an('array');
                  res.body.length.should.eql(1);
                  res.body[0].should.contain(firstPictureId);
                  done()
              });
        });
    });

    /*
     * Test the /PUT route
     */
    describe('UPDATE/PUT Product', () =>{

        it('should update the name and desc of the first product in the db', (done) =>{
            chai.request(app)
                .put('/api/produkter/'+firstProductId)
                .send({name: 'Updated Name', desc: 'Updated Description', price : 30})
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    done();
                })
        });

        it('should have the first product updated', (done)=>{
           chai.request(app)
               .get('/api/produkter')
               .end((err, res)=>{
                   res.body[0].name.should.be.eql('Updated Name');
                   res.body[0].description.should.be.eql('Updated Description');
                   res.body[0].price.should.be.eql(30);
                   done();
               })
        });
    });

    /*
     * Test the /DELETE route
     */
    describe('/DELETE Product', () =>{

        it('should delete the first product in the db', (done) =>{
            chai.request(app)
                .delete('/api/produkter/'+firstProductId)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    done();
                })
        });

        it('should get an empty list', (done) =>{
            chai.request(app)
                .get('/api/produkter')
                .end((err,res) =>{
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(0);
                    done();
                })
        });
    });

    describe('Picture update and delete', () => {

        it('should create a product', (done) =>{
            chai.request(app)
                .post('/api/produkter')
                .set('content-type', 'application/json')
                .send({name:'unittest name', desc:'unittest description', unique:false, amount:10, categories:['unittest category 1', 'unittest category 2'], price:100})
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.success.should.eql(true);
                    done();
                });
        });

        it('should get the id of the first product', (done)=>{
            chai.request(app)
                .get('/api/produkter')
                .end((err, res) =>{
                    firstProductId = mongoose.Types.ObjectId(res.body[0]._id);
                    done();
                });
        });

        it('should upload a picture to the first product',  (done) => {
            chai.request(app)
                .post('/api/produkter/'+firstProductId+'/uploadbilleder')
                .attach('product', './test/test.jpg', 'test.jpg')
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.success.should.eql(true);
                    res.body._ids.length.should.eql(1);
                    firstPictureId = res.body._ids[0];
                    done();
                });
        });

        it('should get the path to the images (1) of the first product', (done) =>{
            chai.request(app)
                .get('/api/produkter/'+firstProductId+'/billeder')
                .end((err, res) =>{
                    res.body.should.be.an('array');
                    res.body.length.should.eql(1);
                    res.body[0].should.contain(firstPictureId);
                    done();
                });
        });

        it('should delete the picture from the first product', (done) =>{
            chai.request(app)
                .delete('/api/produkter/'+firstProductId+'/sletBilleder')
                .send({ pictures: [firstPictureId] })
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    done();
                })
        });

        it('should get a product with no pictures', (done) =>{
            chai.request(app)
                .get('/api/produkter')
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body[0].pictures.length.should.be.eql(0);
                    done();
                })
        })


    })


});

