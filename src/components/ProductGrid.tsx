import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore'
import { useCartStore } from '../store/useCartStore'

export const ProductGrid = () => {
    const { products, isLoading, error, fetchProducts } = useProductStore()
    const { addToCart } = useCartStore()

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    if (isLoading) return <div className="p-8 text-center text-gray-500 text-xl font-semibold">Loading products...</div>
    if (error) return <div className="p-8 text-center text-red-500 text-xl font-semibold">Error: {error}</div>

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <Link to={`/product/${product.id}`} className="block h-48 bg-gray-200 flex items-center justify-center hover:opacity-80 transition-opacity">
                            <span className="text-gray-400 text-4xl">📸</span>
                        </Link>
                        <div className="p-6">
                            <div className="text-sm text-indigo-600 font-semibold mb-1">
                                {product.category?.name || 'Uncategorized'}
                            </div>
                            <Link to={`/product/${product.id}`}>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">{product.name}</h3>
                            </Link>
                            <p className="text-gray-600 mb-4 h-12 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => addToCart(product.id, 1)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {products.length === 0 && (
                <div className="text-center text-gray-500 py-12">No products found in the database.</div>
            )}
        </div>
    )
}
