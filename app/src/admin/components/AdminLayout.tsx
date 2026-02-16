import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  Star,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'staff'] },
  { path: '/admin/products', label: 'Products', icon: Package, roles: ['admin', 'manager', 'staff'] },
  { path: '/admin/blogs', label: 'Blogs', icon: BookOpen, roles: ['admin', 'manager', 'staff'] },
  { path: '/admin/reviews', label: 'Reviews', icon: Star, roles: ['admin', 'manager', 'staff'] },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart, roles: ['admin', 'manager'] },
  { path: '/admin/customers', label: 'Customers', icon: Users, roles: ['admin', 'manager'] },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
  { path: '/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Store className="w-8 h-8 text-[#ff4b2f] flex-shrink-0" />
            <span
              className={`ml-3 font-bold text-xl text-gray-900 transition-opacity duration-200 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
              }`}
            >
              Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => (user?.role ? item.roles.includes(user.role) : false))
              .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#ff4b2f]/10 text-[#ff4b2f]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`ml-3 font-medium transition-opacity duration-200 ${
                      isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Back to Store */}
          <div className="p-3 border-t border-gray-100">
            <NavLink
              to="/"
              className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <Store className="w-5 h-5 flex-shrink-0" />
              <span
                className={`ml-3 font-medium transition-opacity duration-200 ${
                  isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
                }`}
              >
                Back to Store
              </span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff4b2f] rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#ff4b2f] rounded-full flex items-center justify-center text-white font-medium text-sm">
                  AD
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  Admin User
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
