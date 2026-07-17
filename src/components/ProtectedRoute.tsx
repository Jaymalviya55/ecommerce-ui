import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  onShowLogin: () => void;
}

export const ProtectedRoute = ({ onShowLogin }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      onShowLogin();
    }
  }, [isAuthenticated, onShowLogin]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
