const mongoose = require('mongoose');
const { Sku } = require('../models');

const skuCache = new Map();

async function getSkuByIDs(skuIDs) {
    // Validate if all provided IDs are valid MongoDB ObjectIDs
    if (!skuIDs.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid ID format");
    }

    // Check cache first
    const cachedSkus = [];
    const missingIds = [];

    skuIDs.forEach(id => {
        if (skuCache.has(id)) {
            cachedSkus.push(skuCache.get(id));
        } else {
            missingIds.push(id);
        }
    });

    const start = Date.now();
    
    // Fetch only missing SKUs from DB
    if (missingIds.length > 0) {
        const dbSkus = await Sku.find({ _id: { $in: missingIds } });

        // Store fetched SKUs in cache
        dbSkus.forEach(sku => skuCache.set(sku._id.toString(), sku));
        
        // Combine cached and fetched SKUs
        cachedSkus.push(...dbSkus);
    }

    const end = Date.now();
    console.log(end - start, "ms");
    
    return cachedSkus;
}

module.exports = {
    getSkuByIDs
};
