import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './RequireAuth';
import RequireRole from './RequireRole';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';
import Blogs from './pages/Blogs';
import Reviews from './pages/Reviews';
import NewBlog from './pages/NewBlog';
import EditBlog from './pages/EditBlog';
import NewReview from './pages/NewReview';
import EditReview from './pages/EditReview';
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
              <Route element={<RequireRole roles={['admin', 'manager']} />}>
                <Route path="products/new" element={<NewProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
              </Route>
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/new" element={<NewBlog />} />
              <Route path="blogs/edit/:id" element={<EditBlog />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="reviews/new" element={<NewReview />} />
              <Route path="reviews/edit/:id" element={<EditReview />} />
              <Route element={<RequireRole roles={['admin', 'manager']} />}>
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
              </Route>
              <Route element={<RequireRole roles={['admin']} />}>
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AdminProvider>
    </AuthProvider>
  );
}
