const express = require("express");
const InventoryController = require("../controllers/InventoryController");

const router = express.Router();

// POST: Add inventory for a supplier
router.post("/:supplierId", InventoryController.addInventory);

// GET: Get inventory of a supplier
router.get("/:supplierId", InventoryController.getInventory);

// GET: Get all inventories (optional)
router.get("/", InventoryController.getAllInventories);

// PUT: Update inventory item for a supplier
router.put("/:inventoryId/:skuId", InventoryController.updateInventoryItemStock);

module.exports = router;
