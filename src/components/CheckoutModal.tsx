import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

export const CheckoutModal = () => {
  const { cart, checkout, isCheckoutModalOpen, toggleCheckoutModal } = useCartStore();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await checkout(email, address);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (success) {
      // Reset state for next time if it was successful
      setSuccess(false);
      setEmail('');
      setAddress('');
    }
    toggleCheckoutModal();
  };

  const total = cart?.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={!isSubmitting && !success ? handleClose : undefined}></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative z-10 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">Order Confirmed!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Thank you for your purchase. We have received your order and will ship it to {address} shortly.
              </p>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                onClick={handleClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-5 border-b pb-4">
                <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Secure Checkout</h3>
                <p className="text-sm text-gray-500 mt-1">Total to pay: <span className="font-bold text-gray-900">${total.toFixed(2)}</span></p>
              </div>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                    <textarea
                      id="address"
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>

                <div className="mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
