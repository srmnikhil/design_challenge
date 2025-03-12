import useCart from "../hooks/useCart";
import { FaTrashAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, modifyQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (partId, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      modifyQuantity(partId, num, "set");
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty. Add items before placing an order!");
      return;
    }
    navigate("/suppliers");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl flex items-center font-bold mb-4">
        <IoArrowBack
          className="cursor-pointer mr-2 hover:text-gray-400"
          size={24}
          onClick={() => navigate("/")}
        />
        Your Cart
      </h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-600 text-center">
            Your cart is empty.
            <br />
            Add some items to your cart to proceed.
          </p>
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.partId}
              className="flex items-center border p-4 rounded-lg shadow-md bg-white"
            >
              {/* Image */}
              <img
                src="image.png"
                alt={item.part_name}
                className="w-24 h-24 object-contain mr-4"
              />

              {/* Item Details */}
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.part_name}</h2>
                <p className="text-sm text-gray-500">
                  {item.part_type} - {item.brand_name}
                </p>
                <p className="text-sm text-gray-500">
                  Part Number: {item.part_number}
                </p>
                <p className="text-green-600 font-semibold">
                  ₹{item.price.toFixed(2) * item.quantity}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-1">
                <button
                  className="bg-red-500 text-white px-2 py-0.5 cursor-pointer rounded hover:bg-red-600"
                  onClick={() =>
                    modifyQuantity(item.partId, item.quantity, "decrease")
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  className="w-12 border text-center"
                  onChange={(e) =>
                    handleQuantityChange(item.partId, e.target.value)
                  }
                />
                <button
                  className="bg-green-500 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-green-600"
                  onClick={() =>
                    modifyQuantity(item.partId, item.quantity, "increase")
                  }
                >
                  +
                </button>
              </div>

              {/* Delete Button */}
              <button
                className="ml-4 text-red-600 cursor-pointer hover:text-red-800"
                onClick={() => removeFromCart(item.partId)}
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          ))}

          {/* Place Order Button */}
          <button
            className="w-full bg-blue-600 text-white py-3 cursor-pointer rounded-lg mt-4 hover:bg-blue-700"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
