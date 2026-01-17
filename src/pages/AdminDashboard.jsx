// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  BarChart3,
  Grid3x3,
  ListOrdered,
  Settings,
  Shield
} from "lucide-react";

// Import Components
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import UserManager from "../components/admin/UserManager";
import DashboardStats from "../components/admin/DashboardStats";
import SalesChart from "../components/admin/SalesChart";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { id: "categories", label: "Categories", icon: <Grid3x3 className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="space-y-6">
              <SalesChart />
              <div className="bg-white rounded-xl shadow sm:p-6 p-3">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ListOrdered className="w-5 h-5" />
                  Recent Orders
                </h3>
                <OrderManager showAll={false} />
              </div>
            </div>
          </div>
        );
      case "products":
        return <ProductManager />;
      case "orders":
        return <OrderManager showAll={true} />;
      case "users":
        return <UserManager />;
      case "categories":
        return <CategoryManager />;
      case "settings":
        return <AdminSettings />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="md:text-sm text-xs text-gray-600">Manage your e-commerce platform</p>
              </div>
            </div>
            <div className="md:text-sm text-xs text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-23">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-black text-white border-l-4 border-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-bold text-green-600">$12,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Orders</span>
                    <span className="font-bold text-orange-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Low Stock</span>
                    <span className="font-bold text-red-600">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-4/5">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Components
const CategoryManager = () => (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-xl font-bold mb-6">Category Management</h2>
    <p className="text-gray-600">Category management coming soon...</p>
  </div>
);

const AdminSettings = () => (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-xl font-bold mb-6">Settings</h2>
    <p className="text-gray-600">Settings management coming soon...</p>
  </div>
);

export default AdminDashboard;