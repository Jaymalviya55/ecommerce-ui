import { useEffect } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

export const OrderManagement = () => {
  const { allOrders, isLoading: isLoadingOrders, fetchAllOrders, shipOrder, deliverOrder, cancelOrder } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleShip = async (id: number) => {
    const trackingNumber = prompt('Enter Tracking Number:');
    if (!trackingNumber) return;
    const carrierName = prompt('Enter Carrier Name (e.g., FedEx, UPS):');
    if (!carrierName) return;

    try {
      await shipOrder(id, trackingNumber, carrierName);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeliver = async (id: number) => {
    if (!confirm('Mark order as delivered?')) return;
    try {
      await deliverOrder(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this order? Inventory will be restocked.')) return;
    try {
      await cancelOrder(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
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
                          <button onClick={() => handleShip(order.id)} className="text-primary hover:text-primary-hover font-semibold transition-colors bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20">Ship</button>
                          <button onClick={() => handleCancel(order.id)} className="text-rose-400 hover:text-rose-300 font-semibold transition-colors bg-rose-400/10 px-3 py-1.5 rounded-lg hover:bg-rose-400/20">Cancel</button>
                        </>
                      )}
                      {order.status === 'Shipped' && (
                        <button onClick={() => handleDeliver(order.id)} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-lg hover:bg-emerald-400/20">Mark Delivered</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
