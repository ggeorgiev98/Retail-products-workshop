const { Router } = require('express')
const { getAllProducts } = require('../controllers/product')
const { getUserStatus } = require('../controllers/user')

const router = Router()

router.get('/', getUserStatus, async (req, res) => {
  const products = await getAllProducts()

  res.render('index', {
    title: 'Exercise project SoftUni',
    products,
    isLoggedIn: req.isLoggedIn
  })
})

router.get('/logout', (req, res) => {
  res.clearCookie('aid')
  res.clearCookie("id")
  res.clearCookie("username")

  res.redirect('/')
})

router.get('/about', getUserStatus, (req, res) => {
  res.render('about', {
    title: 'About | SoftUni-Project',
    isLoggedIn: req.isLoggedIn
  })
})


module.exports = router