var express = require('express');
var router = express.Router();

var Product = require('../models/product');

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

module.exports = router;
