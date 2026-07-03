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
            const response = await fetch('http://localhost:8080/api/products')
            if (!response.ok) throw new Error('Failed to fetch products')
            const data = await response.json()
            set({ products: data, isLoading: false })
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
        }
    }
}))
