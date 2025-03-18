const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

const productController = new ProductController();

// POST: Create a new product
router.post('/', productController.createProduct);

// POST: Bulk insert products
router.post('/bulk-insert', productController.bulkInsertProducts);

// GET: Fetch all products
router.get('/', productController.getProducts);

// PUT: Update one product (all details or single detail)
router.put('/:id', productController.updateProduct);

module.exports = router;
