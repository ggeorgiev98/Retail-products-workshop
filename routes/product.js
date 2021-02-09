const env = process.env.NODE_ENV || 'development'

const express = require('express')
const jwt = require('jsonwebtoken')
const Product = require('../models/product')
const { authAccess, getUserStatus } = require('../controllers/user')
const { getProductWithAccessories, searchProducts } = require('../controllers/product')
const config = require('../config/config')[env]
const router = express.Router()

router.get('/edit/:id', authAccess, getUserStatus, async (req, res) => {
  
  const product = await getProductWithAccessories(req.params.id)

  res.render('editProductPage', {
    isLoggedIn: req.isLoggedIn,
    title: "Edit a product",
    ...product
  })
})

router.post('/edit/:id', authAccess, async (req, res) => {
  const { id } = req.params
  const { name, description, imageUrl, price } = req.body

  console.log(id)
  await Product.findByIdAndUpdate( id, { name, description, imageUrl, price})

  res.redirect(`/details/${id}`)
})

router.get('/delete', authAccess, getUserStatus, (req, res) => {
  res.render('deleteProductPage', {
    isLoggedIn: req.isLoggedIn
  })
})

router.get('/details/:id', getUserStatus, async (req, res) => {

  const product = await getProductWithAccessories(req.params.id)
  let isCreator = false

  if(product.creatorId.toString() == req.user._id.toString()) {
    isCreator = true
  }

  res.render('details', {
    title: 'Details | Product Workshop',
    ...product,
    isLoggedIn: req.isLoggedIn,
    isCreator: isCreator
  })
})

router.post('/search', getUserStatus, async (req, res) => {
  let {
    search,
    from,
    to
  } = req.body

  if(from === '') {
    from = '1'
  }

  if(to === '') {
    to = '10000'
  }

  const products = await searchProducts(search, from, to)

  res.render('index', {
    products,
    isLoggedIn: req.isLoggedIn
  })


})


router.get('/create', authAccess, getUserStatus, (req, res) => {
  res.render('create', {
    title: 'Create Product | Product Workshop',
    isLoggedIn: req.isLoggedIn
  })
})

router.post('/create', authAccess, async (req, res) => {
  const {
    name,
    description,
    imageUrl,
    price
  } = req.body

  const token = req.cookies['aid']
  const decodedObject = jwt.verify(token, config.privateKey)

  const product = new Product({
    name: name.trim(),
    description: description.trim(),
    imageUrl,
    price,
    creatorId: decodedObject.userID
  })

  try {
    await product.save()
    return res.redirect('/')
  } catch (err) {
    return res.render('create', {
      title: 'Create Product | Product Workshop',
      isLoggedIn: req.isLoggedIn,
      error: 'Product details are not valid'
    })
  }

})


module.exports = router