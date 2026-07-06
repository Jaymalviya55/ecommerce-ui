import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../store/useProductStore';

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

  if (isLoading) return <div className="p-12 text-center text-xl text-gray-500">Loading product details...</div>;
  if (error || !product) return <div className="p-12 text-center text-xl text-red-500">{error || 'Product not found'}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          &larr; Back to Shop
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div className="aspect-w-3 aspect-h-2 bg-gray-200 flex items-center justify-center p-24 text-6xl">
          📸
        </div>
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-start">
            <div>
              <Link 
                to={`/category/${product.category?.name?.toLowerCase()}`} 
                className="text-sm font-semibold text-indigo-600 uppercase tracking-wide hover:underline"
              >
                {product.category?.name || 'Uncategorized'}
              </Link>
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">{product.name}</h1>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="sr-only">Product Description</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-4xl font-black text-gray-900">₹{product.price.toFixed(2)}</p>
            <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span>{product.stockQuantity} in stock</span>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={() => addToCart(product.id, 1)}
              className="w-full bg-indigo-600 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform transition hover:-translate-y-0.5"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
