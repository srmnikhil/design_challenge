const express = require("express");
const { addInventory, getInventory, updateInventoryItemStock, getAllInventories} = require("../controllers/inventoryController");

const router = express.Router();

// POST: Add inventory for a supplier
router.post("/:supplierId", addInventory);

// GET: Get inventory of a supplier
router.get("/:supplierId", getInventory);

// GET: Get all inventory
router.get("/", getAllInventories);

// PUT: Update inventory item for a supplier
router.put("/:inventoryId/:skuId", updateInventoryItemStock);

module.exports = router;
