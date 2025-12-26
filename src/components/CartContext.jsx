import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems((prevCart) => {
      // Check if product already exists in cart
      const existingItem = prevCart.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product_id === product.product_id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      // Add new item if it doesn't exist
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);