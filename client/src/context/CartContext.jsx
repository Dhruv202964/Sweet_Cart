import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🌟 BULLETPROOF SAFETY NET: Safely grab auth context without crashing!
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    // Safely create the storage key
    const storageKey = isAuthenticated && user?.email 
      ? `sweetcart_cart_${user.email}` 
      : 'sweetcart_cart_guest';
      
    const savedCart = localStorage.getItem(storageKey);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user, isAuthenticated]);

  useEffect(() => {
    const storageKey = isAuthenticated && user?.email 
      ? `sweetcart_cart_${user.email}` 
      : 'sweetcart_cart_guest';
      
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, user, isAuthenticated]);

  // 🚀 UPGRADED: Now separates items by weight using cartItemId!
  const addToCart = (product) => {
    setCart((prevCart) => {
      const matchId = product.cartItemId || product.product_id;
      const existingItem = prevCart.find((item) => (item.cartItemId || item.product_id) === matchId);
      
      if (existingItem) {
        return prevCart.map((item) =>
          (item.cartItemId || item.product_id) === matchId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 🚀 UPGRADED: Decreases specific weights
  const decreaseQuantity = (id) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => (item.cartItemId || item.product_id) === id);
      if (existingItem?.quantity === 1) {
        return prevCart.filter((item) => (item.cartItemId || item.product_id) !== id);
      }
      return prevCart.map((item) =>
        (item.cartItemId || item.product_id) === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // 🚀 UPGRADED: Removes specific weights
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.cartItemId || item.product_id) !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, decreaseQuantity, removeFromCart, getCartTotal, clearCart,
      searchQuery, setSearchQuery 
    }}>
      {children}
    </CartContext.Provider>
  );
};