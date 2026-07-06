import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    // If logged in but not an admin, send them to the normal profile or home
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};
