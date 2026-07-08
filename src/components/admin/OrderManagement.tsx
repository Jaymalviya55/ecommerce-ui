import { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const OrderManagement = () => {
  const { allOrders, isLoading: isLoadingOrders, fetchAllOrders, shipOrder, deliverOrder, cancelOrder } = useOrderStore();

  const [activeModal, setActiveModal] = useState<'ship' | 'cancel' | 'deliver' | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedOrderId(null);
    setTrackingNumber('');
    setCarrierName('');
    setErrorMsg('');
  };

  const openModal = (type: 'ship' | 'cancel' | 'deliver', id: number) => {
    setActiveModal(type);
    setSelectedOrderId(id);
    setErrorMsg('');
  };

  const handleShipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !trackingNumber || !carrierName) {
      setErrorMsg('Please fill all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await shipOrder(selectedOrderId, trackingNumber, carrierName);
      closeModal();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionSubmit = async (action: () => Promise<void>) => {
    if (!selectedOrderId) return;
    setIsSubmitting(true);
    try {
      await action();
      closeModal();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={14} />;
      case 'Paid': return <CheckCircle size={14} />;
      case 'Shipped': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
      case 'Paid': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'Shipped': return 'bg-primary/10 text-primary border-primary/20';
      case 'Delivered': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'Cancelled': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
    }
  };

  const inputClasses = "block w-full bg-slate-900/50 border border-slate-700/50 text-slate-100 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all";

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow-2xl overflow-hidden border border-slate-700/50 sm:rounded-2xl bg-slate-800/40 backdrop-blur-md">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-900/60">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Order</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {isLoadingOrders && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">Loading orders...</td></tr>}
                {allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-200">#{order.id}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{new Date(order.orderDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                      {order.trackingNumber && (
                        <div className="text-xs text-slate-400 mt-1">{order.carrierName}: {order.trackingNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-200">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      {(order.status === 'Pending' || order.status === 'Paid') && (
                        <>
                          <button onClick={() => openModal('ship', order.id)} className="text-primary hover:text-primary-hover font-semibold transition-colors bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20">Ship</button>
                          <button onClick={() => openModal('cancel', order.id)} className="text-rose-400 hover:text-rose-300 font-semibold transition-colors bg-rose-400/10 px-3 py-1.5 rounded-lg hover:bg-rose-400/20">Cancel</button>
                        </>
                      )}
                      {order.status === 'Shipped' && (
                        <button onClick={() => openModal('deliver', order.id)} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-lg hover:bg-emerald-400/20">Mark Delivered</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shipping Modal */}
      <Modal isOpen={activeModal === 'ship'} onClose={closeModal} title={`Ship Order #${selectedOrderId}`}>
        <form onSubmit={handleShipSubmit} className="space-y-5">
          {errorMsg && (
            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Carrier Name</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., FedEx, UPS"
              value={carrierName} 
              onChange={e => setCarrierName(e.target.value)} 
              className={inputClasses} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tracking Number</label>
            <input 
              type="text" 
              required 
              placeholder="Enter tracking number"
              value={trackingNumber} 
              onChange={e => setTrackingNumber(e.target.value)} 
              className={inputClasses} 
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Confirm Shipment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={activeModal === 'cancel'} onClose={closeModal} title="Cancel Order">
        <div className="space-y-5">
          <div className="text-slate-300">
            Are you sure you want to cancel order #{selectedOrderId}? The items in this order will automatically be returned to inventory stock.
          </div>
          {errorMsg && (
            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}
          <div className="pt-2 flex justify-end gap-3">
            <button 
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              No, Keep Order
            </button>
            <button 
              onClick={() => handleActionSubmit(() => cancelOrder(selectedOrderId!))}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Order'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Deliver Confirmation Modal */}
      <Modal isOpen={activeModal === 'deliver'} onClose={closeModal} title="Mark Delivered">
        <div className="space-y-5">
          <div className="text-slate-300">
            Confirm that order #{selectedOrderId} has been successfully delivered to the customer?
          </div>
          {errorMsg && (
            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}
          <div className="pt-2 flex justify-end gap-3">
            <button 
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleActionSubmit(() => deliverOrder(selectedOrderId!))}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Confirm Delivery'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
