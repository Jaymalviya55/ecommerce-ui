 import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  email: string;
  phoneNumber: string | null;
}

export interface Address {
  id: number;
  fullName: string;
  phoneNumber: string;
  alternatePhone?: string;
  pincode: string;
  locality: string;
  streetAddress: string;
  city: string;
  state: string;
  landmark?: string;
  addressType: string;
  isDefault: boolean;
}

interface ProfileState {
  profile: UserProfile | null;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchAddresses: () => Promise<void>;
  addAddress: (data: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: number, data: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/profile');
      set({ profile: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data || 'Failed to load profile', isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.put('/profile', data);
      set((state) => ({ 
        profile: { ...state.profile, ...data } as UserProfile,
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.response?.data || 'Failed to update profile', isLoading: false });
      throw error;
    }
  },

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/profile/addresses');
      set({ addresses: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data || 'Failed to load addresses', isLoading: false });
    }
  },

  addAddress: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.post('/profile/addresses', data);
      // Ensure we re-fetch to get correct default status on others
      await get().fetchAddresses();
    } catch (error: any) {
      set({ error: error.response?.data || 'Failed to add address', isLoading: false });
      throw error;
    }
  },

  updateAddress: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.put(`/profile/addresses/${id}`, data);
      await get().fetchAddresses();
    } catch (error: any) {
      set({ error: error.response?.data || 'Failed to update address', isLoading: false });
      throw error;
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.delete(`/profile/addresses/${id}`);
      await get().fetchAddresses();
    } catch (error: any) {
      set({ error: error.response?.data || 'Failed to delete address', isLoading: false });
      throw error;
    }
  }
}));
