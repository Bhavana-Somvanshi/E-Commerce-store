export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  image: string;
  status: 'active' | 'inactive' | 'out_of_stock' | 'low_stock';
  sales: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
}
