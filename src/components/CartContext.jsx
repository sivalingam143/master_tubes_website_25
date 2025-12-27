import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false); // Added for auto-open
const clearCart = () => {
  setCartItems([]);
};
  const addToCart = (product, quantity) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );
      // Change this specific block in your addToCart function
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: quantity } // Change this: use 'quantity' instead of 'item.quantity + quantity'
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    // Automatically slide the cart open
    setShowCart(true);
  };


    const addToDetails = (product, quantity) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );
      // Change this specific block in your addToCart function
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: quantity } // Change this: use 'quantity' instead of 'item.quantity + quantity'
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    
  };
  // Ensure this function is defined!
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product_id !== productId)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart, // This was likely causing your error if undefined
        showCart,
        setShowCart,
        addToDetails
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
