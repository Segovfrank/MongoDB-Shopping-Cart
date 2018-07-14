var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csurfProtection = csrf();
router.use(csurfProtection);

var assert = require('assert');
var mongo = require('mongoose');
var url = 'mongodb://localhost:27017/shopping';

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

router.get('/user/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
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

                Product.find(function(err, docs){
                  var productChucks = [];
                  var chunkSize = 3;
                  for (var i = 0; i < docs.length; i += chunkSize) {
                    productChucks.push(docs.slice(i, i + chunkSize));
                  }
                  res.render('shop/index', { title: 'MongoDB Shopping Cart', products: productChucks });

                });
              });



router.post('/update',function(req,res,next){

            });

router.post('/delete',function(req,res,next){

            });


module.exports = router;
