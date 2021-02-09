const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: [/[A-Za-z0-9 ]+/, 'Product name is not valid'],
    minlength: 5
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
    match: [/[A-Za-z0-9 ,.]+/, 'Product description is not valid'],
    minlength: 20
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 10000
  },
  accessories: [{
    type: 'ObjectId',
    ref: 'Accessory'
  }],
  creatorId: {
    type: 'ObjectId',
    ref: 'User'
  }
})

ProductSchema.path('imageUrl').validate(function(url) {
  return url.startsWith('http://') || url.startsWith('https://')
}, 'Image url is not valid')

module.exports = mongoose.model('Product', ProductSchema)