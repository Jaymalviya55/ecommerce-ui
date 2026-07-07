import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const Checkout = () => {
  const { cart, checkout } = useCartStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Tell backend to create Razorpay Order
      const data = await checkout(email, address);
      
      // 2. Open Razorpay secure modal for the user to pay
      const options = {
          key: data.keyId,
          amount: data.totalAmount * 100, // paise
          currency: "INR",
          name: "EnterpriseStore",
          description: "Secure Payment",
          order_id: data.razorpayOrderId,
          handler: function (_response: any) {
              // 3. User paid successfully! (Webhook handles DB update)
              setSuccess(true);
          },
          prefill: {
              email: email
          },
          theme: {
              color: "#4f46e5"
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
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-12 sm:p-16 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-lg text-gray-500 mb-8">
              Thank you for your purchase. We have received your order and will ship it to <span className="font-medium text-gray-900">{address}</span> shortly.
            </p>
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-2xl leading-6 font-bold text-gray-900">Secure Checkout</h3>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Please enter your shipping and contact details below.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Total Amount:</span>
            <span className="text-2xl font-black text-indigo-600">₹{total.toFixed(2)}</span>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Shipping Address
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  required
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || total === 0}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
