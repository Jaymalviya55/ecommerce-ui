import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Package, Truck } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
}

interface Order {
  id: number;
  orderDate: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export const FulfillmentDashboard = () => {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState<Record<number, { carrier: string, tracking: string }>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/orders/fulfillment');
      setOrders(response.data);
    } catch (err) {
      setError('Error loading fulfillment queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleTrackingChange = (orderId: number, field: 'carrier' | 'tracking', value: string) => {
    setTrackingData(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const handleShipOrder = async (orderId: number) => {
    const data = trackingData[orderId];
    if (!data?.carrier || !data?.tracking) {
      toast.error("Please enter both Carrier and Tracking Number.");
      return;
    }

    setProcessingId(orderId);
    try {
      await axiosClient.put(`/orders/${orderId}/ship`, {
        trackingNumber: data.tracking,
        carrierName: data.carrier
      });

        toast.success(`Order #${orderId} marked as shipped!`);
        setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 min-h-screen overflow-y-auto w-full relative">
      {/* Soft Glow Background Effects */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[40rem] h-[40rem] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[40rem] h-[40rem] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fulfillment Station</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage packing and shipping operations</p>
            </div>
          </div>
        </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-500 rounded-xl">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50">
          <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
            <Package size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Queue is Empty</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">All paid orders have been shipped! Great job.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300">
              <div className="p-5 border-b border-white/40 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/40 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Order #{order.id}</h3>
                  <p className="text-xs text-slate-500 mt-1">{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                  {order.status}
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Customer</h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{order.customerEmail}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{order.shippingAddress}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Items to Pack</h4>
                  <ul className="text-sm divide-y divide-slate-100 dark:divide-slate-700/50">
                    {order.items.map(item => (
                      <li key={item.productId} className="py-2 flex justify-between items-center">
                        <span className="text-slate-700 dark:text-slate-300">{item.productName}</span>
                        <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 space-y-3">
                <input 
                  type="text" 
                  placeholder="Carrier (e.g. FedEx, BlueDart)" 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary"
                  value={trackingData[order.id]?.carrier || ''}
                  onChange={(e) => handleTrackingChange(order.id, 'carrier', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Tracking Number" 
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary font-mono"
                  value={trackingData[order.id]?.tracking || ''}
                  onChange={(e) => handleTrackingChange(order.id, 'tracking', e.target.value)}
                />
                <button
                  onClick={() => handleShipOrder(order.id)}
                  disabled={processingId === order.id}
                  className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Truck size={18} />
                  {processingId === order.id ? 'Processing...' : 'Mark as Shipped'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};
