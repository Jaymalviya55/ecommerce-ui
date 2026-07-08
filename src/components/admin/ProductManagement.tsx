import { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';
import { Modal } from '../ui/Modal';

export const ProductManagement = () => {
  const { products, isLoading: isLoadingProducts, fetchProducts } = useProductStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, stockQuantity: 0, categoryId: 1 });
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    
    setActionError('');
    setIsSubmitting(true);
    try {
      await axiosClient.delete(`/products/${productToDelete}`);
      fetchProducts();
      setDeleteModalOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setActionError(err.response?.data || err.message);
      } else {
        setActionError(err instanceof Error ? err.message : String(err));
      }
      setDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setIsSubmitting(true);
    
    try {
      await axiosClient.post('/products', newProduct);
      
      setIsAdding(false);
      setNewProduct({ name: '', description: '', price: 0, stockQuantity: 0, categoryId: 1 });
      fetchProducts();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setActionError(typeof err.response?.data === 'string' ? err.response.data : err.message);
      } else {
        setActionError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "block w-full bg-slate-900/50 border border-slate-700/50 text-slate-100 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all";

  return (
    <>
      {actionError && (
        <div className="mb-6 text-sm text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-900/50 flex justify-between items-center">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-400 hover:text-white transition-colors">&times;</button>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-primary/20 text-white bg-primary hover:bg-primary-hover transition-all duration-200"
        >
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl sm:rounded-2xl overflow-hidden">
          <div className="px-6 py-6 sm:p-8">
            <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-6">Add a New Product</h3>
            
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Product Name</label>
                  <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category ID</label>
                  <input type="number" required value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: parseInt(e.target.value)})} className={inputClasses} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea rows={3} required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹)</label>
                  <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Stock Quantity</label>
                  <input type="number" required value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value)})} className={inputClasses} />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-lg shadow-emerald-500/20 text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow-2xl overflow-hidden border border-slate-700/50 sm:rounded-2xl bg-slate-800/40 backdrop-blur-md">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-900/60">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {isLoadingProducts && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium">Loading products...</td></tr>}
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-700/30 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-200">{product.name}</div>
                            <div className="text-sm text-slate-400 mt-0.5">{product.category?.name || `Cat ID: ${product.categoryId}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-300">₹{product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${product.stockQuantity > 10 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDeleteClick(product.id)} className="text-red-400 hover:text-red-300 font-semibold transition-colors bg-red-400/10 px-3 py-1.5 rounded-lg hover:bg-red-400/20">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Product">
        <div className="space-y-5">
          <div className="text-slate-300">
            Are you sure you want to delete this product? This action cannot be undone.
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={executeDelete}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
