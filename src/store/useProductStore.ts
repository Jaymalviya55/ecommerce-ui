import { create } from 'zustand'

export interface Category {
    id: number
    name: string
}

export interface Product {
    id: number
    name: string
    description: string
    price: number
    stockQuantity: number
    categoryId: number
    category: Category | null
}

interface ProductState {
    products: Product[]
    isLoading: boolean
    error: string | null
    fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    isLoading: false,
    error: null,
    fetchProducts: async () => {
        set({ isLoading: true, error: null })
        try {
            let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            if (API_URL && !API_URL.endsWith('/api')) {
                API_URL = API_URL.replace(/\/$/, '') + '/api';
            }
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products')
            const data = await response.json()
            set({ products: data, isLoading: false })
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
        }
    }
}))
