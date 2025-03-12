const mongoose = require("mongoose");

const SkuSchema = new mongoose.Schema({
    part_name: {
        type: String,
        required: true
    },
    part_number: {
        type: String,
        required: true
    },
    part_description: {
        type: String,
    },
    part_type: {
        type: String,
        required: true
    },
    brand_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Sku", SkuSchema);
