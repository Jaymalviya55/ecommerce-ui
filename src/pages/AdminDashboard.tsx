import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { PackageSearch, ShoppingCart, LayoutDashboard, Ticket, ShieldCheck, Layers, Award, GitMerge, Lock } from 'lucide-react';

export const AdminDashboard = () => {
  const location = useLocation();
  const isUserMgmt = location.pathname.includes('/admin/user-management');

  const getMainLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
      isActive
        ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm'
        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
    }`;

  const getUserMgmtLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/60'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
    }`;

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 relative overflow-x-hidden">
      {/* Soft Glow Background Effects */}
      <div className="absolute top-0 left-1/4 -mt-32 w-[40rem] h-[40rem] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 -mr-32 w-[40rem] h-[40rem] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage store operations, orders, and centralized user permissions.</p>
        </div>
        <div className="mt-4 sm:mt-0 grid grid-cols-3 sm:flex gap-1 sm:gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto overflow-x-auto">
          <NavLink to="/admin/overview" className={getMainLinkClass}>
            <LayoutDashboard size={16} />
            Overview
          </NavLink>
          <NavLink to="/admin/user-management/user-type" className={() => `flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${isUserMgmt ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
            <ShieldCheck size={16} />
            User Management
          </NavLink>
          <NavLink to="/admin/products" className={getMainLinkClass}>
            <PackageSearch size={16} />
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={getMainLinkClass}>
            <ShoppingCart size={16} />
            Orders
          </NavLink>
          <NavLink to="/admin/coupons" className={getMainLinkClass}>
            <Ticket size={16} />
            Coupons
          </NavLink>
        </div>
      </div>

      {isUserMgmt && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <NavLink to="/admin/user-management/user-type" className={getUserMgmtLinkClass}>
              <Layers size={14} />
              <span>User Type</span>
            </NavLink>
            <NavLink to="/admin/user-management/user-level" className={getUserMgmtLinkClass}>
              <Award size={14} />
              <span>User Level</span>
            </NavLink>
            <NavLink to="/admin/user-management/user-role" className={getUserMgmtLinkClass}>
              <ShieldCheck size={14} />
              <span>User Role</span>
            </NavLink>
            <NavLink to="/admin/user-management/level-to-role" className={getUserMgmtLinkClass}>
              <GitMerge size={14} />
              <span>User Level To User Role</span>
            </NavLink>
            <NavLink to="/admin/user-management/role-to-feature" className={getUserMgmtLinkClass}>
              <Lock size={14} />
              <span>User Role To Feature</span>
            </NavLink>
          </div>
        </div>
      )}

      <div>
        <Outlet />
      </div>
    </div>
    </div>
  );
};