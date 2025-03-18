const Inventory = require("../models/Inventory");

class InventoryController {
  async addInventory(req, res) {
    const { supplierId } = req.params;
    const { items } = req.body;

    try {
      // Ensure items contain only skuId and stock even if got extra entries
      const sanitizedItems = items.map(({ skuId, stock }) => ({ skuId, stock }));

      const inventory = await Inventory.create({ supplierId, items: sanitizedItems });
      res.status(201).json(inventory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getInventory(req, res) {
    const { supplierId } = req.params;

    try {
      const inventory = await Inventory.findOne({ supplierId }).populate("items.skuId");
      if (!inventory) return res.status(404).json({ message: "Inventory not found" });

      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateInventoryItemStock(req, res) {
    const { inventoryId, skuId } = req.params;
    const { stock } = req.body;

    try {
      const inventory = await Inventory.findOneAndUpdate(
        { _id: inventoryId, "items.skuId": skuId },
        { $set: { "items.$.stock": stock } },
        { new: true, runValidators: true } 
      );

      if (!inventory) return res.status(404).json({ message: "Inventory or Item not found" });

      res.status(200).json(inventory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllInventories(req, res) {
    try {
      const inventories = await Inventory.find().populate("items.skuId");
      res.status(200).json(inventories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Export the instance of InventoryController
module.exports = InventoryController;