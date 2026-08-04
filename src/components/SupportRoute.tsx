import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissionCheck';

export const SupportRoute = () => {
  const { isAuthenticated, permissions, isAdmin } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const canAccessSupport = isAdmin || hasPermission(permissions, '@support/desk', 'read');
  const canAccessAnalytics = isAdmin || hasPermission(permissions, '@analytics/view', 'read');

  if (!canAccessSupport && !canAccessAnalytics) return <Navigate to="/" replace />;

  return <Outlet />;
};
