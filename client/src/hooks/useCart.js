import { useState, useEffect } from "react";

const useCart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        try {
            const cartData = localStorage.getItem("cart");
            if (cartData) {
                setCart(JSON.parse(cartData));
            }
        } catch (error) {
            console.error("Failed to load cart", error);
        }
    };

    const modifyQuantity = (part_number, quantity, actionType = "set") => {
        try {
            let updatedCart = cart.map((item) => {
                if (item.part_number === part_number) {
                    let newQuantity = quantity;

                    if (actionType === "increase") {
                        newQuantity += 1;
                    } else if (actionType === "decrease") {
                        newQuantity -= 1;
                        if (newQuantity < 1) newQuantity = 1;
                    }

                    console.log(`Updated quantity for part ${part_number} is: ${newQuantity}`);

                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCart(updatedCart);
        } catch (error) {
            console.error("Error modifying quantity", error);
        }
    };

    const addToCart = (part) => {
        try {
            const cartData = localStorage.getItem("cart");
            const existingCart = cartData ? JSON.parse(cartData) : [];

            const existingItem = existingCart.find((item) => item.part_number === part.part_number);

            if (existingItem) {
                console.log("Part already in cart:", part.part_name);
                return;
            }

            const newPart = {
                part_name: part.part_name,
                manufacturer_name: part.manufacturer_name,
                brand_name: part.brand_name,
                part_number: part.part_number,
                price: part.price,
                image_link: part.image_link,
                quantity: 1,
            };

            const updatedCart = [...existingCart, newPart];

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCart(updatedCart);

            console.log("Added to cart:", newPart);
        } catch (error) {
            console.error("Error adding to cart", error);
        }
    };

    const removeFromCart = (part_number) => {
        try {
            const updatedCart = cart.filter((item) => item.part_number !== part_number);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setCart(updatedCart);

            console.log("Removed from cart:", part_number);
        } catch (error) {
            console.error("Error removing from cart", error);
        }
    };

    return { cart, addToCart, removeFromCart, modifyQuantity };
};

export default useCart;
