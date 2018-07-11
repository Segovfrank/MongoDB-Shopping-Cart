var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csurfProtection = csrf();
router.use(csurfProtection);

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
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.legnth > 0})
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});


module.exports = router;
