const express = require("express");
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier, bulkInsertSuppliers} = require("../controllers/supplierController");

const router = express.Router();

// POST: Create a new supplier
router.post("/", createSupplier);

// GET: Fetch all suppliers
router.get("/", getSuppliers);

// POST: Insert Bulk Suppliers
router.post('/bulk-insert', bulkInsertSuppliers);

// PUT: Update supplier details
router.put("/:id", updateSupplier);

// DELETE: Delete supplier details
router.delete("/:id", deleteSupplier);

module.exports = router;
