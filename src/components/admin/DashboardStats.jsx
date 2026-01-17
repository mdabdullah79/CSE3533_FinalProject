// src/components/admin/DashboardStats.jsx
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  BarChart3,
  Calendar
} from "lucide-react";
import React from "react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Total Orders",
      value: "324",
      change: "+8.2%",
      trend: "up",
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+5.7%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Products",
      value: "89",
      change: "-2.1%",
      trend: "down",
      icon: <Package className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const recentActivities = [
    { id: 1, user: "John Doe", action: "placed an order", time: "2 min ago", amount: "$89.99" },
    { id: 2, user: "Sarah Miller", action: "created an account", time: "15 min ago" },
    { id: 3, user: "Alex Wilson", action: "added to wishlist", time: "30 min ago" },
    { id: 4, user: "Jane Smith", action: "completed checkout", time: "1 hour ago", amount: "$245.50" },
    { id: 5, user: "Admin", action: "added new product", time: "2 hours ago" }
  ];

  return (
    <div className="space-y-6">
<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
  {stats.map((stat, index) => (
    <div key={index} className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 md:p-6">
      <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            {React.cloneElement(stat.icon, { className: "w-full h-full" })}
          </div>
        </div>
        <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {stat.trend === 'up' ? 
            <TrendingUp className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" /> : 
            <TrendingDown className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
          }
          <span className="text-xs font-medium">{stat.change}</span>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600">{stat.title}</p>
    </div>
  ))}
</div>

      {/* Recent Activity & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border sm:p-6 p-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="font-semibold text-green-600">{activity.amount}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Today's Revenue</span>
              <span className="font-bold text-green-600">$1,245</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Today's Orders</span>
              <span className="font-bold">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New Customers</span>
              <span className="font-bold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-blue-600">3.8%</span>
            </div>
            <div className="pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
                <p className="text-2xl font-bold">$51.87</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;