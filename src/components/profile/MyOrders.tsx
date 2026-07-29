import { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

export const MyOrders = () => {
  const { myOrders, isLoading, error, fetchMyOrders } = useOrderStore();
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'On the way' | 'Delivered' | 'Cancelled' | 'Returned'>('All');

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    
    try {
      await axiosClient.put(`/orders/${orderToCancel}/cancel`);
      toast.success("Order cancelled successfully");
      fetchMyOrders();
    } catch (e: any) {
      toast.error(`Could not cancel: ${e.response?.data || "Network error"}`);
    } finally {
      setIsCancelling(false);
      setOrderToCancel(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={16} />;
      case 'Paid': return <CheckCircle size={16} />;
      case 'Shipped': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      case 'Cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
      case 'Paid': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'Shipped': return 'text-primary bg-primary/10 dark:text-primary border-primary/20';
      case 'Delivered': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'Cancelled': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'Pending' || status === 'Paid') return 'Processing';
    return status;
  };

  const filteredOrders = myOrders.filter(order => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'On the way') return order.status === 'Pending' || order.status === 'Paid' || order.status === 'Shipped';
    if (activeFilter === 'Delivered') return order.status === 'Delivered';
    if (activeFilter === 'Cancelled') return order.status === 'Cancelled';
    if (activeFilter === 'Returned') return false; // Future feature
    return true;
  });

  return (
    <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">My Orders</h3>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['All', 'On the way', 'Delivered', 'Cancelled', 'Returned'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                activeFilter === filter 
                  ? 'bg-primary text-white border-primary shadow-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="m-6 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-400/10 p-4 rounded-xl border border-red-200 dark:border-red-400/20">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <Package size={48} className="mx-auto mb-4 opacity-50 text-slate-400 dark:text-slate-500" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No orders found.</p>
            <p className="text-sm mt-1">Try changing the filter or place a new order.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Order #{order.id}</span>
                    <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                      {/* Product Image & Info (Left) */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="text-slate-400" size={24} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{item.productName}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>

                      {/* Price (Middle) */}
                      <div className="sm:w-32 text-left sm:text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                      </div>

                      {/* Status Indicator (Right) */}
                      <div className="sm:w-48 text-left sm:text-right flex flex-col sm:items-end justify-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                        {order.status === 'Shipped' && order.trackingNumber && (
                          <p className="text-[11px] font-semibold text-primary mt-2 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                            <Truck size={12} /> {order.carrierName}: {order.trackingNumber}
                          </p>
                        )}
                        {order.status === 'Delivered' && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                            <CheckCircle size={12} /> Delivered
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions (Cancel Order) */}
                {(order.status === 'Pending' || order.status === 'Paid') && (
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => setOrderToCancel(order.id)}
                      className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <AlertCircle size={16} /> Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!orderToCancel}
        onClose={() => !isCancelling && setOrderToCancel(null)}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Cancel Order"
        type="danger"
        isLoading={isCancelling}
      />
    </div>
  );
};
