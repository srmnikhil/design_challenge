const Supplier = require("../models/Supplier");

// POST: Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Fetch all suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT: Update supplier details
const updateSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE: Remove a supplier
const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Bulk Insert Products
const bulkInsertSuppliers = async (req, res) => {
  const suppliers = req.body; // Expecting an array of suppliers in the request body

  if (!Array.isArray(suppliers) || suppliers.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty suppliers list' });
  }

  try {
    const result = await Supplier.insertMany(suppliers, { ordered: false }); // Insert even if some fail
    res.status(201).json({ message: 'Suppliers inserted successfully', insertedCount: result.length });
  } catch (error) {
    res.status(400).json({ message: 'Error inserting suppliers', error: error.message });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  bulkInsertSuppliers
};
