class SupplierRanker {
    constructor() {
        this.priorityRules = {
            none: 1,
            lessOnly: 2,
            missingOnly: 3,
            both: 4,
        };
    }

    rank(suppliers, skuIdsWithRequirement) {
        suppliers.forEach((supplier) => {
            const score = this.#calculateScore(supplier.items, skuIdsWithRequirement);
            Object.assign(supplier, score);
        });

        return suppliers.sort((a, b) =>
            a.priority - b.priority ||
            b.uniquePartsFulfilled - a.uniquePartsFulfilled ||
            b.totalAvailablity - a.totalAvailablity
        );
    }

    #calculateScore(skuIdsWithStock, skuIdsWithRequirement) {
        let somethingMissing = false;
        let somethingLess = false;
        let totalAvailablity = 0;
        let uniquePartsFulfilled = 0;

        for (const sku of skuIdsWithRequirement) {
            const availability = skuIdsWithStock.find((item) => item.skuId.toString() === sku.skuId);
            if (availability) {
                uniquePartsFulfilled++;
                const availableStock = availability.stock ?? 0;
                if (availableStock < sku.requirement) somethingLess = true;
                totalAvailablity += availableStock;
            } else {
                somethingMissing = true;
            }
        }

        const priority = (!somethingMissing && !somethingLess) ? this.priorityRules.none :
            (!somethingMissing && somethingLess) ? this.priorityRules.lessOnly :
                (somethingMissing && !somethingLess) ? this.priorityRules.missingOnly :
                    this.priorityRules.both;

        return { totalAvailablity, somethingMissing, somethingLess, priority, uniquePartsFulfilled };
    }
}

module.exports = SupplierRanker;