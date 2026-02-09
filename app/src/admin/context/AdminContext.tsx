import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AdminProduct, Order, Customer } from '../types';
import { adminProducts, orders, customers } from '../data/mockData';

interface AdminContextType {
  products: AdminProduct[];
  orders: Order[];
  customers: Customer[];
  addProduct: (product: Omit<AdminProduct, 'id' | 'sales' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  getProductById: (id: string) => AdminProduct | undefined;
  getOrderById: (id: string) => Order | undefined;
  getCustomerById: (id: string) => Customer | undefined;
  getDashboardStats: () => {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(adminProducts);
  const [ordersList, setOrders] = useState<Order[]>(orders);
  const [customersList] = useState<Customer[]>(customers);

  const addProduct = useCallback((product: Omit<AdminProduct, 'id' | 'sales' | 'createdAt'>) => {
    const newProduct: AdminProduct = {
      ...product,
      id: `PROD-${Date.now()}`,
      sales: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  }, []);

  const updatePaymentStatus = useCallback((orderId: string, status: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getOrderById = useCallback(
    (id: string) => ordersList.find((o) => o.id === id),
    [ordersList]
  );

  const getCustomerById = useCallback(
    (id: string) => customersList.find((c) => c.id === id),
    [customersList]
  );

  const getDashboardStats = useCallback(() => {
    const totalRevenue = ordersList
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = ordersList.filter((o) => o.status === 'pending').length;
    const lowStockProducts = products.filter(
      (p) => p.status === 'low_stock' || p.status === 'out_of_stock'
    ).length;

    return {
      totalRevenue,
      totalOrders: ordersList.length,
      totalCustomers: customersList.length,
      totalProducts: products.length,
      pendingOrders,
      lowStockProducts,
    };
  }, [ordersList, products, customersList]);

  return (
    <AdminContext.Provider
      value={{
        products,
        orders: ordersList,
        customers: customersList,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updatePaymentStatus,
        getProductById,
        getOrderById,
        getCustomerById,
        getDashboardStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
