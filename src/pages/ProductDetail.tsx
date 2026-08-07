import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../store/useProductStore';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { getProductImage } from '../utils/imageMap';
import { ProductReviews } from '../components/ProductReviews';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        if (API_URL && !API_URL.endsWith('/api')) {
            API_URL = API_URL.replace(/\/$/, '') + '/api';
        }
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 mt-20 min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error || !product) return (
    <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl max-w-2xl mx-auto mt-20">
      <p className="font-semibold">{error || 'Product not found'}</p>
      <Link to="/" className="inline-block mt-4 text-primary hover:text-white transition-colors underline">Return to Shop</Link>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* Left Side: Sticky Image */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-32 h-[50vh] lg:h-[75vh] rounded-[2.5rem] bg-slate-100 dark:bg-slate-800/50 relative overflow-hidden group shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 dark:from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
          {isImageLoading && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse z-0" />
          )}
          <img 
            src={product.imageUrl || getProductImage(product.name)} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${isImageLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-110'}`} 
            width={800} 
            height={800} 
            onLoad={() => setIsImageLoading(false)}
          />
        </div>
        
        {/* Right Side: Scrollable Content & Reviews */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link 
                to={`/category/${product.category?.name?.toLowerCase()}`} 
                className="inline-block px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-xs font-black text-white dark:text-slate-900 uppercase tracking-widest hover:scale-105 transition-transform mb-6"
              >
                {product.category?.name || 'Uncategorized'}
              </Link>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-6xl tracking-tight leading-[1.1]">{product.name}</h1>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6">
            <h2 className="sr-only">Product Description</h2>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{product.description}</p>
          </div>

          <div className="mt-10 sm:mt-12 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Price</p>
              <p className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white">₹{product.price.toFixed(2)}</p>
            </div>
            <div className={`shrink-0 flex items-center space-x-2 text-sm font-bold px-4 py-2.5 rounded-2xl border-2 ${product.stockQuantity <= 15 ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50'}`}>
              <CheckCircle2 size={18} />
              <span className="whitespace-nowrap">{product.stockQuantity} in stock</span>
            </div>
          </div>

          <div className="mt-12 mb-16">
            <button
              onClick={() => addToCart(product.id, 1)}
              className="w-full relative flex justify-center items-center space-x-3 px-8 py-5 rounded-2xl font-black text-white bg-gradient-to-r from-primary via-indigo-500 to-purple-500 hover:from-primary-dark hover:to-purple-600 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              <ShoppingCart size={24} className="relative z-10 group-hover:-translate-x-1 transition-transform" />
              <span className="relative z-10 text-xl tracking-wide">Add to Cart</span>
            </button>
          </div>
          
          {/* Product Reviews Section inline on the right side */}
          <div className="border-t-2 border-slate-100 dark:border-slate-800/50 pt-16">
            <ProductReviews productId={Number(id)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
