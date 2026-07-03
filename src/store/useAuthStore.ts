import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userEmail: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken, isAuthenticated: true }),
      setUser: (email) => set({ userEmail: email }),
      logout: () => set({ accessToken: null, refreshToken: null, userEmail: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // saves to localStorage automatically
    }
  )
);
