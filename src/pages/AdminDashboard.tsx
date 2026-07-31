import { useState } from 'react';
import { PackageSearch, ShoppingCart, LayoutDashboard, Users, Ticket, ShieldCheck, Layers, Award, GitMerge, Lock } from 'lucide-react';
import { ProductManagement } from '../components/admin/ProductManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { DashboardAnalytics } from '../components/admin/DashboardAnalytics';
import { StaffManagement } from '../components/admin/StaffManagement';
import { CouponManagement } from '../components/admin/CouponManagement';
import { UserTypeManagement } from '../components/admin/usermanagement/UserTypeManagement';
import { UserLevelManagement } from '../components/admin/usermanagement/UserLevelManagement';
import { UserRoleManagement } from '../components/admin/usermanagement/UserRoleManagement';
import { UserLevelToRoleManagement } from '../components/admin/usermanagement/UserLevelToRoleManagement';
import { UserRoleToFeatureManagement } from '../components/admin/usermanagement/UserRoleToFeatureManagement';

type MainTab = 'overview' | 'products' | 'orders' | 'staff' | 'coupons' | 'user-management';
type UserMgmtSubTab = 'user-type' | 'user-level' | 'user-role' | 'level-to-role' | 'role-to-feature';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('overview');
  const [userMgmtSubTab, setUserMgmtSubTab] = useState<UserMgmtSubTab>('user-type');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage store operations, orders, and centralized user permissions.</p>
        </div>
        <div className="mt-4 sm:mt-0 grid grid-cols-3 sm:flex gap-1 sm:gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('user-management')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'user-management' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <ShieldCheck size={16} />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <PackageSearch size={16} />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <ShoppingCart size={16} />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <Users size={16} />
            Staff Logins
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === 'coupons' ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <Ticket size={16} />
            Coupons
          </button>
        </div>
      </div>

      {activeTab === 'overview' && <DashboardAnalytics />}

      {activeTab === 'user-management' && (
        <div className="space-y-6">
          {/* Sub Navigation Bar for User Management Master Pages */}
          <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setUserMgmtSubTab('user-type')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${userMgmtSubTab === 'user-type' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <Layers size={14} />
              <span>User Type</span>
            </button>
            <button
              onClick={() => setUserMgmtSubTab('user-level')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${userMgmtSubTab === 'user-level' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <Award size={14} />
              <span>User Level</span>
            </button>
            <button
              onClick={() => setUserMgmtSubTab('user-role')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${userMgmtSubTab === 'user-role' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <ShieldCheck size={14} />
              <span>User Role</span>
            </button>
            <button
              onClick={() => setUserMgmtSubTab('level-to-role')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${userMgmtSubTab === 'level-to-role' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <GitMerge size={14} />
              <span>User Level To User Role</span>
            </button>
            <button
              onClick={() => setUserMgmtSubTab('role-to-feature')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${userMgmtSubTab === 'role-to-feature' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/60' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <Lock size={14} />
              <span>User Role To Feature</span>
            </button>
          </div>

          {userMgmtSubTab === 'user-type' && <UserTypeManagement />}
          {userMgmtSubTab === 'user-level' && <UserLevelManagement />}
          {userMgmtSubTab === 'user-role' && <UserRoleManagement />}
          {userMgmtSubTab === 'level-to-role' && <UserLevelToRoleManagement />}
          {userMgmtSubTab === 'role-to-feature' && <UserRoleToFeatureManagement />}
        </div>
      )}

      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'orders' && <OrderManagement />}
      {activeTab === 'staff' && <StaffManagement />}
      {activeTab === 'coupons' && <CouponManagement />}
    </div>
  );
};