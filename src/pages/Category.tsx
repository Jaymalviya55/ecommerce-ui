import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';

export const Category = () => {
  const { name } = useParams<{ name: string }>();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    // Only fetch if we don't have products yet (to avoid unnecessary network requests)
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
    return <div className="p-12 text-center text-xl text-gray-500">Loading category...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mb-4">
          &larr; Back to Shop
        </Link>
        <h2 className="text-4xl font-extrabold text-gray-900 capitalize">{name}</h2>
        <p className="mt-2 text-lg text-gray-500">Showing {filteredProducts.length} products in this category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <Link to={`/product/${product.id}`} className="block h-48 bg-gray-200 flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-gray-400 text-4xl">📸</span>
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <div className="text-sm text-indigo-600 font-semibold mb-1">
                {product.category?.name || 'Uncategorized'}
              </div>
              <Link to={`/product/${product.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">{product.name}</h3>
              </Link>
              <p className="text-gray-600 mb-4 h-12 line-clamp-2">{product.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product.id, 1)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-xl font-medium">No products found in the "{name}" category.</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
};
