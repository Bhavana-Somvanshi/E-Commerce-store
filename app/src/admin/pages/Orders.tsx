import { useState } from 'react';
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import type { Order } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-gray-100 text-gray-800' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-blue-100 text-blue-800' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
];

export default function Orders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">
            Manage and track customer orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statusOptions.map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          const Icon = status.icon;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`p-4 rounded-xl border transition-all ${
                statusFilter === status.value
                  ? 'border-[#ff4b2f] bg-[#ff4b2f]/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{status.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20 focus:border-[#ff4b2f]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4b2f]/20 focus:border-[#ff4b2f]"
        >
          <option value="all">All Orders</option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Payment
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                  Total
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <>
                            {order.status === 'pending' && (
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Mark Processing
                              </DropdownMenuItem>
                            )}
                            {order.status === 'processing' && (
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Mark Shipped
                              </DropdownMenuItem>
                            )}
                            {order.status === 'shipped' && (
                              <DropdownMenuItem
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Delivered
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <DropdownMenuItem
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-medium text-gray-900">{selectedOrder.customer}</p>
                  <p className="text-gray-600">{selectedOrder.email}</p>
                  <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-900">Total</p>
                <p className="text-2xl font-bold text-[#ff4b2f]">
                  ${selectedOrder.total.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="flex gap-2">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'processing');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#ff4b2f] text-white rounded-lg hover:bg-[#e63e24] transition-colors"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Mark Processing
                    </button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'shipped');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#ff4b2f] text-white rounded-lg hover:bg-[#e63e24] transition-colors"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Mark Shipped
                    </button>
                  )}
                  {selectedOrder.status === 'shipped' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'delivered');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Delivered
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
