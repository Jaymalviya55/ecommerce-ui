import { User, Package, MessagesSquare } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { NavLink, Outlet } from 'react-router-dom';



export const Profile = () => {
  const { roles } = useAuthStore();

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
      isActive
        ? 'bg-primary/10 dark:bg-primary/20 text-primary font-bold'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Navigation Sidebar (Desktop Only) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex flex-col gap-2 shadow-sm dark:shadow-none">
            <NavLink to="/profile/account" className={getLinkClass}>
              <User size={20} />
              Account Details
            </NavLink>
            {!roles.includes('FulfillmentStaff') && (
              <>
                <NavLink to="/profile/addresses" className={getLinkClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Manage Addresses
                </NavLink>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700/50"></div>
                <NavLink to="/profile/orders" className={getLinkClass}>
                  <Package size={20} />
                  My Orders
                </NavLink>
                <NavLink to="/profile/coupons" className={getLinkClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566z"/></svg>
                  My Coupons
                </NavLink>
                <NavLink to="/profile/reviews" className={getLinkClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  My Reviews
                </NavLink>
                <div className="my-2 border-t border-slate-200 dark:border-slate-700/50"></div>
                <NavLink to="/profile/support" className={getLinkClass}>
                  <MessagesSquare size={20} />
                  Help & Support
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Content Area for Sub-routes */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
