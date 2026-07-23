import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userEmail: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roles: string[];
  setAuthData: (user: { id: string, email: string, roles: string[] }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userEmail: null,
      userId: null,
      isAuthenticated: false,
      isAdmin: false,
      roles: [],
      setAuthData: (user) => {
        const isAdmin = user.roles.includes('Admin');
        set({ 
            userEmail: user.email, 
            userId: user.id, 
            roles: user.roles, 
            isAdmin, 
            isAuthenticated: true 
        });
      },
      logout: () => {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('cart_session_id');
        set({ userEmail: null, userId: null, isAuthenticated: false, isAdmin: false, roles: [] });
      },
    }),
    {
      name: 'auth-storage', // saves to localStorage automatically
    }
  )
);
