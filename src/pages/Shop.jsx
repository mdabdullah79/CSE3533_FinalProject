// src/pages/Shop.jsx
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router";
import axios from "axios";
import ProductSkeleton from "../components/ProductSkeleton";
import {
  Search,
  Filter,
  DollarSign,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  Zap,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Truck,
  RefreshCw
} from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [priceMax, setPriceMax] = useState(5000);
  const [inStock, setInStock] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    availability: true,
    features: false
  });
  const sidebarRef = useRef(null);

  const NAVBAR_HEIGHT = 64;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        const data = res.data;
        setProducts(data);

        // Extract unique categories with counts
        const categoryMap = data.reduce((acc, p) => {
          if (p.category) {
            acc[p.category] = (acc[p.category] || 0) + 1;
          }
          return acc;
        }, {});

        const categoryList = Object.entries(categoryMap)
          .sort(([, a], [, b]) => b - a)
          .map(([cat]) => cat);

        setCategories(["All", ...categoryList, "Sale", "New Arrivals", "Best Sellers"]);
      } catch (err) {
        // console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Debounced search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // filter function
  const applyFilters = useCallback(() => {
    if (!products.length) return [];

    let filtered = [...products];

    // Category filter (including special categories)
    if (category !== "All") {
      switch (category) {
        case "Sale":
          filtered = filtered.filter(p => p.discount || p.sale || p.price < 100);
          break;
        case "New Arrivals":
          // Assuming there's a createdAt field or similar
          filtered = filtered.filter(p => {
            const date = new Date(p.createdAt || p.updatedAt || Date.now());
            const diffTime = Math.abs(Date.now() - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
          });
          break;
        case "Best Sellers":
          filtered = filtered.filter(p => p.rating >= 4 || (p.sold && p.sold > 50));
          break;
        default:
          filtered = filtered.filter(p => p.category === category);
      }
    }

    // Price filter
    filtered = filtered.filter(p => Number(p.price) <= priceMax);

    // Stock filter
    if (inStock) {
      filtered = filtered.filter(p => p.inStock === true);
    }

    // Search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm)) ||
        (p.category && p.category.toLowerCase().includes(searchTerm)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    return filtered;
  }, [products, category, priceMax, inStock, search]);

  // Apply filters when dependencies change
  useEffect(() => {
    setFilteredProducts(applyFilters());
  }, [applyFilters]);

  // Handle price range input with debounce
  const handlePriceChange = useCallback(
    debounce((value) => {
      setPriceMax(Number(value));
    }, 100),
    []
  );

  // Clear all filters
  const clearFilters = () => {
    setCategory("All");
    setPriceMax(5000);
    setInStock(false);
    setSearch("");
  };

  // Toggle filter sections
  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get category icon
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Men": return <Tag className="w-4 h-4" />;
      case "Women": return <Tag className="w-4 h-4" />;
      case "Electronics": return <Zap className="w-4 h-4" />;
      case "Sale": return <TrendingUp className="w-4 h-4" />;
      case "New Arrivals": return <Clock className="w-4 h-4" />;
      case "Best Sellers": return <Star className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  // Statistics for filtered products
  const stats = useMemo(() => ({
    total: products.length,
    filtered: filteredProducts.length,
    inStockCount: products.filter(p => p.inStock).length,
    avgPrice: products.length > 0
      ? (products.reduce((sum, p) => sum + Number(p.price), 0) / products.length).toFixed(2)
      : 0,
    minPrice: products.length > 0
      ? Math.min(...products.map(p => Number(p.price)))
      : 0,
    maxPrice: products.length > 0
      ? Math.max(...products.map(p => Number(p.price)))
      : 0,
    totalValue: products.reduce((sum, p) => sum + Number(p.price), 0).toFixed(2),
  }), [products, filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Fixed Navbar Offset */}
      <div
        className="bg-white shadow-sm border-b"
      >
        <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
              <p className="text-gray-600 mt-2">
                Discover our curated collection of premium products
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name, description, or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-96 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Fixed Sidebar - Now properly positioned */}
        

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Products {stats.filtered > 0 && `(${stats.filtered})`}
                </h2>
                {search && (
                  <p className="text-gray-600 mt-1">
                    Search results for "<span className="font-semibold">{search}</span>"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {stats.filtered === 0 ? "No products found" :
                    `${stats.filtered} product${stats.filtered !== 1 ? 's' : ''} found`}
                </span>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 text-red-700 underline hover:text-red-800"
                    >
                      Retry Loading Products
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* No Results State */}
                {filteredProducts.length === 0 && !error && (
                  <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or search term
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                      >
                        Clear all filters
                      </button>
                      <button
                        onClick={() => setSearch("")}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                      >
                        Clear search
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Grid */}
                {filteredProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p._id}
                        to={`/product/${p._id}`}
                        className="group block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-xl"
                      >
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                          {/* Image Container */}
                          <div className="relative overflow-hidden bg-gray-100">
                            <img
                              src={p.image || `https://picsum.photos/400/300?random=${p._id}&grayscale`}
                              alt={p.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = `https://picsum.photos/400/300?random=${p._id}`;
                              }}
                            />
                            {/* Stock Badge */}
                            <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full ${p.inStock
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                              }`}>
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            {/* Sale Badge */}
                            {(p.discount || p.sale) && (
                              <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                                SALE
                              </span>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-black line-clamp-1">
                                {p.name}
                              </h3>
                              <div className="flex flex-col items-end">
                                {p.discount && (
                                  <span className="text-sm text-red-600 line-through">
                                    ${(Number(p.price) * 1.2).toFixed(2)}
                                  </span>
                                )}
                                <span className="font-bold text-lg text-gray-900">
                                  ${Number(p.price).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {p.category && (
                              <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {p.category}
                              </p>
                            )}

                            {p.description && (
                              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                {p.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-500">
                                  {p.rating ? `${p.rating}/5` : 'No ratings'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-black group-hover:underline flex items-center gap-1">
                                View Details
                                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;