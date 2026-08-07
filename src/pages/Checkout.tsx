import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useProfileStore, type Address } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Mail, CheckCircle, ArrowLeft, ShieldCheck, ShoppingBag, Home, Briefcase, Tag } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export const Checkout = () => {
  const { cart, checkout } = useCartStore();
  const { addresses, fetchAddresses } = useProfileStore();
  const { userEmail } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState(userEmail || '');
  const [address, setAddress] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (cart?.appliedCouponCode) {
      axiosClient.get('/coupons/active')
        .then(res => {
          const coupon = res.data.find((c: any) => c.code === cart.appliedCouponCode);
          if (coupon && !coupon.isUsed) {
            setDiscountPercent(coupon.discountPercentage);
          }
        })
        .catch(err => console.error("Failed to load coupon details", err));
    }
  }, [cart?.appliedCouponCode]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId && !showManualAddress) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setAddress(`${defaultAddr.fullName}, ${defaultAddr.streetAddress}, ${defaultAddr.locality}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}. Ph: ${defaultAddr.phoneNumber}`);
    } else if (addresses.length === 0) {
      setShowManualAddress(true);
    }
  }, [addresses, selectedAddressId, showManualAddress]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setShowManualAddress(false);
    setAddress(`${addr.fullName}, ${addr.streetAddress}, ${addr.locality}, ${addr.city}, ${addr.state} - ${addr.pincode}. Ph: ${addr.phoneNumber}`);
  };

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

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center lg:justify-start space-x-3">
          <ShieldCheck size={40} className="text-primary" />
          <span>Secure Checkout</span>
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        
        {/* Left Side - Accordion Steps */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {error && (
              <div className="mb-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-xl flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0" />
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Contact */}
              <div className={`bg-white dark:bg-slate-800/80 border ${currentStep === 1 ? 'border-primary shadow-xl shadow-primary/10' : 'border-slate-200 dark:border-slate-700/50'} rounded-3xl overflow-hidden transition-all duration-300`}>
                <div 
                  className="px-6 py-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setCurrentStep(1)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 1 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>1</div>
                    <h3 className={`text-xl font-bold ${currentStep === 1 ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Contact Information</h3>
                  </div>
                  {currentStep > 1 && email && <span className="text-sm font-medium text-primary">Edit</span>}
                </div>
                
                {currentStep === 1 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-6 pt-2">
                    <div className="space-y-4">
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={18} className="text-slate-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { if(email) setCurrentStep(2) }}
                        disabled={!email}
                        className="w-full mt-4 py-4 rounded-xl font-bold text-white bg-slate-900 dark:bg-primary hover:bg-slate-800 dark:hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        Continue to Shipping
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Step 2: Shipping */}
              <div className={`bg-white dark:bg-slate-800/80 border ${currentStep === 2 ? 'border-primary shadow-xl shadow-primary/10' : 'border-slate-200 dark:border-slate-700/50'} rounded-3xl overflow-hidden transition-all duration-300`}>
                <div 
                  className={`px-6 py-5 flex items-center justify-between ${currentStep > 2 || (currentStep === 1 && email) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  onClick={() => { if (currentStep > 2 || (currentStep === 1 && email)) setCurrentStep(2) }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 2 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>2</div>
                    <h3 className={`text-xl font-bold ${currentStep === 2 ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Shipping Details</h3>
                  </div>
                  {currentStep > 2 && selectedAddressId && <span className="text-sm font-medium text-primary">Edit</span>}
                </div>

                {currentStep === 2 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-6 pt-2">
                    {addresses.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {addresses.map(addr => (
                          <div 
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id && !showManualAddress ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {addr.addressType === 'Home' ? <Home size={16} className="text-primary" /> : <Briefcase size={16} className="text-primary" />}
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{addr.addressType}</span>
                              {addr.isDefault && <span className="ml-auto text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-full">DEFAULT</span>}
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{addr.fullName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {addr.streetAddress}, {addr.locality}, {addr.city}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Ph: {addr.phoneNumber}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {addresses.length > 0 && (
                      <button 
                        type="button"
                        onClick={() => {
                          setShowManualAddress(true);
                          setSelectedAddressId(null);
                          setAddress('');
                        }}
                        className={`text-sm font-bold mb-4 flex items-center transition-colors ${showManualAddress ? 'text-primary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <MapPin size={16} className="mr-1" /> Use a different address
                      </button>
                    )}

                    {showManualAddress && (
                      <div className="relative mb-6">
                        <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                          <MapPin size={18} className="text-slate-400" />
                        </div>
                        <textarea
                          id="address"
                          required
                          rows={4}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Full detailed address..."
                        />
                      </div>
                    )}

                    <button 
                      type="button" 
                      onClick={() => { if(address) setCurrentStep(3) }}
                      disabled={!address}
                      className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 dark:bg-primary hover:bg-slate-800 dark:hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Step 3: Payment */}
              <div className={`bg-white dark:bg-slate-800/80 border ${currentStep === 3 ? 'border-primary shadow-xl shadow-primary/10' : 'border-slate-200 dark:border-slate-700/50'} rounded-3xl overflow-hidden transition-all duration-300`}>
                <div 
                  className={`px-6 py-5 flex items-center justify-between ${currentStep === 3 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  onClick={() => { if (address && email) setCurrentStep(3) }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === 3 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>3</div>
                    <h3 className={`text-xl font-bold ${currentStep === 3 ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Payment</h3>
                  </div>
                </div>
                
                {currentStep === 3 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-6 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 mb-6 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                        <CreditCard size={24} className="text-slate-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Razorpay Secure Checkout</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Pay via UPI, Cards, NetBanking, or Wallets.</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-1/3 py-4 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || total === 0}
                        className="w-full sm:w-2/3 flex items-center justify-center space-x-2 py-4 rounded-xl font-black text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <ShieldCheck size={20} />
                            <span>Pay ₹{total.toFixed(2)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
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
                <dd className="font-medium text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</dd>
              </div>
              
              {cart?.appliedCouponCode && (
                <div className="flex items-center justify-between text-sm">
                  <dt className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Tag size={16} />
                    Coupon ({cart.appliedCouponCode})
                  </dt>
                  <dd className="font-medium text-emerald-600 dark:text-emerald-400">- ₹{discountAmount.toFixed(2)}</dd>
                </div>
              )}
              
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
