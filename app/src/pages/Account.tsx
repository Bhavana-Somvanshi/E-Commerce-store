import { useEffect, useState } from 'react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface CustomerOrder {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  shipping_address: string;
  items: OrderItem[] | unknown;
  created_at: string;
  updated_at: string;
}

export default function Account() {
  const { user, authFetch, logout } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    authFetch(`${apiUrl}/me/orders`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setOrders(data))
      .catch(() => null);
  }, [authFetch]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-500 mt-1">
              {user?.name ?? user?.email}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          <div className="mt-4 space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    {Array.isArray(order.items)
                      ? order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
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
  );
}
