import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './RequireAuth';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

export default function AdminRouter() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="*" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AdminProvider>
    </AuthProvider>
  );
}
