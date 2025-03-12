import { useEffect, useState } from "react";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/supplier");
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }
        const data = await response.json();
        setSuppliers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleConfirmOrder = () => {
    alert(`Order confirmed with ${selectedSupplier.name}`);
  };

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-16 mb-4 relative">
      <h1 className="text-3xl font-bold mb-4">Suppliers:</h1>
      {suppliers.length === 0 ? (
        <p>No suppliers available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <div
              key={supplier._id}
              className={`flex items-center border p-4 rounded-lg shadow-md bg-white cursor-pointer ${
                selectedSupplier?._id === supplier._id
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
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
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{supplier.name}</h2>
                <p className="text-sm text-gray-500">
                  Available Products: {supplier.availableProducts}
                </p>
                <p className="text-sm text-gray-500">
                  Contact: {supplier.phone || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Address: {supplier.address || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Order Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleConfirmOrder}
            disabled={!selectedSupplier}
            className={`w-full py-2 cursor-pointer rounded-lg font-semibold text-white transition ${
              selectedSupplier
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
