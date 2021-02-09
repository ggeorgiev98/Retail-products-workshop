const Accessory = require('../models/accessory')
const Product = require('../models/product')

const getAccessories = async () => {
  const accessories = await Accessory.find().lean()

  return accessories
}

const attachedAccessories = async (productId) => {
  try {
    const product = await Product.findById(productId).lean()
    const accessories = await Accessory.find({ products: { $nin: productId } }).lean()
    return { product, accessories }
  } catch (err) {
    return err
  }
}

module.exports = {
  getAccessories,
  attachedAccessories
}