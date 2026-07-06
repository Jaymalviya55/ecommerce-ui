import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
      isAdmin: false,
      setTokens: (accessToken, refreshToken) => {
        let decoded: any = null;
        try {
          decoded = jwtDecode(accessToken);
          console.log("JWT-DECODE output:", decoded);
        } catch (e) {
          console.error("Failed to decode token", e);
        }
        const roleClaim = decoded?.role || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log("Role Claim found:", roleClaim);
        const isAdmin = roleClaim === 'Admin' || (Array.isArray(roleClaim) && roleClaim.includes('Admin'));
        console.log("Is Admin evaluated to:", isAdmin);
        
        set({ accessToken, refreshToken, isAuthenticated: true, isAdmin });
      },
      setUser: (email) => set({ userEmail: email }),
      logout: () => set({ accessToken: null, refreshToken: null, userEmail: null, isAuthenticated: false, isAdmin: false }),
    }),
    {
      name: 'auth-storage', // saves to localStorage automatically
    }
  )
);
