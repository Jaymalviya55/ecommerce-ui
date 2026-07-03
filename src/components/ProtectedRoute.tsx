import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  onShowLogin: () => void;
}

export const ProtectedRoute = ({ onShowLogin }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Optionally trigger the login modal when redirecting
    onShowLogin();
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
