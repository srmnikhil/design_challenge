import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Card from "../components/Card";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import vehicleParts from "../data/vehicleParts.json";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  // Filter the parts based on the searchValue
  const filteredParts = vehicleParts.filter((part) =>
    part.part_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    part.manufacturer_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    part.brand_name.toLowerCase().includes(searchValue.toLowerCase()) ||
    part.part_description.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow">
          Garaaz Vehicle Parts
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {filteredParts.map((part, index) => (
          <Card
            key={index} // Use a unique key (ideally part_number if unique)
            part_name={part.part_name}
            part_description={part.part_description}
            price={part.price}
            image_link={part.image_link}
            brand_name={part.brand_name}
            part_number={part.part_number}
            manufacturer_name={part.manufacturer_name}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
