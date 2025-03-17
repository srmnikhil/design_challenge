const mongoose = require('mongoose');
const { Sku } = require('../models');

class SkuService {
  async getSkuByIDs(skuIDs) {
    if (!skuIDs.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('Invalid SKU ID format');
    }
    const skus = await Sku.find({ _id: { $in: skuIDs } }).lean();
    if (!skus.length) throw new Error('No SKUs found for provided IDs');
    return skus;
  }
}

module.exports = SkuService;