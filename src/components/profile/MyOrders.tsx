import { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

export const MyOrders = () => {
  const { myOrders, isLoading, error, fetchMyOrders } = useOrderStore();
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

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

  const renderOrderTimeline = (status: string) => {
    const steps = ['Pending', 'Paid', 'Shipped', 'Delivered'];
    const currentIndex = status === 'Cancelled' ? -1 : steps.indexOf(status);

    if (status === 'Cancelled') {
      return (
        <div className="my-2 p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-500/20 text-sm font-semibold flex items-center justify-center gap-2">
          <XCircle size={16} /> Order Cancelled & Refunded
        </div>
      );
    }

    return (
      <div className="my-3 px-2">
        <div className="relative">
          <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
            <div style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out"></div>
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
             {steps.map((s, i) => (
                <span key={s} className={i <= currentIndex ? 'text-primary font-bold' : ''}>{s}</span>
             ))}
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl p-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Order History</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-400/10 p-4 rounded-xl border border-red-200 dark:border-red-400/20">{error}</div>
      ) : myOrders.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <Package size={48} className="mx-auto mb-4 opacity-50 text-slate-400 dark:text-slate-500" />
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => {
            const isExpanded = expandedOrders[order.id];
            
            return (
              <div key={order.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
                <div 
                  className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex flex-wrap justify-between items-center gap-4 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{order.totalAmount.toFixed(2)}</p>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                    <div className="text-slate-400 hover:text-slate-600 transition-colors">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                    {order.trackingNumber && order.carrierName && (
                      <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <Truck size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Tracking Information</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                            {order.carrierName} <span className="text-slate-400 dark:text-slate-500 mx-2">•</span> <span className="text-primary tracking-wide font-mono">{order.trackingNumber}</span>
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-200 dark:border-slate-700/50">
                      {renderOrderTimeline(order.status)}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 dark:bg-slate-800/30">
                  <ul className="divide-y divide-slate-200 dark:divide-slate-700/50">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.productName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                  
                  {(order.status === 'Pending' || order.status === 'Paid') && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                      <button 
                        onClick={() => setOrderToCancel(order.id)}
                        className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <AlertCircle size={16} /> Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
