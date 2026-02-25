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
  created_at?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_id?: string;
  customer?: string;
  email?: string;
  items: OrderItem[] | unknown;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  shipping_address?: string;
  shippingAddress?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string | null;
  created_at?: string;
  phone?: string;
  orders?: number;
  totalSpent?: number;
  joinedAt?: string;
  lastOrder?: string;
  status?: 'active' | 'inactive';
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

export interface AdminBlog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  published: boolean;
  created_at: string;
}

export interface AdminReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar: string | null;
  published: boolean;
  created_at: string;
}
