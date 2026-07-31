import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosClient from '../api/axiosClient';

interface AuthState {
  userEmail: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roles: string[];
  permissions: Record<string, string[]>;
  setAuthData: (user: { id: string, email: string, roles: string[], permissions?: Record<string, string[]> }) => void;
  fetchUserInfo: () => Promise<void>;
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
      permissions: {},
      setAuthData: (user) => {
        const isAdmin = user.roles.includes('Admin');
        set({ 
            userEmail: user.email, 
            userId: user.id, 
            roles: user.roles, 
            isAdmin, 
            permissions: user.permissions || {},
            isAuthenticated: true 
        });
      },
      fetchUserInfo: async () => {
        try {
          const response = await axiosClient.get('/auth/user-info');
          const data = response.data;
          const isAdmin = data.roles.includes('Admin');
          set({
            userEmail: data.email,
            userId: data.userId,
            roles: data.roles,
            isAdmin,
            permissions: data.permissions || {},
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Error fetching user info permissions:', error);
        }
      },
      logout: () => {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('cart_session_id');
        set({ userEmail: null, userId: null, isAuthenticated: false, isAdmin: false, roles: [], permissions: {} });
      },
    }),
    {
      name: 'auth-storage', // saves to localStorage automatically
    }
  )
);
