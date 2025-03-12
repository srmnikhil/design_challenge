const mongoose = require("mongoose");
const Inventory = require("./models/Inventory");
const Supplier = require("./models/Supplier");
const Sku = require("./models/Sku");

// MongoDB Connection
const mongoURI = "mongodb+srv://srmnikhilswn:elhMYRhOJWkJatL6@systemdesigncluster.ts5en.mongodb.net/inventorySystem?retryWrites=true&w=majority&appName=systemdesigncluster";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Random functions for stock generation
const getRandomStock = () => Math.floor(Math.random() * 20) + 1;
const getLimitedStock = () => Math.floor(Math.random() * 5) + 1;

// Random function to pick 20-30 unique SKUs
const getRandomSkus = (skus) => {
  const shuffled = skus.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (30 - 20 + 1)) + 20);
};

// Function to create random inventory
const createRandomInventory = async () => {
  try {
    // Fetch suppliers and SKUs directly from MongoDB
    const suppliers = await Supplier.find({}, "_id");
    const skus = await Sku.find({}, "_id");

    if (suppliers.length === 0 || skus.length === 0) {
      console.log("No suppliers or SKUs found in the database.");
      return;
    }

    for (const supplier of suppliers) {
      const selectedSkus = getRandomSkus(skus);
      const items = selectedSkus.map((sku) => ({
        skuId: sku._id,
        stock: Math.random() < 0.2 ? getLimitedStock() : getRandomStock(),  // 20% chance of limited stock
      }));

      // Create inventory document
      const newInventory = new Inventory({
        supplierId: supplier._id,
        items,
      });

      await newInventory.save();
      console.log(`Inventory created for Supplier ID: ${supplier._id} with ${items.length} items`);
    }

    console.log("✅ All inventories created successfully!");
  } catch (err) {
    console.error("Error creating inventory:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createRandomInventory();
