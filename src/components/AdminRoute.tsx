import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissionCheck';

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, permissions } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const canAccessAdmin = isAdmin || hasPermission(permissions, '@admin/all', 'read');

  if (!canAccessAdmin) {
    // If logged in but not an admin, send them to the normal profile or home
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};
