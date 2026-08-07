import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Search, Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import axiosClient from '../../api/axiosClient';

interface NavbarProps {
  onOpenAuthModal: () => void;
  onToggleSidebar?: () => void;
}

const SearchBar = ({ onSearch, onClear }: { onSearch: (query: string) => void, onClear: () => void }) => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    } else {
      onClear();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === '') {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto w-full relative group">
      <div className="flex items-stretch w-full bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-sm shadow-black/5 dark:shadow-inner">
        <input 
          type="text" 
          value={query}
          onChange={handleChange}
          placeholder="Search for premium products..." 
          className="w-full bg-transparent text-slate-900 dark:text-slate-100 px-4 py-2.5 sm:py-2 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 sm:py-2 transition-colors flex items-center justify-center border-l border-primary-dark">
          <Search size={18} />
        </button>
      </div>
    </form>
  );
};

export const Navbar = ({ onOpenAuthModal, onToggleSidebar }: NavbarProps) => {
  const { cart, toggleCart } = useCartStore();
  const { isAuthenticated, userEmail, logout, fetchUserInfo } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const isWarehouseOnly = false;
  
  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed', e);
    }
    logout();
  };

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsMobileMenuOpen(false);
  };

  const handleClearSearch = () => {
    navigate('/');
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-4 pointer-events-none transition-all duration-300">
        <header className="pointer-events-auto max-w-7xl mx-auto w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl saturate-150 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-900/5 dark:shadow-black/20 rounded-2xl transition-all duration-300">
        {/* Top Row: Hamburger Menu Button, Logo, Search, Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Sidebar Toggle Button & Brand Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              onClick={onToggleSidebar ? onToggleSidebar : () => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity">
              EXOUSIA.
            </Link>
          </div>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex flex-1 px-4 lg:px-8">
            {!isWarehouseOnly && <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />}
          </div>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Badge */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile/account" className="flex items-center space-x-2 hover:text-slate-900 dark:hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-800">
                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-semibold text-slate-700 dark:text-slate-200 hidden md:block">{userEmail?.split('@')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={onOpenAuthModal} className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/20 hover:shadow-primary/40">
                <User size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
            
            {/* Shopping Cart */}
            {!isWarehouseOnly && (
              <button 
                onClick={toggleCart}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
                aria-label="Open Cart"
              >
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform duration-300" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-slate-900"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}
          </div>
        </div>

          <div className="sm:hidden px-4 pb-3 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
        </header>
      </div>
    </>
  );
};
