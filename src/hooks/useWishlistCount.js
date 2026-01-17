// src/hooks/useWishlistCount.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';
import { wishlistManager } from '../utils/wishlistManager';

export const useWishlistCount = () => {
  const { currentUser, token } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWishlistCount = useCallback(async () => {

    if (!currentUser) {
      setWishlistCount(0);
      setLoading(false);
      return;
    }

    try {
      // Try API first
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const count = response.data.length;
      setWishlistCount(count);

      // Sync with localStorage as backup
      const wishlistKey = `wishlist_${currentUser.email}`;
      const apiWishlist = response.data.map(item => ({
        productId: item.product?._id || item.productId,
        name: item.product?.name,
        price: item.product?.price,
        addedAt: item.addedAt
      }));
      localStorage.setItem(wishlistKey, JSON.stringify(apiWishlist));

    } catch (error) {
      // Fallback to localStorage
      const count = wishlistManager.getWishlistCount(currentUser.email);
      setWishlistCount(count);
    } finally {
      setLoading(false);
    }
  }, [currentUser, token]);

  useEffect(() => {
    // Initial fetch
    fetchWishlistCount();

    // Subscribe to wishlist updates
    const unsubscribe = wishlistManager.addListener(() => {
      fetchWishlistCount();
    });

    // Listen for custom events
    const handleCustomEvent = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlist-updated', handleCustomEvent);
    window.addEventListener('wishlistChanged', handleCustomEvent);

    // Polling for updates (optional, as fallback)
    const pollInterval = setInterval(() => {
      if (currentUser) {
        fetchWishlistCount();
      }
    }, 10000); // Poll every 10 seconds

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
      window.removeEventListener('wishlist-updated', handleCustomEvent);
      window.removeEventListener('wishlistChanged', handleCustomEvent);
    };
  }, [fetchWishlistCount, currentUser]);

  // Function to manually refresh
  const refreshWishlistCount = () => {
    fetchWishlistCount();
  };

  return {
    wishlistCount,
    loading,
    refreshWishlistCount,
    triggerWishlistUpdate: wishlistManager.triggerUpdate
  };
};

// Export for use in other components
export const triggerWishlistUpdate = () => {
  wishlistManager.triggerUpdate();
};