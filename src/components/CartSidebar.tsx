import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';

export const CartSidebar = () => {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  const total = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={toggleCart}
          />
          
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md"
            >
              <div className="h-full flex flex-col bg-slate-800/90 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl">
                <div className="flex-1 py-6 overflow-y-auto px-6">
                  <div className="flex items-start justify-between mb-8">
                    <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                      <ShoppingBag size={24} className="text-primary" />
                      <span>Your Cart</span>
                    </h2>
                    <button
                      type="button"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
                      onClick={toggleCart}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-slate-700/50">
                        {(!cart?.items || cart.items.length === 0) && (
                          <li className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                              <ShoppingBag size={32} className="text-slate-600" />
                            </div>
                            <p className="text-lg">Your cart is empty.</p>
                          </li>
                        )}
                        
                        {cart?.items?.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-20 h-20 border border-slate-700/50 rounded-2xl overflow-hidden bg-slate-700/30 flex items-center justify-center">
                               <ShoppingBag size={24} className="text-slate-500" strokeWidth={1.5} />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col justify-center">
                              <div>
                                <div className="flex justify-between text-base font-bold text-slate-100">
                                  <h3 className="line-clamp-1 pr-4">
                                    {item.product?.name || 'Unknown Product'}
                                  </h3>
                                  <p className="ml-4 text-primary">₹{item.unitPrice.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm mt-2">
                                <div className="flex items-center space-x-3 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/50">
                                  <button 
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(item.productId, item.quantity - 1);
                                      } else {
                                        removeFromCart(item.productId);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-white font-medium w-4 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 transition-colors p-1"
                                  onClick={() => removeFromCart(item.productId)}
                                >
                                  <Trash2 size={16} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 py-6 px-6 bg-slate-800">
                  <div className="flex justify-between text-lg font-bold text-white mb-2">
                    <p>Subtotal</p>
                    <p className="text-primary">₹{total.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-6">Shipping and taxes calculated at checkout.</p>
                  
                  <button
                    onClick={() => {
                      toggleCart();
                      navigate('/checkout');
                    }}
                    disabled={!cart?.items || cart.items.length === 0}
                    className="w-full flex justify-center items-center space-x-2 px-6 py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 group"
                  >
                    <span>Secure Checkout</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="mt-6 flex justify-center text-sm text-center">
                    <button
                      type="button"
                      className="text-slate-400 font-medium hover:text-white transition-colors"
                      onClick={toggleCart}
                    >
                      or Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
