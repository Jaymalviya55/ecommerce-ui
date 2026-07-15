import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const FulfillmentRoute = () => {
  const { isAuthenticated, roles } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  if (!roles.includes('Admin') && !roles.includes('FulfillmentStaff')) {
      return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};
