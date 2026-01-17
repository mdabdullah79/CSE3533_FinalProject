// src/components/ProductSkeleton.jsx
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);
export default ProductSkeleton;