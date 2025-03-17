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

module.exports = {getScore};