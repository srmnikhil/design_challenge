import { useEffect, useState } from "react";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Simulate fetching supplier data based on cart items
    const fetchSuppliers = async () => {
      // For now, just a placeholder list of suppliers
      // You can later modify this to dynamically fetch based on product availability
      const suppliersList = [
        { id: 1, name: "Supplier A", availableProducts: 10 },
        { id: 2, name: "Supplier B", availableProducts: 5 },
        { id: 3, name: "Supplier C", availableProducts: 0 },
      ];

      setSuppliers(suppliersList);
    };

    fetchSuppliers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Suppliers</h1>
      {suppliers.length === 0 ? (
        <p>No suppliers available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="flex items-center border p-4 rounded-lg shadow-md bg-white"
            >
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{supplier.name}</h2>
                <p className="text-sm text-gray-500">
                  Available Products: {supplier.availableProducts}
                </p>
              </div>
              <button
                className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => alert(`Proceeding with ${supplier.name}`)}
              >
                Select Supplier
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
