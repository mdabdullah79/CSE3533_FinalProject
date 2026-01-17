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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;