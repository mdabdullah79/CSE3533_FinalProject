// src/components/admin/OrderManager.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Download,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Users,
  Calendar
} from "lucide-react";

const OrderManager = ({ showAll = true }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    ordersByStatus: [],
    monthlyStats: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/orders");
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      // console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await api.get("/api/orders/stats");
      setStats(response.data);
    } catch (error) {
      // console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (order.userEmail && order.userEmail.toLowerCase().includes(searchLower)) ||
          (order._id && order._id.toLowerCase().includes(searchLower)) ||
          (order.firstName && order.firstName.toLowerCase().includes(searchLower)) ||
          (order.lastName && order.lastName.toLowerCase().includes(searchLower)) ||
          (order.phone && order.phone.includes(searchQuery)) ||
          (order.items && order.items.some(item =>
            item.name && item.name.toLowerCase().includes(searchLower)
          ))
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (dateFilter) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate;
      });
    }

    // If not showing all, limit to recent orders
    if (!showAll) {
      filtered = filtered.slice(0, 5);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, dateFilter, showAll]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
        label: "Pending"
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: <Package className="w-4 h-4" />,
        label: "Confirmed"
      },
      processing: {
        color: "bg-purple-100 text-purple-800",
        icon: <Package className="w-4 h-4" />,
        label: "Processing"
      },
      shipped: {
        color: "bg-indigo-100 text-indigo-800",
        icon: <Truck className="w-4 h-4" />,
        label: "Shipped"
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Delivered"
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Cancelled"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}`, {
        status: newStatus
      });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
      fetchOrderStats();
    } catch (error) {
      // console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await api.delete(`/api/orders/${orderId}`);
      toast.success("Order deleted successfully");
      fetchOrders();
      fetchOrderStats();
    } catch (error) {
      // console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const exportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Order ID,Date,Customer,Email,Phone,Total,Status\n"
      + orders.map(order =>
        `"${order._id}","${new Date(order.createdAt).toLocaleDateString()}","${order.firstName} ${order.lastName}","${order.email}","${order.phone}","${order.total}","${order.status || 'pending'}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusCount = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const calculateRevenue = () => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2);
  };

  if (loading && showAll) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        {showAll && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportOrders}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
          </div>
        )}
      </div>

      {/* Stats - Only show when showAll is true */}
      {showAll && showStats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${calculateRevenue()}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-purple-600">{getStatusCount('delivered')}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4">Order Status Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
                const count = getStatusCount(status);
                const percentage = orders.length > 0 ? ((count / orders.length) * 100).toFixed(1) : 0;

                return (
                  <div key={status} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${status === 'pending' ? 'bg-yellow-100' :
                        status === 'confirmed' ? 'bg-blue-100' :
                          status === 'processing' ? 'bg-purple-100' :
                            status === 'shipped' ? 'bg-indigo-100' :
                              status === 'delivered' ? 'bg-green-100' :
                                'bg-red-100'
                      }`}>
                      <span className="text-2xl font-bold">{
                        status === 'pending' ? <Clock className="w-8 h-8" /> :
                          status === 'confirmed' ? <Package className="w-8 h-8" /> :
                            status === 'processing' ? <Package className="w-8 h-8" /> :
                              status === 'shipped' ? <Truck className="w-8 h-8" /> :
                                status === 'delivered' ? <CheckCircle className="w-8 h-8" /> :
                                  <AlertCircle className="w-8 h-8" />
                      }</span>
                    </div>
                    <p className="font-semibold capitalize">{status}</p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Filters - Only show when showAll is true */}
      {showAll && (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID, name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>

              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? "No orders found matching your filters"
                : "No orders yet"}
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? "Try adjusting your search or filters"
                : "Orders will appear here when customers place orders"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items?.length || 0} items
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.firstName} {order.lastName}
                          </div>
                          <div className="text-gray-500">{order.email}</div>
                          <div className="text-gray-500">{order.phone || 'No phone'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">${(order.total || 0).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">
                          {order.items?.reduce((sum, item) => sum + (item.qty || 1), 0)} items
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status || 'pending')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100"
                          >
                            View
                          </button>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                          {showAll && (
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="px-2 py-1 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            {showAll && (
              <div className="bg-gray-50 px-6 py-3 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    Showing <span className="font-semibold">{filteredOrders.length}</span> of{" "}
                    <span className="font-semibold">{orders.length}</span> orders
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>
                        Total: <span className="font-semibold">${calculateRevenue()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onUpdate={fetchOrders}
          onStatusUpdate={updateOrderStatus}
        />
      )}
    </div>
  );
};

// Order Modal Component
const OrderModal = ({ order, onClose, onUpdate, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status || 'pending');

  const handleStatusUpdate = () => {
    onStatusUpdate(order._id, status);
    onUpdate();
  };

  const calculateOrderTotal = () => {
    if (order.total) return order.total;

    return order.items?.reduce((total, item) => {
      return total + (Number(item.price) || 0) * (item.qty || 1);
    }, 0) || 0;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Order Details</h3>
              <p className="text-gray-600">
                Order #{order._id?.slice(-8).toUpperCase()} •{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Customer Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
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
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium">{order.address}, {order.city}</p>
                    <p className="text-sm">{order.postalCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-semibold text-lg">Order Items ({order.items?.length || 0})</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <img
                        src={item.image || "https://picsum.photos/60/60"}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Qty: {item.qty || 1} • ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                      <div className="font-bold text-right">
                        <p>${((Number(item.price) || 0) * (item.qty || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                  )) || (
                      <p className="text-gray-500 italic">No items in this order</p>
                    )}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${calculateOrderTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${calculateOrderTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-3">Update Order Status</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white flex-1"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Update Status
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;