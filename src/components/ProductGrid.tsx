import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore'
import { useCartStore } from '../store/useCartStore'
import { ShoppingCart } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { getProductImage } from '../utils/imageMap'

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export const ProductGrid = () => {
    const { products, isLoading, error, fetchProducts } = useProductStore()
    const { addToCart } = useCartStore()

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )
    
    if (error) return (
        <div className="p-8 text-center bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl max-w-2xl mx-auto mt-12">
            <p className="font-semibold">{error}</p>
        </div>
    )

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-10 mt-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">New Arrivals</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Discover our premium collection tailored for you.</p>
                </div>
            </div>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {products.map(product => (
                    <motion.div 
                        variants={item}
                        key={product.id} 
                        className="group bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/10 hover:-translate-y-1"
                    >
                        <Link to={`/product/${product.id}`} className="block h-56 bg-slate-100 dark:bg-slate-700/30 relative overflow-hidden flex items-center justify-center">
                            <img src={product.imageUrl || getProductImage(product.name)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        </Link>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-primary uppercase mb-1">
                                        {product.category?.name || 'Uncategorized'}
                                    </div>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
                                    </Link>
                                </div>
                                <span className="text-lg font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-xl">
                                    ₹{product.price}
                                </span>
                            </div>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">{product.description}</p>
                            
                            <button 
                                onClick={() => addToCart(product.id, 1)}
                                className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary dark:hover:bg-primary text-slate-700 dark:text-white hover:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 group/btn"
                            >
                                <ShoppingCart size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            {products.length === 0 && (
                <div className="text-center bg-white/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-16 mt-8 shadow-sm dark:shadow-none">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">No products found in the database.</p>
                </div>
            )}
        </div>
    )
}
