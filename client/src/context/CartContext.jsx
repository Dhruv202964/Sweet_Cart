import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // 🌟 NEW: Global state for the search bar!
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product.product_id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === productId);
      
      if (existingItem?.quantity === 1) {
        return prevCart.filter((item) => item.product_id !== productId);
      }
      
      return prevCart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => setCart([]);

  return (
    // 🌟 Export the search functions here!
    <CartContext.Provider value={{ 
      cart, addToCart, decreaseQuantity, removeFromCart, getCartTotal, clearCart,
      searchQuery, setSearchQuery 
    }}>
      {children}
    </CartContext.Provider>
  );
};