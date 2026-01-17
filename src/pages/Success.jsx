// src/pages/Success.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle, Package, Truck, Home, ShoppingBag } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  // Clear any order-related local storage on success page load
  useEffect(() => {
    // Clear cart from localStorage
    localStorage.removeItem("cart_items");
    
    // You can also clear any temporary order data
    localStorage.removeItem("pending_order");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-green-100">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        <div className="p-8">
          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number</span>
                <span className="font-semibold">#{Date.now().toString().slice(-8)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">Cash on Delivery</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-green-600">
                  ${/* You can pass the total amount via state or localStorage if needed */}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              What's Next?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                  <p className="text-gray-600 text-sm">Your order has been received and is being processed.</p>
                  <span className="text-xs text-green-600 font-medium">Just now</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Processing</h3>
                  <p className="text-gray-600 text-sm">We're preparing your items for shipment.</p>
                  <span className="text-xs text-gray-500">Expected: Today</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shipped</h3>
                  <p className="text-gray-600 text-sm">Your order will be dispatched within 24 hours.</p>
                  <span className="text-xs text-gray-500">Expected: Tomorrow</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery</h3>
                  <p className="text-gray-600 text-sm">Estimated delivery: 3-5 business days.</p>
                  <span className="text-xs text-gray-500">Expected: Next week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-3">What to Expect</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>We'll notify you when your order ships</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Delivery updates will be sent via SMS/Email</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-gray-600 text-sm">
              Need help?{" "}
              <Link to="/contact" className="text-blue-600 hover:underline font-medium">
                Contact Support
              </Link>{" "}
              or call <span className="font-semibold">1-800-ORDER-NOW</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;