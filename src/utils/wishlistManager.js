// src/utils/wishlistManager.js
class WishlistManager {
  constructor() {
    this.listeners = new Set();
    this.initialize();
  }

  initialize() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('wishlist_')) {
        this.notifyListeners();
      }
    });
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  triggerUpdate() {
    const event = new CustomEvent('wishlist-updated');
    window.dispatchEvent(event);
    
    const storageEvent = new StorageEvent('storage', {
      key: `wishlist_trigger_${Date.now()}`,
      newValue: Date.now().toString(),
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
    
    this.notifyListeners();
  }

  getWishlistCount(userEmail) {
    if (!userEmail) return 0;
    
    try {
      const wishlistKey = `wishlist_${userEmail}`;
      const wishlistItems = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
      return wishlistItems.length;
    } catch (error) {
      // console.error('Error getting wishlist count:', error);
      return 0;
    }
  }
}

// Singleton instance
export const wishlistManager = new WishlistManager();