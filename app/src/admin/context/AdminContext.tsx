import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import type {
  AdminProduct,
  Order,
  Customer,
  AdminBlog,
  AdminReview,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

interface AdminContextType {
  products: AdminProduct[];
  orders: Order[];
  customers: Customer[];
  blogs: AdminBlog[];
  reviews: AdminReview[];
  updateOrderStatus: (id: string, status: Order['status'], paymentStatus?: Order['payment_status']) => Promise<void>;
  getDashboardStats: () => {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
  };
  loadAll: () => Promise<void>;
  addProduct: (product: Omit<AdminProduct, 'id' | 'sales' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBlog: (blog: Omit<AdminBlog, 'id' | 'created_at'>) => Promise<void>;
  updateBlog: (id: string, blog: Partial<AdminBlog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  addReview: (review: Omit<AdminReview, 'id' | 'created_at'>) => Promise<void>;
  updateReview: (id: string, review: Partial<AdminReview>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { authFetch, user } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);

  const loadAll = useCallback(async () => {
    const requests: Array<Promise<Response>> = [];
    requests.push(authFetch(`${API_URL}/admin/products`));
    requests.push(authFetch(`${API_URL}/admin/blogs`));
    requests.push(authFetch(`${API_URL}/admin/reviews`));

    if (user?.role === 'admin' || user?.role === 'manager') {
      requests.push(authFetch(`${API_URL}/admin/orders`));
      requests.push(authFetch(`${API_URL}/admin/customers`));
    }

    const responses = await Promise.all(requests);
    const [productsRes, blogsRes, reviewsRes, ordersRes, customersRes] = responses;

    if (productsRes.ok) {
      setProducts(await productsRes.json());
    }
    if (ordersRes?.ok) {
      setOrders(await ordersRes.json());
    }
    if (customersRes?.ok) {
      setCustomers(await customersRes.json());
    }
    if (blogsRes.ok) {
      setBlogs(await blogsRes.json());
    }
    if (reviewsRes.ok) {
      setReviews(await reviewsRes.json());
    }
  }, [authFetch, user?.role]);

  useEffect(() => {
    loadAll().catch(() => null);
  }, [loadAll]);

  const addProduct = useCallback(
    async (product: Omit<AdminProduct, 'id' | 'sales' | 'created_at'>) => {
      const res = await authFetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to create product.');
      const created = (await res.json()) as AdminProduct;
      setProducts((prev) => [created, ...prev]);
    },
    [authFetch]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<AdminProduct>) => {
      const res = await authFetch(`${API_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update product.');
      const updated = (await res.json()) as AdminProduct;
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    },
    [authFetch]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const res = await authFetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product.');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    [authFetch]
  );

  const addBlog = useCallback(
    async (blog: Omit<AdminBlog, 'id' | 'created_at'>) => {
      const res = await authFetch(`${API_URL}/admin/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      if (!res.ok) throw new Error('Failed to create blog.');
      const created = (await res.json()) as AdminBlog;
      setBlogs((prev) => [created, ...prev]);
    },
    [authFetch]
  );

  const updateBlog = useCallback(
    async (id: string, updates: Partial<AdminBlog>) => {
      const res = await authFetch(`${API_URL}/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update blog.');
      const updated = (await res.json()) as AdminBlog;
      setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
    },
    [authFetch]
  );

  const deleteBlog = useCallback(
    async (id: string) => {
      const res = await authFetch(`${API_URL}/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete blog.');
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    },
    [authFetch]
  );

  const addReview = useCallback(
    async (review: Omit<AdminReview, 'id' | 'created_at'>) => {
      const res = await authFetch(`${API_URL}/admin/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error('Failed to create review.');
      const created = (await res.json()) as AdminReview;
      setReviews((prev) => [created, ...prev]);
    },
    [authFetch]
  );

  const updateReview = useCallback(
    async (id: string, updates: Partial<AdminReview>) => {
      const res = await authFetch(`${API_URL}/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update review.');
      const updated = (await res.json()) as AdminReview;
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    },
    [authFetch]
  );

  const deleteReview = useCallback(
    async (id: string) => {
      const res = await authFetch(`${API_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete review.');
      setReviews((prev) => prev.filter((r) => r.id !== id));
    },
    [authFetch]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: Order['status'], paymentStatus?: Order['payment_status']) => {
      const res = await authFetch(`${API_URL}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order.');
      const updated = (await res.json()) as Order;
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    },
    [authFetch]
  );

  const value = useMemo(
    () => ({
      products,
      orders,
      customers,
      blogs,
      reviews,
      getDashboardStats: () => {
        const totalRevenue = orders
          .filter((o) => o.payment_status === 'paid')
          .reduce((sum, o) => sum + Number(o.total), 0);
        const pendingOrders = orders.filter((o) => o.status === 'pending').length;
        const lowStockProducts = products.filter(
          (p) => p.status === 'low_stock' || p.status === 'out_of_stock'
        ).length;

        return {
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalProducts: products.length,
          pendingOrders,
          lowStockProducts,
        };
      },
      loadAll,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlog,
      updateBlog,
      deleteBlog,
      addReview,
      updateReview,
      deleteReview,
      updateOrderStatus,
    }),
    [
      products,
      orders,
      customers,
      blogs,
      reviews,
      orders.length,
      customers.length,
      products.length,
      loadAll,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlog,
      updateBlog,
      deleteBlog,
      addReview,
      updateReview,
      deleteReview,
      updateOrderStatus,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}





