const { ObjectId } = require("mongodb");
const { Supplier } = require('../models');
const { getSkuByIDs } = require('./skuService');
const { rankSuppliers } = require('../utils/rankSuppliers');
const _ = require('lodash');

async function getRankedSuppliers(skuIdsWithRequirement) {
  const skuIds = skuIdsWithRequirement.map((_) => _.skuId);
  const skus = await getSkuByIDs(skuIds);

  // Convert skuIds to ObjectId format
  const objectIds = skuIds.map((id) => ObjectId.createFromHexString(id));

  // Fetch suppliers with aggregation
  const suppliers = await Supplier.aggregate([
    {
      $lookup: {
        from: "inventories",
        localField: "_id",
        foreignField: "supplierId",
        as: "inventory",
      },
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
            cond: { $in: ["$$item.skuId", objectIds] },
          },
        },
      },
    },
    {
      $lookup: {
        from: "skus",
        localField: "items.skuId",
        foreignField: "_id",
        as: "skuDetails",
      },
    },
    { $match: { items: { $ne: [] } } },
  ]);

  const rankedSuppliers = rankSuppliers(suppliers, skuIdsWithRequirement);

  // Enrich supplier items with details and requirements
  for (const rankedSupplier of rankedSuppliers) {
    rankedSupplier.items.forEach((item) => {
      const itemDetail = rankedSupplier.skuDetails.find(
        (sku) => item.skuId == sku._id.toString()
      );
      const requirementDetail = skuIdsWithRequirement.find(
        (requiredItem) => requiredItem.skuId == item.skuId
      );
      item.itemDetail = itemDetail;
      item.requirement = requirementDetail.requirement;
    });
    delete rankedSupplier.skuDetails; // Clean up
  }

  // Add missing items
  for (const rankedSupplier of rankedSuppliers) {
    for (const skuIdWithRequirement of skuIdsWithRequirement) {
      const { skuId, requirement } = skuIdWithRequirement;
      if (!rankedSupplier.items.find((_) => _.skuId == skuId)) {
        const requiredButNotFound = skus.find(
          (sku) => sku._id.toString() == skuId
        );
        rankedSupplier.items.push({
          skuId,
          stock: null,
          requirement,
          itemDetail: requiredButNotFound,
        });
      }
    }
  }

  // Sort items by part_name
  for (const rankedSupplier of rankedSuppliers) {
    rankedSupplier.items = _.orderBy(rankedSupplier.items, ['itemDetail.part_name'], ['asc'])
  }

  return rankedSuppliers;
}

module.exports = { getRankedSuppliers };