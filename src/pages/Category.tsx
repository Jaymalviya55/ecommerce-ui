import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { motion, type Variants } from 'framer-motion';
import { ShoppingCart, ArrowLeft, PackageSearch } from 'lucide-react';
import { getProductImage } from '../utils/imageMap';

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
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } }
}

export const Category = () => {
  const { name } = useParams<{ name: string }>();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const filteredProducts = useMemo(() => {
    if (!name || !products) return [];
    return products.filter(
      p => p.category?.name?.toLowerCase() === name.toLowerCase()
    );
  }, [products, name]);

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 mt-20 min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl max-w-2xl mx-auto mt-20">
        <p className="font-semibold">{error}</p>
        <Link to="/" className="inline-block mt-4 text-primary hover:text-primary-dark dark:hover:text-white transition-colors underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-10 mt-6">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium group mb-6">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </Link>
        <h2 className="text-5xl font-black text-slate-900 dark:text-white capitalize tracking-tight">{name}</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-medium">
          Showing <span className="text-slate-900 dark:text-white">{filteredProducts.length}</span> premium products
        </p>
      </div>

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
            className="group bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl overflow-hidden hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
          >
            <Link to={`/product/${product.id}`} className="block h-56 bg-slate-50 dark:bg-slate-700/30 relative overflow-hidden flex items-center justify-center">
                <img src={product.imageUrl || getProductImage(product.name)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" width={400} height={400} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            </Link>
            
            <div className="p-6 flex flex-col flex-1">
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
                
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <button 
                      onClick={() => addToCart(product.id, 1)}
                      className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary text-slate-900 hover:text-white dark:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 group/btn"
                  >
                      <ShoppingCart size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                      <span>Add to Cart</span>
                  </button>
                </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-3xl py-24 mt-8 flex flex-col items-center justify-center"
        >
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-700/30 rounded-full flex items-center justify-center mb-6">
            <PackageSearch size={40} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-md">We couldn't find any products in the "{name}" category at the moment.</p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
            <ArrowLeft size={18} />
            <span>Browse all products</span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
