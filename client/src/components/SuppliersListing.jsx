import { useState, useEffect } from "react";

const priorityColors = {
  1: "bg-green-500",
  2: "bg-yellow-500",
  3: "bg-orange-500",
  4: "bg-red-500",
};

const SuppliersListing = ({ suppliers, resetSelection }) => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [expandedSupplier, setExpandedSupplier] = useState(null);

  useEffect(() => {
    if (resetSelection) {
      setSelectedSupplier(null);
    }
    console.log(suppliers);
  }, [resetSelection]);

  const handleConfirmOrder = () => {
    if (!selectedSupplier) {
      alert("Please select a supplier first.");
      return;
    }

    const supplierDetails = selectedSupplier;
    let alertMessage = "";

    supplierDetails.items.forEach((item) => {
      if (item.stock === null) {
        alertMessage += `No stock available for ${item.itemDetail.part_name}. `;
      } else if (item.requirement > item.stock) {
        alertMessage += `Not enough stock for ${
          item.itemDetail.part_name
        }. Available stock: ${item.stock}. Please decrease quantity by ${
          item.requirement - item.stock
        }. `;
      }
    });

    if (alertMessage) {
      alert(alertMessage.trim());
    } else {
      alert(`Order confirmed with ${selectedSupplier.name}`);
      console.log("Selected Supplier:", selectedSupplier);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-4xl font-bold text-gray-900">Suppliers</h1>
      {suppliers.length === 0 ? (
        <p className="text-lg text-gray-500">
          No suppliers available at the moment.
        </p>
      ) : (
        <div className="space-y-6">
          {Array.isArray(suppliers) ? (
            suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className={`flex flex-col items-start border p-4 rounded-2xl shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
                  selectedSupplier?._id === supplier._id
                    ? "ring-2 ring-blue-500"
                    : "ring-1 ring-gray-300"
                } ${priorityColors[supplier.priority]}`}
                onClick={() => setSelectedSupplier(supplier)}
              >
                {/* Supplier Info */}
                <div className="flex w-full items-start">
                  {/* Radio Button */}
                  <input
                    type="radio"
                    name="supplier"
                    checked={selectedSupplier?._id === supplier._id}
                    onChange={() => setSelectedSupplier(supplier)}
                    className="mr-4 mt-1 cursor-pointer w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-semibold text-white">
                      {supplier.name}
                    </h2>
                    <p className="text-sm text-white">
                      <span className="font-medium">Total Availability:</span>{" "}
                      {supplier.totalAvailablity}
                    </p>
                    <p className="text-sm text-white">
                      <span className="font-medium">Contact:</span>{" "}
                      {supplier.phone || "N/A"}
                    </p>
                    <p className="text-sm text-white">
                      <span className="font-medium">Address:</span>{" "}
                      {supplier.address || "N/A"}
                    </p>
                  </div>
                </div>
                {/* Show/Hide Details Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedSupplier(
                      expandedSupplier === supplier._id ? null : supplier._id
                    );
                  }}
                  className="self-end text-black bg-white px-4 cursor-pointer transition-transform transform hover:font-bold text-sm mt-2 flex items-center space-x-1"
                >
                  <span>
                    {expandedSupplier === supplier._id
                      ? "Hide details"
                      : "Show details"}
                  </span>
                  <span className="text-lg">
                    {expandedSupplier === supplier._id ? "↑" : "↓"}
                  </span>
                </button>
                {/* Items List */}
                {expandedSupplier === supplier._id && (
                  <div className="mt-4 space-y-2 w-full">
                    {supplier.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg shadow"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          Name: {item.itemDetail.part_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock:{" "}
                          {supplier.priority === 2 &&
                          item.requirement > item.stock ? (
                            <span>
                              <del className="text-red-500">
                                {item.requirement}
                              </del>
                              <span className="text-green-600 mx-1">
                                {item.stock || "Not Available"}
                              </span>
                            </span>
                          ) : (
                            item.stock || "Not Available"
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Something went wrong</p>
          )}
        </div>
      )}

      {/* Confirm Order Button */}
      <div className="sticky bottom-0 w-full shadow-lg p-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleConfirmOrder}
            disabled={!selectedSupplier}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors ${
              selectedSupplier
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {selectedSupplier ? "Confirm Order" : "Select a supplier first"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuppliersListing;
