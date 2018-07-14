var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Order = require('../models/order');

var Product = require('../models/product');
var mongo = require('mongoose'); //mongoose
var ObjectID = require('mongodb').ObjectID;
var csrf = require('csurf');
var passport = require('passport');
var Product = require('../models/product');
var csurfProtection = csrf();
router.use(csurfProtection);
var assert = require('assert');
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

router.get('/add-to-cart/:id', function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}, totalQty: 0, totalPrice: 0});

    Product.findById(productId, function(err, product){
      if (err) {
        return res.redirect('/');
      }

      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
    });

});

router.get('/shopping-cart', function(req,res,next){
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateItemsArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req,res,next){
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice});
});


router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
    });
    order.save(function(err, result) {
        req.flash('success', 'Purchase completed!, your order has been placed');
        req.session.cart = null;
        res.redirect('/');
    });
});

router.get('/dashboard',function(req,res,next){
               res.render('shop/dashboard', {csrfToken: req.csrfToken()} );
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
                  db.collection('products').save(product,function(err,result){
                    assert.equal(null,err);
                    console.log("PRODUCT INSERTED");
                    db.close();
                  });
                });
/*
                mongo.connect(url,function(err,db){
                    assert.equal(null,err);
                    db.collection('products').insert(product, function(err,result){ // callback function too
                        assert.equal(null, err);
                        console.log("Product inserted...");
                        db.close();
                    });
                });*/

                Product.find(function(err, docs){
                  var productChucks = [];
                  var chunkSize = 3;
                  for (var i = 0; i < docs.length; i += chunkSize) {
                    productChucks.push(docs.slice(i, i + chunkSize));
                  }
                  res.render('shop/index', { title: 'MongoDB Shopping Cart', products: productChucks });

                });

              });

router.get('/getData',function(req,res,next){
          var resultArray= [];
            mongo.connect(url,function(err,db){
              assert.equal(null,err);
              var cursor = db.collection('products').find();
              cursor.forEach(function(doc,err){
                assert.equal(null,err);
                resultArray.push(doc);
              }, function(){
                db.close();
                res.render('shop/index',{products:resultArray});
              });
            });
          });

router.post('/update',function(req,res,next){
              var product = {
                  imagePath: req.body.productImg,
                  title: req.body.productName,
                  description: req.body.productDescription,
                  price: req.body.productPrice
              };

              var id = req.body.id;

              mongo.connect(url,function(err,db){
                assert.equal(null,err);
                db.collection('products').update({"_id":ObjectID(id)},{$set:product},function(err,result){
                  assert.equal(null,err);
                  console.log("PRODUCT MODIFIED");
                  db.close();
                });
              });
            });

router.post('/delete',function(req,res,next){
              var id = req.body.id;

              mongo.connect(url,function(err,db){
                assert.equal(null,err);
                db.collection('products').deleteOne({"_id":ObjectID(id)},function(err,result){
                  assert.equal(null,err);
                  console.log("PRODUCT DELETED");
                  db.close();
                });
              });
            });



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
