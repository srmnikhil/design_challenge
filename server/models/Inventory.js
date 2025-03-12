const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  items: [
    {
      skuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sku",
        required: true
      },
      stock: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Inventory", InventorySchema);
