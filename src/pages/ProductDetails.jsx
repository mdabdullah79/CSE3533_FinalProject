// src/pages/ProductDetails.jsx - ULTIMATE WORKING VERSION
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import ProductSkeleton from "../components/ProductSkeleton";
import {
  ShoppingCart,
  Package,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Tag,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("M");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  
  // Wishlist states - SIMPLIFIED
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Use ref to prevent multiple checks
  const hasCheckedWishlist = useRef(false);
  const isChecking = useRef(false);

  const totalPrice = (product ? Number(product.price) : 0) * qty;
  const discountPrice = product?.discount
    ? (Number(product.price) * (1 - product.discount / 100)).toFixed(2)
    : null;

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const productImages = product?.images || [product?.image || "https://via.placeholder.com/600"];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/products/${id}`);
        setProduct(res.data);

        // Fetch related products
        if (res.data.category) {
          fetchRelatedProducts(res.data.category, id);
        }
      } catch (err) {
        setError("Failed to load product details");
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // SIMPLE WISHLIST CHECK - Only runs once when product and user are ready
  useEffect(() => {
    const checkWishlist = async () => {
      // Prevent multiple checks
      if (isChecking.current || hasCheckedWishlist.current || !product?._id || !currentUser || !token) {
        return;
      }

      isChecking.current = true;
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/wishlist/check/${product._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Set the state once
        setIsWishlisted(response.data.exists);
        hasCheckedWishlist.current = true;
        
      } catch (error) {
        // If check fails, assume not in wishlist
        setIsWishlisted(false);
      } finally {
        isChecking.current = false;
      }
    };

    checkWishlist();
    
    // Reset when product changes
    return () => {
      hasCheckedWishlist.current = false;
    };
  }, [product?._id, currentUser, token]);

  // ALTERNATIVE APPROACH: Use a separate API endpoint to get user's wishlist
  useEffect(() => {
    const fetchUserWishlist = async () => {
      if (!currentUser || !token || !product?._id) return;
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/wishlist`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Check if current product is in the wishlist
        const inWishlist = response.data.some(item => item.product?._id === product._id);
        setIsWishlisted(inWishlist);
        
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    // Fetch wishlist after a short delay
    const timer = setTimeout(fetchUserWishlist, 300);
    return () => clearTimeout(timer);
  }, [product?._id, currentUser, token]);

  const fetchRelatedProducts = async (category, excludeId) => {
    setRelatedLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/products?category=${category}`);
      const filtered = res.data.filter(p => p._id !== excludeId).slice(0, 4);
      setRelatedProducts(filtered);
    } catch (err) {
      // Ignore related products error
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      ...product,
      size,
      quantity: qty,
      cartId: `${product._id}-${size}-${Date.now()}`
    };
    addToCart(cartItem);
    toast.success(
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <p className="font-semibold">Added to cart!</p>
          <p className="text-sm text-gray-600">
            {product.name} • Size: {size} • Qty: {qty}
          </p>
        </div>
      </div>,
      { duration: 3000 }
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/checkout"), 500);
  };

  // SIMPLE WISHLIST TOGGLE - Using localStorage as fallback
  const toggleWishlist = async () => {
    // Check login
    if (!currentUser || !token) {
      toast.error("Please login to add to wishlist");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    // Check if product loaded
    if (!product || !product._id) {
      toast.error("Product not loaded");
      return;
    }

    // Prevent multiple clicks
    if (wishlistLoading) {
      return;
    }

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        // Try to remove from wishlist
        try {
          // First, get the wishlist item ID
          const checkResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/wishlist/check/${product._id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (checkResponse.data.exists && checkResponse.data.itemId) {
            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/wishlist/${checkResponse.data.itemId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          }
        } catch (error) {
          // If specific delete fails, try bulk delete
          await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/wishlist/by-product/${product._id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        // Update UI immediately
        setIsWishlisted(false);
        toast.success("Removed from wishlist");

      } else {
        // Add to wishlist
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-server-henna.vercel.app"}/api/wishlist`,
          { productId: product._id },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Update UI immediately
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      }

      // Store in localStorage as backup
      const wishlistKey = `wishlist_${currentUser.email}`;
      const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      
      if (isWishlisted) {
        // Remove from localStorage
        const updatedWishlist = currentWishlist.filter(item => item !== product._id);
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      } else {
        // Add to localStorage
        const updatedWishlist = [...currentWishlist, product._id];
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      }

    } catch (error) {
      console.error("Wishlist error:", error);
      
      // On error, use localStorage as fallback
      const wishlistKey = `wishlist_${currentUser.email}`;
      const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      const isInLocalWishlist = currentWishlist.includes(product._id);
      
      if (isWishlisted && !isInLocalWishlist) {
        setIsWishlisted(false);
      } else if (!isWishlisted && isInLocalWishlist) {
        setIsWishlisted(true);
      }
      
      toast.error(error.response?.data?.message || "Failed to update wishlist");
      
    } finally {
      setWishlistLoading(false);
    }
  };

  // Check localStorage on load as backup
  useEffect(() => {
    if (currentUser && product?._id) {
      const wishlistKey = `wishlist_${currentUser.email}`;
      const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      const isInLocalWishlist = currentWishlist.includes(product._id);
      
      // If localStorage says it's wishlisted, update state
      if (isInLocalWishlist && !isWishlisted) {
        setIsWishlisted(true);
      }
    }
  }, [currentUser, product?._id, isWishlisted]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} on Realm Wear`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSizeGuide = () => {
    toast.custom((t) => (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <h3 className="font-bold text-lg mb-4">Size Guide</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-4 gap-2 text-center font-semibold border-b pb-2">
            <div>Size</div>
            <div>Chest</div>
            <div>Waist</div>
            <div>Length</div>
          </div>
          {[
            { size: "XS", chest: "34-36", waist: "28-30", length: "26" },
            { size: "S", chest: "36-38", waist: "30-32", length: "27" },
            { size: "M", chest: "38-40", waist: "32-34", length: "28" },
            { size: "L", chest: "40-42", waist: "34-36", length: "29" },
            { size: "XL", chest: "42-44", waist: "36-38", length: "30" },
          ].map((s) => (
            <div key={s.size} className="grid grid-cols-4 gap-2 text-center border-b py-2">
              <div className="font-medium">{s.size}</div>
              <div>{s.chest}"</div>
              <div>{s.waist}"</div>
              <div>{s.length}"</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    ));
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <ProductSkeleton />
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <Link
              to="/shop"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Shop</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x600?text=Product+Image";
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                      ? "border-black ring-2 ring-black/20"
                      : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <img
                    src={img || "https://via.placeholder.com/80x80?text=Thumbnail"}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80x80?text=Thumbnail";
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Product Actions - SIMPLIFIED WISHLIST BUTTON */}
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading || !currentUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${wishlistLoading ? 'opacity-70 cursor-wait' : ''
                  } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''} ${isWishlisted
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {wishlistLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                )}
                <span className="hidden sm:inline">
                  {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>45 people viewing</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {product.category || "Fashion"}
                </span>
                {Array.isArray(product.tags) &&
                  product.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.floor(product.rating || 4)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                      }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.rating || 4.0}/5)
                </span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountPrice || product.price}
                </span>

                {discountPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-sm">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Total for {qty} item{qty > 1 ? "s" : ""}:
                <span className="font-semibold text-black ml-2">
                  ${totalPrice.toFixed(2)}
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "Premium quality fabric with modern design. Perfect for everyday wear with exceptional comfort and style."}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                  <span>Easy Exchange</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Select Size</h3>
                <button
                  onClick={handleSizeGuide}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sizes.map((s) => {
                  const isAvailable = product.sizes?.includes(s) ?? true;
                  return (
                    <button
                      key={s}
                      onClick={() => isAvailable && setSize(s)}
                      disabled={!isAvailable}
                      className={`px-4 py-3 rounded-lg border transition-all ${size === s
                          ? "bg-black text-white border-black"
                          : isAvailable
                            ? "border-gray-300 hover:border-black hover:bg-gray-50"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {s}
                      {!isAvailable && (
                        <span className="block text-xs text-gray-400 mt-1">Out</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300 font-semibold min-w-[60px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-4 py-3 hover:bg-gray-100 transition rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm flex items-center gap-2 ${product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {product.inStock
                      ? `In Stock • ${product.stock || 50} units available`
                      : "Out of Stock"}
                  </p>
                  {product.inStock && qty > (product.stock || 50) && (
                    <p className="text-sm text-red-600 mt-1">
                      Only {product.stock || 50} units available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || qty > (product.stock || 50)}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
                <span className="text-sm opacity-90">${totalPrice.toFixed(2)}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock || qty > (product.stock || 50)}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3 mt-6">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600">Delivery in 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">30-Day Returns</p>
                  <p className="text-sm text-gray-600">Easy return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Best Price Guarantee</p>
                  <p className="text-sm text-gray-600">Found a better price? We'll match it</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link
                to="/shop"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {relatedLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all">
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={p.image || `https://picsum.photos/400/400?random=${p._id}`}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x400?text=Product+Image";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                        <p className="text-gray-900 font-bold mt-1">${p.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;