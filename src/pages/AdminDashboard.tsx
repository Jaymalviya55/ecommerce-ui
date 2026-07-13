import { useState } from 'react';
import { PackageSearch, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { ProductManagement } from '../components/admin/ProductManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { DashboardAnalytics } from '../components/admin/DashboardAnalytics';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage your store's products, inventory, and orders.</p>
        </div>
        <div className="mt-4 sm:mt-0 grid grid-cols-3 sm:flex gap-1 sm:gap-4 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <LayoutDashboard size={18} className="mb-0.5 sm:mb-0" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <PackageSearch size={18} className="mb-0.5 sm:mb-0" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <ShoppingCart size={18} className="mb-0.5 sm:mb-0" />
            Orders
          </button>
        </div>
      </div>

      {activeTab === 'overview' && <DashboardAnalytics />}
      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'orders' && <OrderManagement />}
    </div>
  );
};