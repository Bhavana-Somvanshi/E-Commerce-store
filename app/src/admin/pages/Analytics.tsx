import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from 'lucide-react';
import { categoryData } from '../data/mockData';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 45000, orders: 320, customers: 180 },
  { month: 'Feb', revenue: 52000, orders: 380, customers: 220 },
  { month: 'Mar', revenue: 48000, orders: 350, customers: 200 },
  { month: 'Apr', revenue: 61000, orders: 450, customers: 280 },
  { month: 'May', revenue: 58000, orders: 420, customers: 260 },
  { month: 'Jun', revenue: 72000, orders: 520, customers: 320 },
  { month: 'Jul', revenue: 68000, orders: 490, customers: 300 },
  { month: 'Aug', revenue: 75000, orders: 550, customers: 340 },
  { month: 'Sep', revenue: 82000, orders: 600, customers: 380 },
  { month: 'Oct', revenue: 79000, orders: 580, customers: 360 },
  { month: 'Nov', revenue: 91000, orders: 680, customers: 420 },
  { month: 'Dec', revenue: 98000, orders: 720, customers: 460 },
];

const topProducts = [
  { name: 'Minimalist Watch', sales: 156, revenue: 31044 },
  { name: 'Classic White Sneakers', sales: 124, revenue: 11036 },
  { name: 'Cozy Knit Sweater', sales: 112, revenue: 11088 },
  { name: 'Leather Crossbody Bag', sales: 89, revenue: 11481 },
  { name: 'Linen Blend Shirt', sales: 78, revenue: 6162 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30days');

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, d) => sum + d.orders, 0);
  const totalCustomers = monthlyData[monthlyData.length - 1].customers;
  const avgOrderValue = totalRevenue / totalOrders;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">
            Track your store performance and key metrics
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20 focus:border-[#ff4b2f]"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="year">This year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+23.5%</span>
            <span className="text-gray-400 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+18.2%</span>
            <span className="text-gray-400 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+32.1%</span>
            <span className="text-gray-400 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgOrderValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#ff4b2f]/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-[#ff4b2f]" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500 font-medium">-2.4%</span>
            <span className="text-gray-400 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ff4b2f] rounded-full" />
            <span className="text-sm text-gray-500">Revenue</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4b2f" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ff4b2f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#ff4b2f"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Customers Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Orders & Customers
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="orders" fill="#ff4b2f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="customers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Sales by Category
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-gray-600">{cat.name}</span>
                <span className="ml-auto font-medium text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {topProducts.map((product, index) => (
            <div key={product.name} className="p-4 flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.sales} sales</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </p>
                <p className="text-sm text-gray-500">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
