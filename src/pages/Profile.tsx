import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { User, Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

export const Profile = () => {
  const { userEmail, isAdmin, roles } = useAuthStore();
  const { myOrders, isLoading, error, fetchMyOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'account' | 'orders'>('account');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab, fetchMyOrders]);

  const handleCancelOrder = async (orderId: number) => {
    if(!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${useAuthStore.getState().accessToken}` }
      });
      if(res.ok) {
        fetchMyOrders();
      } else {
        const text = await res.text();
        alert(`Could not cancel: ${text}`);
      }
    } catch (e) {
      alert("Network error.");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex flex-col gap-2 shadow-sm dark:shadow-none">
            <button 
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'account' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
            >
              <User size={20} />
              Account Details
            </button>
            {!roles.includes('FulfillmentStaff') && (
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
              >
                <Package size={20} />
                My Orders
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'account' && (
            <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 overflow-hidden rounded-2xl shadow-xl dark:shadow-2xl">
              <div className="px-6 py-6">
                <h3 className="text-xl leading-6 font-semibold text-slate-900 dark:text-slate-100">User Profile</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Personal details and secure information.</p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700/50">
                <dl>
                  <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Email address</dt>
                    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200 sm:mt-0 sm:col-span-2 font-medium">{userEmail}</dd>
                  </div>
                  <div className="bg-white dark:bg-transparent px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Status</dt>
                    <dd className="mt-1 text-sm text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-2 sm:mt-0 sm:col-span-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                      Fully Authenticated (JWT)
                    </dd>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Account Type</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      {isAdmin ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 dark:border-primary/30 shadow-inner">
                          Admin User
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600/50">
                          Standard User
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {!roles.includes('FulfillmentStaff') && activeTab === 'orders' && (
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
                  {myOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex flex-wrap justify-between items-center gap-4 bg-slate-50 dark:bg-slate-800/50">
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
                        </div>
                      </div>
                      
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
                      
                      <div className="px-4">
                         {renderOrderTimeline(order.status)}
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/30">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700/50">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                              <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.productName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                            </li>
                          ))}
                        </ul>
                        
                        {(order.status === 'Pending' || order.status === 'Paid') && (
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <AlertCircle size={16} /> Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
