import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface CustomerOrder {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  total: number;
  shipping_address: string;
  items: OrderItem[] | unknown;
  created_at: string;
  updated_at: string;
}

interface CustomerProfile {
  id: string;
  email: string;
  name: string | null;
}

function statusClasses(status: CustomerOrder['status']) {
  if (status === 'delivered') return 'bg-green-100 text-green-800';
  if (status === 'shipped') return 'bg-blue-100 text-blue-800';
  if (status === 'processing') return 'bg-yellow-100 text-yellow-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

export default function Account() {
  const { user, authFetch, logout } = useCustomerAuth();
  const { items, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          authFetch(`${apiUrl}/me`),
          authFetch(`${apiUrl}/me/orders`),
        ]);

        if (!mounted) return;

        if (meRes.ok) {
          setProfile(await meRes.json());
        }

        if (ordersRes.ok) {
          setOrders(await ordersRes.json());
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load().catch(() => {
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [authFetch, apiUrl]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const activeOrders = orders.filter(
      (order) => order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    ).length;
    return { totalOrders, totalSpent, activeOrders };
  }, [orders]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container-custom">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500">Loading account...</div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name ?? user?.name ?? user?.email ?? 'Customer';
  const displayEmail = profile?.email ?? user?.email ?? '';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">{displayName}</p>
            <p className="text-sm text-gray-400">{displayEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Active Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Cart</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems} items</p>
            <p className="text-sm text-gray-500 mt-1">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Cart Summary</h2>
            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name} x {item.quantity}</span>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            <div className="mt-4 space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p className="text-xs text-gray-500">Ship to: {order.shipping_address}</p>
                      {Array.isArray(order.items)
                        ? order.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{item.name} x {item.quantity}</span>
                              <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
