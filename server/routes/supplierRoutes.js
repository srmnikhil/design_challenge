const express = require("express");
const SupplierController = require("../controllers/SupplierController");
const SupplierService = require("../services/SupplierService");

const router = express.Router();

// Instantiate classes
const supplierService = new SupplierService();
const supplierController = new SupplierController(supplierService);

// Routes
router.post("/", supplierController.createSupplier.bind(supplierController));
router.get("/", supplierController.getSuppliers.bind(supplierController));
router.put("/:id", supplierController.updateSupplier.bind(supplierController));
router.delete("/:id", supplierController.deleteSupplier.bind(supplierController));
router.post("/bulk-insert", supplierController.bulkInsertSuppliers.bind(supplierController));
router.post("/rank-suppliers", supplierController.rankSuppliers.bind(supplierController));

module.exports = router;