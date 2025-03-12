const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, bulkInsertProducts } = require('../controllers/productController');

// POST: Create a new product
router.post('/', createProduct);

// POST: Bulk insert products
router.post('/bulk-insert', bulkInsertProducts);

// GET: Fetch all products
router.get('/', getProducts);

// PUT: Update one product (all details or single detail)
router.put('/:id', updateProduct);

module.exports = router;