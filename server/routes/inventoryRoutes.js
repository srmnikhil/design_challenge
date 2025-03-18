const express = require("express");
const InventoryController = require("../controllers/InventoryController");
const router = express.Router();

const inventoryController = new InventoryController();

// POST: Add inventory for a supplier
router.post("/:supplierId", inventoryController.addInventory);

// GET: Get inventory of a supplier
router.get("/:supplierId", inventoryController.getInventory);

// GET: Get all inventories (optional)
router.get("/", inventoryController.getAllInventories);

// PUT: Update inventory item for a supplier
router.put("/:inventoryId/:skuId", inventoryController.updateInventoryItemStock);

module.exports = router;
