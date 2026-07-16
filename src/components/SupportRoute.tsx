import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const SupportRoute = () => {
  const { isAuthenticated, roles, isAdmin } = useAuthStore();
  const isSupport = roles.includes('SupportAgent');

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isAdmin && !isSupport) return <Navigate to="/" replace />;

  return <Outlet />;
};
