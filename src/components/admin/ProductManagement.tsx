import { useState, useEffect } from 'react';
import { useProductStore } from '../../store/useProductStore';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';
import { Modal } from '../ui/Modal';
import { ImagePlus, Loader2 } from 'lucide-react';

export const ProductManagement = () => {
  const { products, isLoading: isLoadingProducts, fetchProducts } = useProductStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, stockQuantity: 0, categoryId: 1, imageUrl: '' });
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    fetchProducts();
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setActionError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ECommerce');

      const response = await fetch('https://api.cloudinary.com/v1_1/pyuea7od/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image to Cloudinary');
      const data = await response.json();
      setNewProduct(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      setActionError('Image upload failed. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setIsSubmitting(true);
    
    try {
      await axiosClient.post('/products', newProduct);
      
      setIsAdding(false);
      setNewProduct({ name: '', description: '', price: 0, stockQuantity: 0, categoryId: 1, imageUrl: '' });
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

  const inputClasses = "block w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm font-medium placeholder-slate-400 dark:placeholder-slate-500";

  return (
    <>
      {actionError && (
        <div className="mb-6 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-900/50 flex justify-between items-center max-w-3xl mx-auto">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-white transition-colors">&times;</button>
        </div>
      )}

      <div className="mb-8 flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-lg shadow-primary/20 text-white bg-primary hover:bg-primary-dark transition-all duration-300"
        >
          {isAdding ? 'Close Panel' : 'Add New Product'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-12 bg-white/80 dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-400"></div>
          
          <div className="px-8 py-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Create New Product</h3>
            
            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-10">
              
              {/* Left Column: Image */}
              <div className="w-full md:w-1/3 flex flex-col gap-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Image</label>
                <div className="relative group w-full aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600/50 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/5">
                  {isUploadingImage ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : newProduct.imageUrl ? (
                    <img src={newProduct.imageUrl} alt="Preview" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-center p-4 flex flex-col items-center">
                      <ImagePlus className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-semibold text-slate-500">Click to upload image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Right Column: Fields */}
              <div className="w-full md:w-2/3 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Product Name</label>
                    <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={inputClasses} placeholder="e.g. Mechanical Keyboard" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select required value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: parseInt(e.target.value)})} className={inputClasses}>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea rows={3} required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className={inputClasses} placeholder="Describe the product details..." />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price (₹)</label>
                    <input type="number" step="0.01" min="0" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className={inputClasses} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stock</label>
                    <input type="number" min="0" required value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value)})} className={inputClasses} placeholder="0" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700/50 mt-6">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</> : 'Publish Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow-xl dark:shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 sm:rounded-2xl bg-white/80 dark:bg-slate-800/40 backdrop-blur-md">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/50">
                <thead className="bg-slate-50 dark:bg-slate-900/60">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock</th>
                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {isLoadingProducts && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading products...</td></tr>}
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700/50 flex-shrink-0 bg-white" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700/50 flex-shrink-0">
                              <span className="text-slate-500 font-bold">{product.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">{product.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{product.category?.name || `Cat ID: ${product.categoryId}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-300">₹{product.price.toFixed(2)}</div>
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
          <div className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this product? This action cannot be undone.
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
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
