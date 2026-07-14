import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, Search as SearchIcon } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { getProductImage } from '../utils/imageMap';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } }
};

export const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const { products, isLoading, fetchProducts } = useProductStore();
    const { addToCart } = useCartStore();
    
    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products.length]);

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="w-full py-8">
            <div className="mb-10">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Search Results
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for <span className="text-slate-900 dark:text-white font-bold">"{query}"</span>
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredProducts.length > 0 ? (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredProducts.map(product => (
                        <motion.div 
                            variants={item}
                            key={product.id} 
                            className="group bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                        >
                            <Link to={`/product/${product.id}`} className="block h-56 bg-slate-50 dark:bg-slate-700/30 relative overflow-hidden flex items-center justify-center">
                                <img src={product.imageUrl || getProductImage(product.name)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" width={400} height={400} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                            </Link>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-xs font-bold tracking-wider text-primary uppercase mb-1">
                                            {product.category?.name || 'Uncategorized'}
                                        </div>
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
                                        </Link>
                                    </div>
                                    <span className="text-lg font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-xl">
                                        ₹{product.price}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">{product.description}</p>
                                
                                <button 
                                    onClick={() => addToCart(product.id, 1)}
                                    className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary text-slate-900 hover:text-white dark:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 group/btn"
                                >
                                    <ShoppingCart size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center bg-white/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-20 mt-8 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                        <SearchIcon size={32} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">
                        We couldn't find anything matching "{query}". Try checking your spelling or searching for a more general term.
                    </p>
                    <Link to="/" className="mt-8 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                        Clear Search
                    </Link>
                </div>
            )}
        </div>
    );
};
