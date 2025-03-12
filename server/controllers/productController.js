const Product = require('../models/Sku.js');

// POST: Create a new product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Fetch all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: Update all or single detail of a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Bulk Insert Products
const bulkInsertProducts = async (req, res) => {
  const products = req.body; // Expecting an array of products in the request body

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty product list' });
  }

  try {
    const result = await Product.insertMany(products, { ordered: false }); // Insert even if some fail
    res.status(201).json({ message: 'Products inserted successfully', insertedCount: result.length });
  } catch (error) {
    res.status(400).json({ message: 'Error inserting products', error: error.message });
  }
};

module.exports = { createProduct, getProducts, updateProduct, bulkInsertProducts };