const express = require("express");
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier, bulkInsertSuppliers } = require("../controllers/supplierController");
const { ObjectId } = require("mongodb");
const { Supplier, Sku } = require("../models");
const mongoose = require('mongoose');

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


router.post("/rank-suppliers", async (req, res) => {
    try {
        const { skuIdsWithRequirement } = req.body; // Get skuIds array from request body

        const skuIds = skuIdsWithRequirement.map((_) => _.skuId);

        if (!Array.isArray(skuIds) || skuIds.length === 0) {
            return res.status(400).json({ error: "skuIds must be a non-empty array" });
        }
        const skus = await getSkuByIDs(skuIds);

        // Convert skuIds to ObjectId format
        const objectIds = skuIds.map(id => ObjectId.createFromHexString(id)); // ✅ Alternative

        // Run aggregation
        const suppliers = await Supplier.aggregate([
            {
                $lookup: {
                    from: "inventories",
                    localField: "_id",
                    foreignField: "supplierId",
                    as: "inventory"
                }
            },
            { $unwind: "$inventory" },
            {
                $project: {
                    name: 1,
                    phone: 1,
                    address: 1,
                    items: {
                        $filter: {
                            input: "$inventory.items",
                            as: "item",
                            cond: { $in: ["$$item.skuId", objectIds] }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "skus",
                    localField: "items.skuId",
                    foreignField: "_id",
                    as: "skuDetails"
                }
            },

            { $match: { items: { $ne: [] } } }
        ]);

        const rankedSuppliers = rankSuppliers(suppliers, skuIdsWithRequirement);
        for (const rankedSupplier of rankedSuppliers) {
            rankedSupplier.items.forEach((item) => {
                console.log("Sku Details: %j ", rankedSupplier.skuDetails)

                const itemDetail = rankedSupplier.skuDetails.find(sku => item.skuId == sku._id.toString());
                const requirementDetail = skuIdsWithRequirement.find(requiredItem => requiredItem.skuId == item.skuId);
                console.log("Item Details for %s: %j ", item.skuId, itemDetail)
                item.itemDetail = itemDetail;
                item.requirement = requirementDetail.requirement;
            })
        }

        for (const rankedSupplier of rankedSuppliers) {
            delete rankedSupplier.skuDetails;
        }
        for (const rankedSupplier of rankedSuppliers) {

            for (const skuIdWithRequirement of skuIdsWithRequirement) {
                const { skuId, requirement } = skuIdWithRequirement;

                if(!rankedSupplier.items.find(_ => _.skuId == skuId)) {
                    const requiredButNotFound =  skus.find((sku) =>  sku._id.toString() == skuId);
                    rankedSupplier.items.push({
                        skuId,
                        stock: null,
                        requirement,
                        itemDetail: requiredButNotFound
                    });
                }
            }
        }

        for (const rankedSupplier of rankedSuppliers) {
            rankedSupplier.items = rankedSupplier.items.sort((a, b) => {
                return a.itemDetail.part_name.localeCompare(b.itemDetail.part_name)
            });
        }
        res.json(rankedSuppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

function rankSuppliers(suppliers, skuIdsWithRequirement) {
    try {
        for (const supplier of suppliers) {
            const { totalAvailablity, somethingMissing, uniquePartsFulfilled, somethingLess, priority } = getScore(supplier.items, skuIdsWithRequirement);
            supplier.totalAvailablity = totalAvailablity;
            supplier.somethingMissing = somethingMissing;
            supplier.somethingLess = somethingLess;
            supplier.uniquePartsFulfilled = uniquePartsFulfilled;
            supplier.priority = priority;
        }
        return suppliers.sort((a, b) => {
            console.log(b.uniquePartsFulfilled)
            return (
              a.priority - b.priority || // Step 1: Priority check
              b.uniquePartsFulfilled - a.uniquePartsFulfilled || // Step 2: Unique parts fulfilled check
              b.totalAvailablity - a.totalAvailablity // Step 3: Total availability check
            );
          });
    } catch (err) {
        console.log("Error Occured in rankSuppliers %s", err);
    }
}

async function getSkuByIDs(skuIDs) {
    // Validate if all provided IDs are valid MongoDB ObjectIDs
    if (!skuIDs.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    const skus = await Sku.find({ _id: { $in: skuIDs } });
    return skus;
}

function getScore(skuIdsWithStock, skuIdsWithRequirement) {
    const getPriority = (somethingMissing, somethingLess) => {
        if (!somethingMissing && !somethingLess) return 1;
        if (!somethingMissing && somethingLess) return 2;
        if (somethingMissing && !somethingLess) return 3;
        if (somethingMissing && somethingLess) return 4;

        // never be the case
        return 5;
    };
    try {
        let somethingMissing = false;
        let somethingLess = false;
        let totalAvailablity = 0;
        let uniquePartsFulfilled = 0;

        for (const sku of skuIdsWithRequirement) {
            const availability = skuIdsWithStock.find((_) => _.skuId == sku.skuId);

            if (availability) {
                uniquePartsFulfilled++;  // Increment when a part is found
                availableStock = availability.stock;
                if (availableStock < sku.requirement) {
                    somethingLess = true;
                }
                totalAvailablity += availableStock;
            } else {
                somethingMissing = true;
            }
        }
        let priority = getPriority(somethingMissing, somethingLess)
        return { totalAvailablity, somethingMissing, somethingLess, priority, uniquePartsFulfilled };
    } catch (err) {
        console.log("Error Occured in getScore %s", err);
    }
}


module.exports = router;
