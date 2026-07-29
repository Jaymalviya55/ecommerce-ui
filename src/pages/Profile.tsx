import { useState } from 'react';
import { User, Package, MessagesSquare } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { CustomerTickets } from '../components/profile/CustomerTickets';
import { PersonalInfo } from '../components/profile/PersonalInfo';
import { ManageAddresses } from '../components/profile/ManageAddresses';
import { MyOrders } from '../components/profile/MyOrders';

export const Profile = () => {
  const { roles } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'account' | 'addresses' | 'orders' | 'coupons' | 'reviews' | 'support'>('account');



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
              <>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'addresses' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Manage Addresses
                </button>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700/50"></div>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
                >
                  <Package size={20} />
                  My Orders
                </button>
                <button 
                  onClick={() => setActiveTab('coupons')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'coupons' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566z"/></svg>
                  My Coupons
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'reviews' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  My Reviews
                </button>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700/50"></div>
                <button 
                  onClick={() => setActiveTab('support')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'support' ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'}`}
                >
                  <MessagesSquare size={20} />
                  Help & Support
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'account' && <PersonalInfo />}
          {activeTab === 'addresses' && <ManageAddresses />}

          {!roles.includes('FulfillmentStaff') && activeTab === 'orders' && (
            <MyOrders />
          )}

          {!roles.includes('FulfillmentStaff') && activeTab === 'support' && (
            <CustomerTickets />
          )}
        </div>
      </div>
    </div>
  );
};
