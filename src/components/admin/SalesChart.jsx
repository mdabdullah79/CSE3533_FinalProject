// src/components/admin/SalesChart.jsx
import { 
  TrendingUp, 
  MoreVertical,
  Download,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Calendar
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const SalesChart = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 4000, orders: 240, profit: 1200, cost: 2800 },
    { month: 'Feb', revenue: 3000, orders: 198, profit: 900, cost: 2100 },
    { month: 'Mar', revenue: 5000, orders: 280, profit: 1500, cost: 3500 },
    { month: 'Apr', revenue: 4500, orders: 250, profit: 1350, cost: 3150 },
    { month: 'May', revenue: 6000, orders: 320, profit: 1800, cost: 4200 },
    { month: 'Jun', revenue: 5500, orders: 300, profit: 1650, cost: 3850 },
    { month: 'Jul', revenue: 7000, orders: 350, profit: 2100, cost: 4900 },
    { month: 'Aug', revenue: 6500, orders: 320, profit: 1950, cost: 4550 },
    { month: 'Sep', revenue: 8000, orders: 400, profit: 2400, cost: 5600 },
    { month: 'Oct', revenue: 7500, orders: 380, profit: 2250, cost: 5250 },
    { month: 'Nov', revenue: 9000, orders: 450, profit: 2700, cost: 6300 },
    { month: 'Dec', revenue: 8500, orders: 420, profit: 2550, cost: 5950 },
  ];

  const categoryData = [
    { name: 'Clothing', value: 35, color: '#8884d8' },
    { name: 'Electronics', value: 25, color: '#82ca9d' },
    { name: 'Accessories', value: 20, color: '#ffc658' },
    { name: 'Home', value: 15, color: '#ff8042' },
    { name: 'Others', value: 5, color: '#0088fe' },
  ];

  const dailyData = [
    { day: 'Mon', sales: 1200, orders: 45 },
    { day: 'Tue', sales: 1800, orders: 60 },
    { day: 'Wed', sales: 1500, orders: 52 },
    { day: 'Thu', sales: 2200, orders: 70 },
    { day: 'Fri', sales: 2800, orders: 85 },
    { day: 'Sat', sales: 3200, orders: 95 },
    { day: 'Sun', sales: 2500, orders: 75 },
  ];

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const growthRate = ((monthlyData[11].revenue - monthlyData[0].revenue) / monthlyData[0].revenue * 100).toFixed(1);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">
                {entry.name === 'revenue' || entry.name === 'profit' || entry.name === 'cost' ? `$${entry.value.toLocaleString()}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('yearly');

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Sales Analytics</h3>
          <p className="text-sm text-gray-600">Revenue, orders, and profit analysis</p>
        </div>
        
        <div className="sm:flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-lg ${chartType === 'area' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+{growthRate}%</span>
            <span className="text-xs text-gray-600 ml-auto">from last year</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold">{totalOrders.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+18.2%</span>
            <span className="text-xs text-gray-600 ml-auto">from last year</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Avg. Order Value</p>
              <p className="text-xl sm:text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+5.3%</span>
            <span className="text-xs text-gray-600 ml-auto">from last year</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600">Profit Margin</p>
              <p className="text-xl sm:text-2xl font-bold">30.2%</p>
            </div>
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+2.1%</span>
            <span className="text-xs text-gray-600 ml-auto">from last year</span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          <div className="h-72 sm:h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart
                  data={timeRange === 'yearly' ? monthlyData : dailyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={timeRange === 'yearly' ? 'month' : 'day'} 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart
                  data={timeRange === 'yearly' ? monthlyData : dailyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={timeRange === 'yearly' ? 'month' : 'day'} 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={timeRange === 'yearly' ? monthlyData : dailyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey={timeRange === 'yearly' ? 'month' : 'day'} 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart and Additional Info */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Sales by Category</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Performance */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Performance</h4>
            <div className="space-y-3">
              {monthlyData.slice(-3).reverse().map((data, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{data.month}</p>
                    <p className="text-sm text-gray-600">{data.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${data.revenue.toLocaleString()}</p>
                    <p className={`text-sm ${data.revenue > 5000 ? 'text-green-600' : 'text-amber-600'}`}>
                      {data.revenue > 5000 ? '▲ High' : '◀ Avg'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-gray-900 mb-4">Detailed Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xl font-bold text-gray-900">3.2%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Customer Growth</p>
            <p className="text-xl font-bold text-gray-900">+24%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Return Rate</p>
            <p className="text-xl font-bold text-gray-900">2.8%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg. Delivery</p>
            <p className="text-xl font-bold text-gray-900">2.4 days</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '48%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

export default SalesChart;