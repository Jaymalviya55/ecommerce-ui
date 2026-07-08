import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { User, Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

export const Profile = () => {
  const { userEmail, isAdmin } = useAuthStore();
  const { myOrders, isLoading, error, fetchMyOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'account' | 'orders'>('account');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab, fetchMyOrders]);

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
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'account' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
            >
              <User size={20} />
              Account Details
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
            >
              <Package size={20} />
              My Orders
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'account' && (
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 overflow-hidden rounded-2xl shadow-2xl">
              <div className="px-6 py-6">
                <h3 className="text-xl leading-6 font-semibold text-slate-100">User Profile</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">Personal details and secure information.</p>
              </div>
              <div className="border-t border-slate-700/50">
                <dl>
                  <div className="bg-slate-800/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-400">Email address</dt>
                    <dd className="mt-1 text-sm text-slate-200 sm:mt-0 sm:col-span-2 font-medium">{userEmail}</dd>
                  </div>
                  <div className="bg-transparent px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-400">Security Status</dt>
                    <dd className="mt-1 text-sm text-emerald-400 font-medium flex items-center gap-2 sm:mt-0 sm:col-span-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      Fully Authenticated (JWT)
                    </dd>
                  </div>
                  <div className="bg-slate-800/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-slate-400">Account Type</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      {isAdmin ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 shadow-inner">
                          Admin User
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
                          Standard User
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-6">Order History</h3>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">{error}</div>
              ) : myOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package size={48} className="mx-auto mb-4 opacity-50 text-slate-500" />
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {myOrders.map(order => (
                    <div key={order.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-slate-700/50 flex flex-wrap justify-between items-center gap-4 bg-slate-800/50">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-slate-300 mt-1">{new Date(order.orderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold text-white">₹{order.totalAmount.toFixed(2)}</p>
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <ul className="divide-y divide-slate-700/50">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                              <div>
                                <p className="text-sm font-medium text-slate-200">{item.productName}</p>
                                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-slate-300">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                            </li>
                          ))}
                        </ul>
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
