// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        // console.error('Failed to parse cart:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);

  // Calculate total items count
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  
  // Calculate total price
  const cartTotal = items.reduce((sum, item) => sum + (item.qty * Number(item.price)), 0);

  const addToCart = (product, size = 'M') => {
    setItems(prev => {
      const existing = prev.find(item => 
        item._id === product._id && item.size === size
      );
      
      if (existing) {
        return prev.map(item =>
          item._id === product._id && item.size === size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        return [...prev, {
          ...product,
          qty: 1,
          size,
          cartId: `${product._id}-${size}-${Date.now()}`
        }];
      }
    });
  };

  const removeItem = (productId, size) => {
    setItems(prev => 
      prev.filter(item => !(item._id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, qty) => {
    setItems(prev =>
      prev.map(item =>
        item._id === productId && item.size === size
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};