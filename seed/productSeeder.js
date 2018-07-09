var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');

var products = [
     new Product({
        imagePath: 'https://media03.toms.com/static/www/images/Womens-Shoes/2018/JANLAUNCH/10011752-BlueSlubChambrayWomensDelRey-P-1450x1015.jpg',
        title: 'BLUE SLUB CHAMBRAY WOMEN\'S DEL REY SNEAKERS',
        description: 'An athletic-inspired sneaker that plays well with others. Comfortable and versatile, we really love the simplicity of the Del Rey.',
        price: 89.99
      }),
      new Product({
         imagePath: 'https://dsw.scene7.com/is/image/DSWShoes/404995_001_ss_01?$pdp-thumb$',
         title: 'VANS WARD LO SUEDE SNEAKER',
         description: 'Hit up the skate park or show off your casual street style in the Ward low-top sneaker from Vans.',
         price: 59.99
       }),
       new Product({
          imagePath: 'https://dsw.scene7.com/is/image/DSWShoes/308527_231_ss_05?$pdp-image$',
          title: 'TIMBERLAND BASIC 6IN BOOTS',
          description: 'Classic Timberland style and comfort are what you will find in the Basic 6 inch boot! This waterproof nubuck lace-up has a padded collar for added comfort and is built to be sturdy and comfortable',
          price: 149.99
        })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err,result){
    done++;
    if (done === products.length) {
      exit();
    }
  });
}
function exit(){
  mongoose.disconnect();
}
