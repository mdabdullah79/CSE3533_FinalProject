// src/pages/Orders.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  MapPin,
  ChevronRight,
  RefreshCw,
  Eye,
  Download,
  Printer,
  MessageCircle,
  ExternalLink
} from "lucide-react";

const Orders = () => {
  const { token, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/orders/my`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (Array.isArray(response.data)) {
      setOrders(response.data);
      setFilteredOrders(response.data);
    } else {
      setOrders([]);
      setFilteredOrders([]);
    }
  } catch (error) {
    toast.error("Failed to load orders");
    setOrders([]);
    setFilteredOrders([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "priceHigh":
          return b.total - a.total;
        case "priceLow":
          return a.total - b.total;
        default:
          return dateB - dateA;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, sortBy]);

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
        text: "Pending"
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Package className="w-4 h-4" />,
        text: "Confirmed"
      },
      processing: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <Package className="w-4 h-4" />,
        text: "Processing"
      },
      shipped: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <Truck className="w-4 h-4" />,
        text: "Shipped"
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Delivered"
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <AlertCircle className="w-4 h-4" />,
        text: "Cancelled"
      }
    };

    const currentConfig = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${currentConfig.color}`}>
        {currentConfig.icon}
        {currentConfig.text}
      </span>
    );
  };

  const getEstimatedDelivery = (orderDate) => {
    const orderDateObj = new Date(orderDate);
    const deliveryDate = new Date(orderDateObj);
    deliveryDate.setDate(deliveryDate.getDate() + 7); // Assume 7 days delivery

    return deliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleReorder = async (order) => {
    toast.loading("Adding items to cart...");

    // Simulate adding to cart
    setTimeout(() => {
      toast.dismiss();
      toast.success("Items added to cart!");
      // You would typically dispatch to cart context here
    }, 1500);
  };

  const handleTrackOrder = (orderId) => {
    toast.custom((t) => (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <h3 className="font-bold text-lg mb-4">Track Order #{orderId.slice(-8)}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Status:</span>
            <span className="font-semibold">In Transit</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Estimated Delivery:</span>
            <span className="font-semibold">Dec 15, 2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Carrier:</span>
            <span className="font-semibold">Express Delivery</span>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full mt-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    ));
  };

  const downloadInvoice = (order) => {
    toast.success("Invoice downloaded successfully!");
    // Implement actual invoice download logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <Toaster position="top-right" />
      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">
                View and manage all your purchases
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                to="/shop"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

    



        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? "No orders found" : "No orders yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? "Try adjusting your search or filters"
                : "Start shopping to see your orders here"}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Start Shopping
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl border hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h3>
                        {getStatusBadge(order.status || 'pending')}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{order.items?.length || 0} items</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-900">
                          ${order.total?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Products */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Items</h4>
                      <div className="space-y-3">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <img
                              src={item.image || "https://via.placeholder.com/60"}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Size: {item.size} • Qty: {item.qty || 1}
                              </p>
                              <p className="text-sm font-semibold">
                                ${Number(item.price).toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items && order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            + {order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Order Info</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Shipping Address</span>
                          <span className="font-medium text-right">
                            {order.address}, {order.city}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Estimated Delivery</span>
                          <span className="font-medium">
                            {getEstimatedDelivery(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Reorder
                          </button>
                        )}

                        {(order.status === 'shipped' || order.status === 'processing') && (
                          <button
                            onClick={() => handleTrackOrder(order._id)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                          >
                            <Truck className="w-4 h-4" />
                            Track Order
                          </button>
                        )}

                        <button
                          onClick={() => downloadInvoice(order)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                          <MessageCircle className="w-4 h-4" />
                          Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowOrderDetails(false)}
            onTrack={handleTrackOrder}
            onReorder={handleReorder}
            onDownload={downloadInvoice}
          />
        )}
      </div>
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onTrack, onReorder, onDownload }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Order Details</h3>
              <p className="text-gray-600">
                Order #{order._id?.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer & Shipping Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Shipping Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{order.firstName} {order.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{order.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{order.address}</p>
                    <p className="text-sm">{order.city}, {order.postalCode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Order Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Order Items ({order.items?.length || 0})</h4>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                      <img
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Color: {item.color || 'Standard'} • Qty: {item.qty || 1}
                        </p>
                        <p className="text-sm font-semibold">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(Number(item.price) * (item.qty || 1)).toFixed(2)}
                        </p>
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View Product
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.total?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${((order.total || 0) * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>Total</span>
                      <span>${((order.total || 0) * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onTrack(order._id)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Truck className="w-5 h-5" />
                  Track Order
                </button>
                <button
                  onClick={() => onReorder(order)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reorder All Items
                </button>
                <button
                  onClick={() => onDownload(order)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;