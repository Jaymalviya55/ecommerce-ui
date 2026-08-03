import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissionCheck';

export const FulfillmentRoute = () => {
  const { isAuthenticated, permissions, isAdmin } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  const canAccessFulfillment = isAdmin || hasPermission(permissions, 'Fulfillment', 'read');

  if (!canAccessFulfillment) {
      return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};
