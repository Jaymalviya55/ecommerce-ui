import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissionCheck';

export const SupportRoute = () => {
  const { isAuthenticated, permissions, isAdmin } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const canAccessSupport = isAdmin || hasPermission(permissions, 'Support', 'read');
  const canAccessAnalytics = isAdmin || hasPermission(permissions, 'Analytics', 'read');

  if (!canAccessSupport && !canAccessAnalytics) return <Navigate to="/" replace />;

  return <Outlet />;
};
