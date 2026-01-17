// src/components/FeaturedProducts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import axios from "axios";
import ProductSkeleton from "../components/ProductSkeleton";

  const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products?limit=8`
        );

        /**
         * SAFE RESPONSE HANDLING
         * Possible backend responses:
         * 1) []
         * 2) { products: [] }
         */
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Featured fetch error:", err);
        setError("Failed to load featured products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // ---------- UI STATES ----------
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 lg:max-w-10/12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-500">
        {error}
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-16 text-center text-gray-500">
        No featured products available
      </section>
    );
  }

  // Semi-width container + skeleton grid
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 lg:max-w-10/12 mx-auto">
      <div className="text-center mb-12">
        <span className="inline-block text-amber-600 font-semibold mb-2">✨ Featured Collection</span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Most Loved Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Handpicked selection of premium jackets loved by thousands of customers</p>
      </div>

      {/* Skeleton or Real Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p) => (
            <div key={p._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative overflow-hidden">
                <Link to={`/product/${p._id}`}>
                  <img
                    src={p.image || "https://picsum.photos/400/300?random=" + p._id}
                    alt={p.name}
                    className="w-full h-64 md:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
              </div>

              <div className="p-5">
                <span className="text-sm text-gray-500">{p.category}</span>
                <Link to={`/product/${p._id}`}>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-amber-600 transition-colors">{p.name}</h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-amber-400 stroke-amber-400" : "text-gray-300 stroke-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.x ({Math.floor(Math.random() * 150) + 50})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${Number(p.price).toFixed(2)}</span>
                  <Link to={`/product/${p._id}`}>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link to="/shop">
          <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-bold hover:bg-gray-900 hover:text-white transition-all">
            View All Products →
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;