const { ObjectId } = require('mongodb');
const { Supplier } = require('../models');
const SkuService = require('./SkuService');
const SupplierRanker = require('./SupplierRanker');

class SupplierService {
  constructor() {
    this.skuService = new SkuService();
    this.ranker = new SupplierRanker();
  }

  async createSupplier(data) {
    return Supplier.create(data);
  }

  async getSuppliers() {
    return Supplier.find();
  }

  async updateSupplier(id, data) {
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedSupplier) throw new Error("Supplier not found");
    return updatedSupplier;
  }

  async deleteSupplier(id) {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) throw new Error("Supplier not found");
    return deletedSupplier;
  }

  async bulkInsertSuppliers(suppliers) {
    if (!Array.isArray(suppliers) || suppliers.length === 0) {
      throw new Error("Invalid or empty suppliers list");
    }
    return Supplier.insertMany(suppliers, { ordered: false });
  }

  async getRankedSuppliers(skuIdsWithRequirement) {
    const skuIds = skuIdsWithRequirement.map((item) => item.skuId);
    const skus = await this.skuService.getSkuByIDs(skuIds);
    const objectIds = skuIds.map((id) => ObjectId.createFromHexString(id));

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

    const rankedSuppliers = this.ranker.rank(suppliers, skuIdsWithRequirement);

    for (const supplier of rankedSuppliers) {
      supplier.items = this.#enrichItems(supplier.items, skus, skuIdsWithRequirement);
      this.#addMissingItems(supplier, skuIdsWithRequirement, skus);
      // Safely sort items, handling missing itemDetail
      supplier.items.sort((a, b) => {
        const aName = a.itemDetail?.part_name || '';
        const bName = b.itemDetail?.part_name || '';
        return aName.localeCompare(bName);
      });
    }

    return rankedSuppliers;
  }

  #enrichItems(items, skus, skuIdsWithRequirement) {
    const skuMap = new Map(skus.map((sku) => [sku._id.toString(), sku]));
    const reqMap = new Map(skuIdsWithRequirement.map((req) => [req.skuId, req.requirement]));
    return items.map((item) => ({
      ...item,
      itemDetail: skuMap.get(item.skuId.toString()),
      requirement: reqMap.get(item.skuId.toString()),
    }));
  }

  #addMissingItems(supplier, skuIdsWithRequirement, skus) {
    const skuMap = new Map(skus.map((sku) => [sku._id.toString(), sku]));
    for (const { skuId, requirement } of skuIdsWithRequirement) {
      if (!supplier.items.find((item) => item.skuId.toString() === skuId)) {
        supplier.items.push({
          skuId,
          stock: null,
          requirement,
          itemDetail: skuMap.get(skuId),
        });
      }
    }
  }
}

module.exports = SupplierService;