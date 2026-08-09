'use client';

import { createContext, useContext, useState } from 'react';

/**
 * @typedef {{
 *   id: string;
 *   name?: string;
 *   category?: string;
 *   price?: number;
 *   description?: string;
 *   imagePublicId?: string;
 *   inStock?: boolean;
 *   sizes?: string[];
 *   [key: string]: any;
 * }} Product
 *
 * @typedef {{
 *   cart: Array<Product & { size: string; quantity: number }>;
 *   addToCart: (product: Product, size: string, quantity?: number) => void;
 *   removeFromCart: (id: string, size: string) => void;
 *   updateQuantity: (id: string, size: string, quantity: number) => void;
 *   clearCart: () => void;
 *   totalItems: number;
 *   totalPrice: number;
 *   shakeCart: boolean;
 * }} CartContextType
 */

const CartContext = createContext(/** @type {CartContextType | null} */ (null));

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [shakeCart, setShakeCart] = useState(false);

  const triggerCartShake = () => {
    setShakeCart(true);
    setTimeout(() => setShakeCart(false), 300);
  };

  const addToCart = (product, size, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, size, quantity }];
    });
    triggerCartShake();
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    shakeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}