var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var assert = require('assert');
var mongo = require('mongoose');
var url = 'mongodb://localhost:27017/shopping';
//var dbName = database.db('mongodb://localhost:27017/shopping');



/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
    var productChucks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChucks.push(docs.slice(i, i + chunkSize));
    }

    res.render('shop/index', { title: 'MongoDB Shopping Cart', products: productChucks });
  });
});

router.get('/dashboard',function(req,res,next){
               res.render('shop/dashboard');

           });

router.post('/insert',function(req,res,next){
                var product = {
                    imagePath: req.body.productImg,
                    title: req.body.productName,
                    description: req.body.productDescription,
                    price: req.body.productPrice
                };

                mongo.connect(url,function(err,db){
                    assert.equal(null,err);
                    db.collection('products').insert(product, function(err,result){ // callback function too
                        assert.equal(null, err);
                        console.log("Product inserted...");
                        db.close();
                    });
                });
<<<<<<< HEAD

=======
>>>>>>> 67715580b53df9c66b5c1178cf81c38174d074d3
                Product.find(function(err, docs){
                  var productChucks = [];
                  var chunkSize = 3;
                  for (var i = 0; i < docs.length; i += chunkSize) {
                    productChucks.push(docs.slice(i, i + chunkSize));
                  }
<<<<<<< HEAD
                  res.render('shop/index', { title: 'MongoDB Shopping Cart', products: productChucks });

                });
              });
=======

                  res.render('shop/index', { title: 'MongoDB Shopping Cart', products: productChucks });
                });
            });
>>>>>>> 67715580b53df9c66b5c1178cf81c38174d074d3

router.post('/update',function(req,res,next){

            });

router.post('/delete',function(req,res,next){

            });

module.exports = router;
