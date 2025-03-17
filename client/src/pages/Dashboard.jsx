import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [vehicleParts, setVehicleParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://design-challenge-syoc.onrender.com/api/products");
        setVehicleParts(response.data);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  // Filter the parts based on the searchValue
  const filteredParts = vehicleParts.filter(
    (part) =>
      part.part_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      part.part_type.toLowerCase().includes(searchValue.toLowerCase()) ||
      part.brand_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      part.part_description.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow">
          Vehicle Parts
        </h1>
        <button
          onClick={() => navigate("/cart")}
          className="text-gray-700 hover:text-black transition cursor-pointer"
        >
          <ShoppingCartIcon fontSize="large" />
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar search={searchValue} setSearch={handleSearchChange} />

      {/* Parts Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
          {filteredParts.map((part) => (
            <Card
              key={part._id} // Use _id from MongoDB as the key
              partId={part._id}
              part_name={part.part_name}
              part_description={part.part_description}
              price={part.price}
              brand_name={part.brand_name}
              part_number={part.part_number}
              part_type={part.part_type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
