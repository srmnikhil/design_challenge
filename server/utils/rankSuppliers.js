const { getScore } = require("./getScore");
const _ = require('lodash');

function rankSuppliers(suppliers, skuIdsWithRequirement) {
  suppliers.forEach(supplier => {
      const { totalAvailablity, somethingMissing, uniquePartsFulfilled, somethingLess, priority } = getScore(supplier.items, skuIdsWithRequirement);
      Object.assign(supplier, { totalAvailablity, somethingMissing, somethingLess, uniquePartsFulfilled, priority });
  });

  return _.orderBy(suppliers, ['priority', 'uniquePartsFulfilled', 'totalAvailablity'], ['asc', 'desc', 'desc'])

  // return suppliers.sort((a, b) =>
  //     a.priority - b.priority ||
  //     b.uniquePartsFulfilled - a.uniquePartsFulfilled ||
  //     b.totalAvailablity - a.totalAvailablity
  // );
}

module.exports = { rankSuppliers };