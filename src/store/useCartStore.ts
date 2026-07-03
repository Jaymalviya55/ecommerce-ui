import { create } from 'zustand';
import  type { Product } from './useProductStore';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
}

interface CartStore {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  isCheckoutModalOpen: boolean;
  
  toggleCart: () => void;
  toggleCheckoutModal: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  checkout: (email: string, address: string) => Promise<void>;
}

// Generate a random session ID for the user if one doesn't exist
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}
const API_URL = `${API_BASE_URL}/carts`;

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isOpen: false,
  isCheckoutModalOpen: false,
  isLoading: false,
  error: null,
  sessionId: getSessionId(),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCheckoutModal: () => set((state) => {
    // If we are opening the checkout modal, close the cart sidebar
    if (!state.isCheckoutModalOpen) {
      return { isCheckoutModalOpen: true, isOpen: false };
    }
    return { isCheckoutModalOpen: false };
  }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/${get().sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const cart = await response.json();
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToCart: async (productId: number, quantity: number) => {
    set({ isLoading: true, isOpen: true }); // Open cart when adding
    try {
      const response = await fetch(`${API_URL}/${get().sessionId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const cart = await response.json();
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeFromCart: async (productId: number) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/${get().sessionId}/items/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item');
      
      // Update local state instead of refetching for speed
      set((state) => ({
        cart: state.cart ? {
          ...state.cart,
          items: state.cart.items.filter(i => i.productId !== productId)
        } : null,
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  checkout: async (email: string, address: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: get().sessionId, email, address }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Checkout failed');
      }
      
      // On success, clear the cart in state and close the cart sidebar
      set({ cart: null, isOpen: false });
    } catch (error: any) {
      throw error;
    }
  },
}));
