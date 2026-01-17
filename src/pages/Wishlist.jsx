// src/pages/Wishlist.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  ChevronRight,
  Package,
  Star,
  Tag,
  Search,
  Grid,
  List,
  Loader,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";

const Wishlist = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [processing, setProcessing] = useState(false);

  const filters = [
    { id: "all", label: "All Items" },
    { id: "inStock", label: "In Stock" },
    { id: "outOfStock", label: "Out of Stock" },
    { id: "sale", label: "On Sale" },
    { id: "new", label: "New Arrivals" },
  ];

  const sortOptions = [
    { id: "date", label: "Date Added (Newest)" },
    { id: "date-old", label: "Date Added (Oldest)" },
    { id: "price-high", label: "Price (High to Low)" },
    { id: "price-low", label: "Price (Low to High)" },
    { id: "name", label: "Name (A to Z)" },
  ];

  // Fetch wishlist from backend
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchWishlist();
  }, [currentUser, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setWishlistItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      toast.error("Failed to load wishlist");
      setWishlistItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort items
  useEffect(() => {
    // Ensure wishlistItems is an array
    if (!Array.isArray(wishlistItems)) {
      setFilteredItems([]);
      return;
    }

    let items = [...wishlistItems];

    // Apply search filter
    if (searchQuery) {
      items = items.filter(item =>
        item?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.product?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply stock filter
    switch (selectedFilter) {
      case "inStock":
        items = items.filter(item => item?.product?.inStock);
        break;
      case "outOfStock":
        items = items.filter(item => !item?.product?.inStock);
        break;
      case "sale":
        items = items.filter(item => item?.product?.discount > 0);
        break;
      case "new":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        items = items.filter(item => new Date(item.addedAt) > oneMonthAgo);
        break;
      default:
        // For "all", keep all items
        break;
    }

    // Apply sorting - add safety checks
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b?.addedAt || 0) - new Date(a?.addedAt || 0);
        case "date-old":
          return new Date(a?.addedAt || 0) - new Date(b?.addedAt || 0);
        case "price-high":
          return (b?.product?.price || 0) - (a?.product?.price || 0);
        case "price-low":
          return (a?.product?.price || 0) - (b?.product?.price || 0);
        case "name":
          return (a?.product?.name || "").localeCompare(b?.product?.name || "");
        default:
          return 0;
      }
    });

    setFilteredItems(items);
  }, [wishlistItems, searchQuery, selectedFilter, sortBy]);

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistId) => {
    setProcessing(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${wishlistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(prev => 
        Array.isArray(prev) ? prev.filter(item => item?._id !== wishlistId) : []
      );
      setSelectedItems(prev => prev.filter(id => id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    } finally {
      setProcessing(false);
    }
  };

  // Remove multiple items
  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected");
      return;
    }

    setProcessing(true);
    try {
      await Promise.all(
        selectedItems.map(id =>
          axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      setWishlistItems(prev => 
        Array.isArray(prev) ? prev.filter(item => !selectedItems.includes(item?._id)) : []
      );
      setSelectedItems([]);
      toast.success(`Removed ${selectedItems.length} items from wishlist`);
    } catch (error) {
      console.error("Failed to remove items:", error);
      toast.error("Failed to remove items");
    } finally {
      setProcessing(false);
    }
  };

  // Update note for wishlist item
  const updateNote = async (wishlistId) => {
    if (!noteText.trim()) return;

    setProcessing(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${wishlistId}`,
        { notes: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlistItems(prev =>
        Array.isArray(prev) 
          ? prev.map(item =>
              item?._id === wishlistId ? { ...item, notes: noteText } : item
            )
          : []
      );
      setEditingNoteId(null);
      setNoteText("");
      toast.success("Note updated");
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("Failed to update note");
    } finally {
      setProcessing(false);
    }
  };

  // Add to cart from wishlist
  const addToCart = async (product, size = "M") => {
    if (!product) {
      toast.error("Product not found");
      return;
    }
    
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity: 1
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // Toggle item selection
  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all items
  const selectAllItems = () => {
    if (!Array.isArray(filteredItems)) {
      setSelectedItems([]);
      return;
    }
    
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item?._id).filter(id => id));
    }
  };

  // Calculate total value of wishlist - WITH SAFETY CHECK
  const calculateTotalValue = () => {
    // Check if filteredItems is an array
    if (!Array.isArray(filteredItems)) {
      return "0.00";
    }
    
    try {
      const total = filteredItems.reduce((total, item) => {
        const price = item?.product?.price || 0;
        return total + price;
      }, 0);
      
      return total.toFixed(2);
    } catch (error) {
      console.error("Error calculating total value:", error);
      return "0.00";
    }
  };

  // If not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Please Login</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your wishlist.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure filteredItems is always an array before rendering
  const safeFilteredItems = Array.isArray(filteredItems) ? filteredItems : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                Save items you love for later
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {safeFilteredItems.length} {safeFilteredItems.length === 1 ? 'item' : 'items'}
              </span>
              <span className="text-sm font-semibold">
                Total: ${calculateTotalValue()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search in wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${selectedFilter === filter.id
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid"
                      ? "bg-gray-100 text-black"
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list"
                      ? "bg-gray-100 text-black"
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sort and Bulk Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === safeFilteredItems.length && safeFilteredItems.length > 0}
                onChange={selectAllItems}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                Select all ({selectedItems.length} selected)
              </span>
            </div>

            <div className="flex items-center gap-4">
              {selectedItems.length > 0 && (
                <button
                  onClick={removeSelectedItems}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Selected
                </button>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {safeFilteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchQuery ? "No items found" : "Your wishlist is empty"}
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Start adding items you love by clicking the heart icon on any product"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedFilter("all");
                      }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/shop")}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    <ShoppingBag className="w-5 h-5 inline mr-2" />
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {safeFilteredItems.map((item) => (
                      <div
                        key={item?._id || Math.random()}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all group"
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item?._id)}
                            onChange={() => toggleSelectItem(item?._id)}
                            className="w-5 h-5 rounded border-gray-300 bg-white shadow"
                          />
                        </div>

                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={item?.product?.image || `https://picsum.photos/400/400?random=${item?._id || Math.random()}`}
                            alt={item?.product?.name || "Product"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Stock Badge */}
                          {!item?.product?.inStock && (
                            <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                              Out of Stock
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => navigate(`/product/${item?.product?._id}`)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => addToCart(item?.product)}
                                disabled={!item?.product?.inStock || processing}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => removeFromWishlist(item?._id)}
                                disabled={processing}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                                title="Remove"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                              {item?.product?.name || "Unnamed Product"}
                            </h3>
                            <span className="font-bold text-gray-900">
                              ${(item?.product?.price || 0).toFixed(2)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {item?.product?.category || "Uncategorized"}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${star <= Math.floor(item?.product?.rating || 0)
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                  }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({item?.product?.rating || 0})
                            </span>
                          </div>

                          {/* Notes */}
                          {item?.notes ? (
                            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mb-3">
                              <p className="line-clamp-2">{item.notes}</p>
                              {editingNoteId === item._id ? (
                                <div className="mt-2">
                                  <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className="w-full border rounded p-2 text-sm"
                                    rows="2"
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() => updateNote(item._id)}
                                      className="px-2 py-1 bg-black text-white text-xs rounded"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingNoteId(null);
                                        setNoteText("");
                                      }}
                                      className="px-2 py-1 border text-xs rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingNoteId(item._id);
                                    setNoteText(item.notes);
                                  }}
                                  className="text-xs text-gray-500 hover:text-black mt-1"
                                >
                                  Edit note
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingNoteId(item._id);
                                setNoteText("");
                              }}
                              className="text-sm text-gray-500 hover:text-black mb-3"
                            >
                              + Add note
                            </button>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => addToCart(item?.product)}
                              disabled={!item?.product?.inStock || processing}
                              className="flex-1 px-3 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item?._id)}
                              disabled={processing}
                              className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-4">
                    {safeFilteredItems.map((item) => (
                      <div
                        key={item?._id || Math.random()}
                        className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Selection Checkbox */}
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item?._id)}
                              onChange={() => toggleSelectItem(item?._id)}
                              className="w-5 h-5 mt-4 rounded border-gray-300"
                            />
                          </div>

                          {/* Product Image */}
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={item?.product?.image || `https://picsum.photos/200/200?random=${item?._id || Math.random()}`}
                              alt={item?.product?.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {item?.product?.name || "Unnamed Product"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {item?.product?.category || "Uncategorized"}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-sm px-2 py-0.5 rounded ${item?.product?.inStock
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                    }`}>
                                    {item?.product?.inStock ? "In Stock" : "Out of Stock"}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    Added: {item?.addedAt ? new Date(item.addedAt).toLocaleDateString() : "Unknown"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-gray-900">
                                  ${(item?.product?.price || 0).toFixed(2)}
                                </p>
                                {item?.product?.originalPrice && (
                                  <p className="text-sm text-gray-500 line-through">
                                    ${item.product.originalPrice.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Notes Section */}
                            <div className="mt-3">
                              {item?.notes ? (
                                <div className="text-sm text-gray-600">
                                  <p className="mb-1 font-medium">Note:</p>
                                  <p className="bg-gray-50 rounded p-2">{item.notes}</p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingNoteId(item._id);
                                    setNoteText("");
                                  }}
                                  className="text-sm text-gray-500 hover:text-black"
                                >
                                  + Add a note
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => navigate(`/product/${item?.product?._id}`)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => addToCart(item?.product)}
                              disabled={!item?.product?.inStock || processing}
                              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="hidden sm:inline">Add to Cart</span>
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item?._id)}
                              disabled={processing}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Items:</span>
                          <span className="font-semibold">{safeFilteredItems.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>In Stock:</span>
                          <span className="font-semibold">
                            {safeFilteredItems.filter(item => item?.product?.inStock).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Value:</span>
                          <span className="font-semibold">${calculateTotalValue()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Price Alerts
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Get notified when items go on sale
                      </p>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                        Enable Price Alerts
                      </button>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            const inStockItems = safeFilteredItems.filter(item => item?.product?.inStock);
                            if (inStockItems.length > 0) {
                              toast.success(`Added ${inStockItems.length} items to cart`);
                            } else {
                              toast.error("No items in stock to add to cart");
                            }
                          }}
                          className="w-full px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
                        >
                          Add All In-Stock to Cart
                        </button>
                        <button
                          onClick={() => {
                            const saleItems = safeFilteredItems.filter(item => item?.product?.discount > 0);
                            if (saleItems.length > 0) {
                              toast.success(`Found ${saleItems.length} items on sale`);
                            } else {
                              toast.info("No items on sale in your wishlist");
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition"
                        >
                          Check for Sales
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;