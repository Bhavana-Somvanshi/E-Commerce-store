import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Truck, Wallet } from 'lucide-react';
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

function paymentClasses(status: CustomerOrder['payment_status']) {
  if (status === 'paid') return 'bg-green-100 text-green-800';
  if (status === 'refunded') return 'bg-gray-100 text-gray-800';
  if (status === 'failed') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
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
        const [meRes, ordersRes] = await Promise.all([authFetch(`${apiUrl}/me`), authFetch(`${apiUrl}/me/orders`)]);

        if (!mounted) return;

        if (meRes.ok) {
          setProfile(await meRes.json());
        }

        if (ordersRes.ok) {
          const payload = (await ordersRes.json()) as CustomerOrder[];
          setOrders(
            payload.map((order) => ({
              ...order,
              total: Number(order.total),
              items: Array.isArray(order.items)
                ? order.items.map((item) => ({
                    ...item,
                    price: Number(item.price),
                    quantity: Number(item.quantity),
                  }))
                : [],
            }))
          );
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
    const totalSpent = orders
      .filter((order) => order.payment_status === 'paid' || order.payment_status === 'refunded')
      .reduce((sum, order) => sum + Number(order.total), 0);
    const activeOrders = orders.filter(
      (order) => order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    ).length;
    const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
    const latestOrder = orders[0] ?? null;
    const totalUnits = orders.reduce((sum, order) => {
      if (!Array.isArray(order.items)) return sum;
      return sum + order.items.reduce((itemSum, item) => itemSum + Number(item.quantity), 0);
    }, 0);

    return { totalOrders, totalSpent, activeOrders, deliveredOrders, latestOrder, totalUnits };
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
  const firstName = displayName.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ff4b2f]">Customer Account</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Welcome back, {firstName}</h1>
            <p className="text-gray-500 mt-2">Track your orders, review your cart, and keep your checkout details in one place.</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">{displayName}</span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">{displayEmail}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="self-start px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Orders</p>
              <Package className="w-5 h-5 text-[#ff4b2f]" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-2">{stats.deliveredOrders} delivered successfully</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Active Orders</p>
              <Truck className="w-5 h-5 text-[#ff4b2f]" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{stats.activeOrders}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.latestOrder ? `Latest: ${stats.latestOrder.status}` : 'No shipments yet'}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Spent</p>
              <Wallet className="w-5 h-5 text-[#ff4b2f]" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">${stats.totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">{stats.totalUnits} items purchased overall</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Saved Cart</p>
              <ShoppingBag className="w-5 h-5 text-[#ff4b2f]" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{totalItems} items</p>
            <p className="text-sm text-gray-500 mt-2">${totalPrice.toFixed(2)} ready for checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Snapshot</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-900 mt-1">{displayName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 mt-1">{displayEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500">Latest Order</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {stats.latestOrder ? `${stats.latestOrder.id} on ${formatDate(stats.latestOrder.created_at)}` : 'No orders yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900">Cart Summary</h2>
              <div className="mt-4 space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500">Your cart is empty, but it now stays saved after refresh.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="text-gray-900 font-medium">{item.name}</p>
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-500 mt-1">All orders placed from your account appear here.</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {orders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6">
                  <p className="text-gray-900 font-medium">No orders yet</p>
                  <p className="text-gray-500 mt-2 text-sm">
                    Add products to your cart and complete checkout from the storefront to see orders here.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        <p className="text-xs text-gray-500 mt-2">Ship to: {order.shipping_address}</p>
                      </div>
                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <p className="font-semibold text-gray-900">${Number(order.total).toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentClasses(order.payment_status)}`}>
                          Payment: {order.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-600">
                      {Array.isArray(order.items)
                        ? order.items.map((item, index) => (
                            <div key={index} className="flex justify-between gap-4">
                              <span>
                                {item.name} x {item.quantity}
                              </span>
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
