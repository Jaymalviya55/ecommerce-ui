import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Mail, CheckCircle, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';

export const Checkout = () => {
  const { cart, checkout } = useCartStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Dynamically load Razorpay script only when this page opens
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const total = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = await checkout(email, address);
      
      const options = {
          key: data.keyId,
          amount: data.totalAmount * 100, // paise
          currency: "INR",
          name: "EXOUSIA",
          description: "Premium Secure Checkout",
          order_id: data.razorpayOrderId,
          handler: function (_response: any) {
              setSuccess(true);
          },
          prefill: {
              email: email
          },
          theme: {
              color: "#8b5cf6" // primary violet
          }
      };
      
      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any){
          setError(response.error.description || "Payment failed");
      });
      
      rzp.open();
      
    } catch (err: any) {
      setError(err.message || 'Failed to checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 mt-12"
      >
        <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 shadow-xl dark:shadow-2xl shadow-emerald-500/10 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="px-4 py-16 sm:p-20 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 mb-8"
            >
              <CheckCircle className="h-12 w-12 text-emerald-500 dark:text-emerald-400" />
            </motion.div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Order Confirmed!</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto">
              Thank you for your purchase. We have received your order and will ship it to <span className="font-semibold text-slate-900 dark:text-slate-200">{address}</span> shortly.
            </p>
            <button
              type="button"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-bold shadow-lg text-white bg-primary hover:bg-primary-dark transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        
        {/* Left Side - Form */}
        <div className="lg:col-span-7">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
              <ShieldCheck size={36} className="text-primary" />
              <span>Secure Checkout</span>
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">Enter your details to complete your premium order.</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl rounded-3xl p-6 sm:p-8">
            {error && (
              <div className="mb-8 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-xl flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700/50 pb-4">Contact Information</h3>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700/50 pb-4">Shipping Details</h3>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Address</label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                        <MapPin size={18} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <textarea
                        id="address"
                        required
                        rows={4}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="123 Luxury Ave, Apt 4B, Metropolis"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/50 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mt-4 sm:mt-0 py-3 px-6 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  Return to Cart
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || total === 0}
                  className="flex items-center justify-center space-x-2 py-4 px-8 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 group"
                >
                  <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
                  <span>{isSubmitting ? 'Processing...' : 'Pay Securely'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl rounded-3xl p-6 sm:p-8 sticky top-28">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">Order Summary</h2>
            
            <div className="flow-root mb-8">
              <ul role="list" className="-my-4 divide-y divide-slate-200 dark:divide-slate-700/50">
                {cart?.items?.map((item) => (
                  <li key={item.id} className="py-4 flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.product?.name || 'Item'}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-slate-200 dark:border-slate-700/50 pt-6">
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
                <dd className="font-medium text-slate-900 dark:text-white">₹{total.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-500 dark:text-slate-400">Shipping</dt>
                <dd className="font-medium text-emerald-600 dark:text-emerald-400">Free</dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4">
                <dt className="text-xl font-bold text-slate-900 dark:text-white">Total</dt>
                <dd className="text-3xl font-black text-primary">₹{total.toFixed(2)}</dd>
              </div>
            </div>
            
            <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <ShieldCheck size={24} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Payments are securely processed by Razorpay. We do not store your credit card information. 256-bit SSL encryption applied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
