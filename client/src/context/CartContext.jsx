import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'rossele_cart_v1';
const FREE_SHIPPING_THRESHOLD = 1500;
const STANDARD_SHIPPING_FEE = 150;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    if (!product || !product._id) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);
      const requestedQty = Math.max(1, parseInt(quantity, 10) || 1);

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + requestedQty;

        // Ensure not exceeding stock
        const maxStock = product.stockQuantity || 99;
        if (newQty > maxStock) {
          addToast(`Maximum available stock reached for ${product.name}`, 'info');
          updated[existingIndex].quantity = maxStock;
        } else {
          updated[existingIndex].quantity = newQty;
          addToast(`Updated quantity for ${product.name} in your ritual bag`);
        }
        return updated;
      } else {
        const initialQty = Math.min(requestedQty, product.stockQuantity || 99);
        addToast(`Added "${product.name}" to your ritual bag`);
        return [...prev, { product, quantity: initialQty }];
      }
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product._id === productId);
      if (item) {
        addToast(`Removed "${item.product.name}" from your bag`, 'info');
      }
      return prev.filter((i) => i.product._id !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          const maxStock = item.product.stockQuantity || 99;
          const finalQty = Math.min(qty, maxStock);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingCharge;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shippingCharge,
        total,
        totalItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        freeShippingProgress,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
