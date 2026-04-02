import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const statCards = [
  { title: 'Total Revenue', icon: DollarSign, key: 'totalRevenue', prefix: '' },
  { title: 'Total Orders', icon: ShoppingCart, key: 'totalOrders', prefix: '' },
  { title: 'Total Customers', icon: Users, key: 'totalCustomers', prefix: '' },
  { title: 'Products', icon: Package, key: 'totalProducts', prefix: '' },
] as const;

const chartColors = ['#ff4b2f', '#ff8a65', '#ffb74d', '#ffcc80', '#f97316', '#fb923c'];

export default function Dashboard() {
  const { getDashboardStats, orders, products, customers } = useAdmin();
  const stats = getDashboardStats();

  const revenueSeries = useMemo(() => {
    const totalsByDate = new Map<string, { date: string; revenue: number }>();

    for (const order of orders) {
      if (!order.created_at || order.payment_status !== 'paid') {
        continue;
      }

      const date = new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const current = totalsByDate.get(date) ?? { date, revenue: 0 };
      current.revenue += Number(order.total);
      totalsByDate.set(date, current);
    }

    return Array.from(totalsByDate.values()).slice(-7);
  }, [orders]);

  const categorySeries = useMemo(() => {
    const counts = new Map<string, number>();

    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }

    return Array.from(counts.entries()).map(([name, value], index) => ({
      name,
      value,
      color: chartColors[index % chartColors.length],
    }));
  }, [products]);

  const recentOrders = orders.slice(0, 5);
  const lowStockItems = products.filter((product) => product.status === 'low_stock' || product.status === 'out_of_stock').slice(0, 5);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key];

          return (
            <div key={card.key} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.key === 'totalRevenue' ? formatCurrency(value) : value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#ff4b2f]/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#ff4b2f]" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-gray-400">
                  {card.key === 'totalRevenue' ? 'Based on paid orders' : 'Live store data'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <span className="text-sm text-gray-500">Recent paid orders</span>
          </div>
          <div className="h-72">
            {revenueSeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Revenue appears here after paid orders are recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff4b2f"
                    strokeWidth={2}
                    dot={{ fill: '#ff4b2f', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Products by Category</h2>
          <div className="h-56">
            {categorySeries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Add products to see category distribution.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySeries} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categorySeries.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {categorySeries.map((category) => (
              <div key={category.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                  <span className="text-gray-600">{category.name}</span>
                </div>
                <span className="font-medium text-gray-900">{category.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-[#ff4b2f] hover:underline flex items-center">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Orders appear here after checkout.</div>
            ) : (
              recentOrders.map((order) => {
                const customer = customers.find((item) => item.id === order.customer_id);

                return (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{customer?.name ?? customer?.email ?? order.customer_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${Number(order.total).toFixed(2)}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
              <Link to="/admin/products" className="text-sm text-[#ff4b2f] hover:underline flex items-center">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No low stock items</div>
            ) : (
              lowStockItems.map((product) => (
                <div key={product.id} className="p-4 flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' : product.stock <= 10 ? 'text-yellow-600' : 'text-gray-900'
                      }`}
                    >
                      {product.stock} left
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
