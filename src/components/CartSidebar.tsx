import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus, Tag } from 'lucide-react';

export const CartSidebar = () => {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, applyCoupon, removeCoupon} = useCartStore();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState('');

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
            className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm" 
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
              <div className="h-full flex flex-col bg-white/95 dark:bg-slate-800/90 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700/50 shadow-2xl">
                <div className="flex-1 py-6 overflow-y-auto px-6">
                  <div className="flex items-start justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <ShoppingBag size={24} className="text-primary" />
                      <span>Your Cart</span>
                    </h2>
                    <button
                      type="button"
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-colors"
                      onClick={toggleCart}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-slate-200 dark:divide-slate-700/50">
                        {(!cart?.items || cart.items.length === 0) && (
                          <li className="py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                              <ShoppingBag size={32} className="text-slate-400 dark:text-slate-600" />
                            </div>
                            <p className="text-lg">Your cart is empty.</p>
                          </li>
                        )}
                        
                        {cart?.items?.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-20 h-20 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-700/30 flex items-center justify-center">
                               <ShoppingBag size={24} className="text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col justify-center">
                              <div>
                                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                                  <h3 className="line-clamp-1 pr-4">
                                    {item.product?.name || 'Unknown Product'}
                                  </h3>
                                  <p className="ml-4 text-primary">₹{item.unitPrice.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm mt-2">
                                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                  <button 
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(item.productId, item.quantity - 1);
                                      } else {
                                        removeFromCart(item.productId);
                                      }
                                    }}
                                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-slate-900 dark:text-white font-medium w-4 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
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

                <div className="border-t border-slate-200 dark:border-slate-700/50 py-6 px-6 bg-slate-50 dark:bg-slate-800">
                  
                  {/* Coupon Section */}
                  {cart?.items && cart.items.length > 0 && (
                    <div className="mb-6">
                      {cart.appliedCouponCode ? (
                        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                          <div className="flex items-center space-x-2 font-bold text-sm">
                            <Tag size={16} />
                            <span>Coupon applied: {cart.appliedCouponCode}</span>
                          </div>
                          <button 
                            onClick={async () => await removeCoupon()}
                            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Enter promo code"
                              className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                            <button
                              onClick={async () => {
                                if (!couponCode) return;
                                setIsApplying(true);
                                setCouponError('');
                                try {
                                  await applyCoupon(couponCode);
                                  setCouponCode('');
                                } catch (err: any) {
                                  setCouponError(err.message);
                                } finally {
                                  setIsApplying(false);
                                }
                              }}
                              disabled={isApplying || !couponCode}
                              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                            >
                              {isApplying ? '...' : 'Apply'}
                            </button>
                          </div>
                          {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white mb-2">
                    <p>Subtotal</p>
                    <p className="text-primary">₹{total.toFixed(2)}</p>
                  </div>
                  {cart?.appliedCouponCode && (
                    <div className="flex justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      <p>Discount</p>
                      <p>Applied at Checkout</p>
                    </div>
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Shipping, taxes, and discounts calculated at checkout.</p>
                  
                  <button
                    onClick={() => {
                      toggleCart();
                      navigate('/checkout');
                    }}
                    disabled={!cart?.items || cart.items.length === 0}
                    className="w-full flex justify-center items-center space-x-2 px-6 py-4 rounded-xl font-black text-white bg-gradient-to-r from-primary via-indigo-500 to-purple-500 hover:from-primary-dark hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] group"
                  >
                    <span className="text-lg tracking-wide">Secure Checkout</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="mt-6 flex justify-center text-sm text-center">
                    <button
                      type="button"
                      className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
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
