import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('rossele_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('rossele_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to sync wishlist to storage:', err);
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  const addToWishlist = (product) => {
    if (!product) return;
    const productId = product._id || product.id;
    if (!isInWishlist(productId)) {
      setWishlist((prev) => [...prev, product]);
      addToast(`Saved "${product.name}" to your wishlist`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => {
      const removedItem = prev.find((item) => (item._id || item.id) === productId);
      if (removedItem) {
        addToast(`Removed "${removedItem.name}" from wishlist`);
      }
      return prev.filter((item) => (item._id || item.id) !== productId);
    });
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    addToast('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
