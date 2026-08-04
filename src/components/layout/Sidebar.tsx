import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthorizedMenu, type MenuItem } from '../../config/menu-routes';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Home,
  User,
  MapPin,
  Package,
  Ticket,
  Star,
  MessageSquare,
  Headphones,
  BarChart2,
  Truck,
  Shield,
  LayoutDashboard,
  Users,
  ShoppingCart,
  UserPlus,
  Tag,
  ChevronDown,
  LogOut,
  X,
  Store,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Home,
  User,
  MapPin,
  Package,
  Ticket,
  Star,
  MessageSquare,
  Headphones,
  BarChart2,
  Truck,
  Shield,
  LayoutDashboard,
  Users,
  ShoppingCart,
  UserPlus,
  Tag,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const menuItems = useAuthorizedMenu();
  const { userEmail, isAuthenticated, logout } = useAuthStore();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (label: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const renderIcon = (name?: string) => {
    if (!name) return null;
    const IconComponent = iconMap[name] || Store;
    return <IconComponent size={18} className="flex-shrink-0" />;
  };

  const renderMenuItems = (items: MenuItem[], depth = 0) => {
    return (
      <ul className={`space-y-1 ${depth > 0 ? 'pl-4 mt-1 border-l-2 border-slate-200 dark:border-slate-800' : ''}`}>
        {items.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedKeys.has(item.label);

          if (hasChildren) {
            return (
              <li key={index}>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    {renderIcon(item.icon)}
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`}
                  />
                </button>
                {isExpanded && item.children && renderMenuItems(item.children, depth + 1)}
              </li>
            );
          }

          return (
            <li key={index}>
              <NavLink
                to={item.path || '#'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {renderIcon(item.icon)}
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* Sidebar Overlay (Desktop & Mobile) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-slate-800">
          <NavLink to="/" className="flex items-center space-x-3" onClick={onClose}>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent tracking-tighter">
              EXOUSIA.
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Authorized Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div>
            <div className="px-3 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </div>
            {renderMenuItems(menuItems)}
          </div>
        </div>

        {/* Footer User Info / Logout */}
        {isAuthenticated && userEmail && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-800">
                  {userEmail[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userEmail.split('@')[0]}</p>
                  <p className="text-[10px] font-medium text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                title="Logout"
                className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
