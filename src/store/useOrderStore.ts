import { create } from 'zustand';
import axiosClient from '../api/axiosClient';
import axios from 'axios';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  customerEmail?: string;
  trackingNumber?: string;
  carrierName?: string;
  items: OrderItem[];
}

interface OrderState {
  myOrders: Order[];
  allOrders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchMyOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  shipOrder: (id: number, trackingNumber: string, carrierName: string) => Promise<void>;
  deliverOrder: (id: number) => Promise<void>;
  cancelOrder: (id: number) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  myOrders: [],
  allOrders: [],
  isLoading: false,
  error: null,
  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/orders/my-orders');
      set({ myOrders: response.data, isLoading: false });
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? (typeof err.response?.data === 'string' ? err.response.data : err.message)
        : err instanceof Error ? err.message : String(err);
      set({ error: message, isLoading: false });
    }
  },
  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/orders/all');
      set({ allOrders: response.data, isLoading: false });
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? (typeof err.response?.data === 'string' ? err.response.data : err.message)
        : err instanceof Error ? err.message : String(err);
      set({ error: message, isLoading: false });
    }
  },
  shipOrder: async (id: number, trackingNumber: string, carrierName: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.put(`/orders/${id}/ship`, { trackingNumber, carrierName });
      await get().fetchAllOrders();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? (typeof err.response?.data === 'string' ? err.response.data : err.message)
        : err instanceof Error ? err.message : String(err);
      set({ error: message, isLoading: false });
      throw err;
    }
  },
  deliverOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.put(`/orders/${id}/deliver`);
      await get().fetchAllOrders();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? (typeof err.response?.data === 'string' ? err.response.data : err.message)
        : err instanceof Error ? err.message : String(err);
      set({ error: message, isLoading: false });
      throw err;
    }
  },
  cancelOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.put(`/orders/${id}/cancel`);
      await get().fetchAllOrders();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? (typeof err.response?.data === 'string' ? err.response.data : err.message)
        : err instanceof Error ? err.message : String(err);
      set({ error: message, isLoading: false });
      throw err;
    }
  }
}));
