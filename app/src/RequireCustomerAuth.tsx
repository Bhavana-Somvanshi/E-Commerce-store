import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCustomerAuth } from './context/CustomerAuthContext';

export default function RequireCustomerAuth() {
  const { user, isLoading } = useCustomerAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Checking session…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
