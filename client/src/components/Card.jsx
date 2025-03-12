import useCart from "../hooks/useCart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = ({
  partId,
  part_name,
  part_number,
  part_type,
  brand_name,
  price,
  part_description
}) => {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const foundInCart = cart.some((item) => item.partId === partId);
    setIsInCart(foundInCart);
  }, [cart, partId]);

  return (
    <div className="max-w-[18rem] rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-38 object-contain"
        src="image.png"
        alt={part_name || "Vehicle Part"}
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {part_name || "Vehicle Part Name"}
        </h2>
        <div className="text-gray-600 text-sm mb-4">
          <p>
            {part_description}
          </p>
          <p>
            <span className="font-semibold">Brand:</span>{" "}
            {brand_name || "Generic"}
          </p>
          <p>
            <span className="font-semibold">Part Number:</span>{" "}
            {part_number || "N/A"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-green-600">
            ₹{price ? price.toFixed(2) : "N/A"}
          </span>
          <button
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              isInCart
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } cursor-pointer`}
            onClick={() => {
              if (isInCart) {
                navigate("/cart"); // Navigate to cart
              } else {
                addToCart({
                  partId,
                  part_name,
                  part_number,
                  brand_name,
                  price,
                  part_type
                }); // Add to cart
              }
            }}
          >
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
