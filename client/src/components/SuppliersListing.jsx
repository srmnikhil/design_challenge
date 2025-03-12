import { useState } from "react";

const priorityColors = {
  1: "bg-[#28A745]",  // Blue
  2: "bg-[#FFC107]",  // Light Gray
  3: "bg-[#FD7E14]",  // Dark Gray
  4: "bg-[#DC3545]"   // Dark Red / Maroon
};

const Suppliers = ({ suppliers }) => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  console.log("Suppliers as props", suppliers)
  const handleConfirmOrder = () => {
    alert(`Order confirmed with ${selectedSupplier.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-16 mb-4 relative">
      <h1 className="text-3xl font-bold mb-4">Suppliers:</h1>
      {suppliers.length === 0 ? (
        <p>No suppliers available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {Array.isArray(suppliers) ? suppliers.map((supplier) => (
            <div
              key={supplier._id}
              className={`flex items-center border p-4 rounded-lg shadow-md  cursor-pointer ${selectedSupplier?._id === supplier._id
                ? "border-blue-500"
                : "border-gray-300"
                } ${priorityColors[supplier?.priority]
                }
              `}
              onClick={() => setSelectedSupplier(supplier)}
            >
              {/* Radio Button */}
              <input
                type="radio"
                name="supplier"
                checked={selectedSupplier?._id === supplier._id}
                onChange={() => setSelectedSupplier(supplier)}
                className="mr-4 cursor-pointer"
              />
              {/* Supplier Info */}
              <div className="p-4 border rounded-lg shadow-md bg-white">
                {/* Supplier Header */}
                <h2 className="text-xl font-semibold text-gray-900">{supplier.name}</h2>

                {/* Supplier Details */}
                <div className="mt-2 text-gray-600">
                  <p className="text-sm">
                    <span className="font-medium">Total Availability:</span> {supplier.totalAvailablity}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Contact:</span> {supplier.phone || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Address:</span> {supplier.address || "N/A"}
                  </p>
                </div>

                {/* Items List */}
                <div className="mt-4 space-y-3">
                  {supplier.items.map((item, index) => (
                    <div key={index} className="p-3 border rounded-md bg-gray-50">
                      <p className="text-sm font-medium text-gray-800">
                        Name: {item.itemDetail.part_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock:{" "}
                        {supplier.priority === 2 && item.requirement > item.stock ? (
                          <span className="flex items-center gap-2">
                            <del className="text-red-500">{item.requirement}</del>
                            <span className="text-green-600">{item.stock ? item.stock : "Not Available"}</span>
                          </span>
                        ) : (

                          <>
                            {item.stock ? item.stock : "Not Available"}

                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )) : "Something went wrong"}
        </div>
      )}

      {/* Confirm Order Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleConfirmOrder}
            disabled={!selectedSupplier}
            className={`w-full py-2 cursor-pointer rounded-lg font-semibold text-white transition ${selectedSupplier
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {selectedSupplier ? "Confirm Order" : "Select a supplier first"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
