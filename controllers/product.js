const Product = require('../models/product')
const Accessory = require('../models/accessory')

const getAllProducts = async () => {
  const products = await Product.find().lean()
  return products
}

const getProduct = async (id) => {
  const product = await Product.findById(id).lean()

  return product
}

const getProductWithAccessories = async (id) => {
  const product = await Product.findById(id).populate('accessories').lean()

  return product
}

const updateProduct = async (productId, accessoryId) => {
  try {
    await Product.findByIdAndUpdate(productId, {
      $addToSet: {
        accessories: [accessoryId],
      },
    });
    await Accessory.findByIdAndUpdate(accessoryId, {
      $addToSet: {
        products: [productId],
      },
    })
  } catch (err) {
    return err
  }
}

const searchProducts = async (search, from, to) => {
  let products = await Product.find({name: { $regex: search, $options: "i" }}).lean()
  
  products = products.filter(x => +x.price >= +from && +x.price <= +to )

  return products
}


module.exports = {
  getAllProducts,
  getProduct,
  updateProduct,
  getProductWithAccessories,
  searchProducts
}