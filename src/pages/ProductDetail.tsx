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
    <div className="flex justify-center items-center h-64 mt-20">
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-primary transition-colors font-medium group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </Link>
      </div>
      
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden lg:h-[600px] flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-72 lg:h-full bg-slate-700/30 relative overflow-hidden group flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img src={product.imageUrl || getProductImage(product.name)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link 
                to={`/category/${product.category?.name?.toLowerCase()}`} 
                className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wide hover:bg-primary/20 transition-colors mb-4"
              >
                {product.category?.name || 'Uncategorized'}
              </Link>
              <h1 className="text-2xl font-black text-white sm:text-5xl tracking-tight leading-tight">{product.name}</h1>
            </div>
          </div>
          
          <div className="mt-2 sm:mt-4 border-t border-slate-700/50 pt-4 sm:pt-6">
            <h2 className="sr-only">Product Description</h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6 sm:mt-8 flex items-center sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-400 mb-0.5 sm:mb-1">Price</p>
              <p className="text-2xl sm:text-5xl font-black text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">₹{product.price.toFixed(2)}</p>
            </div>
            <div className="shrink-0 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-emerald-400 font-medium bg-emerald-400/10 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-emerald-400/20">
              <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="whitespace-nowrap">{product.stockQuantity} in stock</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-10">
            <button
              onClick={() => addToCart(product.id, 1)}
              className="w-full bg-primary hover:bg-primary-dark border border-transparent rounded-lg sm:rounded-2xl py-2.5 sm:py-4 px-4 sm:px-8 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-lg font-bold text-white transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 group"
            >
              <ShoppingCart size={18} className="sm:w-[22px] sm:h-[22px] group-hover:-translate-x-1 transition-transform" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Reviews Section */}
      <ProductReviews productId={Number(id)} />
    </motion.div>
  );
};
