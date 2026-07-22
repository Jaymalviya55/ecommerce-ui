import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Shield, Search, Menu, X, Sun, Moon, Package, MessagesSquare, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

interface NavbarProps {
  onOpenAuthModal: () => void;
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

export const Navbar = ({ onOpenAuthModal }: NavbarProps) => {
  const { cart, toggleCart } = useCartStore();
  const { isAuthenticated, isAdmin, userEmail, logout, roles } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isWarehouseOnly = roles.includes('FulfillmentStaff') && !isAdmin;
  
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsMobileMenuOpen(false);
  };

  const handleClearSearch = () => {
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  return (
    <>
      {/* 
        We use glassmorphism backgrounds for both themes. 
      */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl saturate-150 border-b border-slate-200/50 dark:border-slate-700/30 shadow-sm transition-all duration-300">
        
        {/* Top Row: Logo, Desktop Search, Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              className="lg:hidden text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1 -ml-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity">
              EXOUSIA.
            </Link>
          </div>
          
          <div className="hidden lg:flex flex-1 px-8">
            {!isWarehouseOnly && <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />}
          </div>

          {/* Desktop Links & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {!isWarehouseOnly && (
                  <>
                    <li><Link to="/" className="hover:text-primary transition-colors">Shop</Link></li>
                    <li><Link to="/category/electronics" className="hover:text-primary transition-colors">Tech</Link></li>
                    <li><Link to="/category/clothes" className="hover:text-primary transition-colors">Apparel</Link></li>
                  </>
                )}
                
                {isAdmin && (
                  <li>
                    <Link to="/admin" className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-full">
                      <Shield size={14} />
                      <span>Admin</span>
                    </Link>
                  </li>
                )}
                {roles.includes('FulfillmentStaff') && (
                  <li>
                    <Link to="/fulfillment" className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-1.5 rounded-full">
                      <Package size={14} />
                      <span>Warehouse</span>
                    </Link>
                  </li>
                )}
                {(isAdmin || roles.includes('SupportAgent')) && (
                  <>
                    <li>
                      <Link to="/support" className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-full">
                        <MessagesSquare size={14} />
                        <span>Support Desk</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/support/analytics" className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-full">
                        <BarChart3 size={14} />
                        <span>Analytics</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Auth & Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:border-l border-slate-200 dark:border-slate-700/50 lg:pl-6">
              
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 hover:text-slate-900 dark:hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                      <User size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white" />
                    </div>
                    <span className="max-w-[100px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block">{userEmail?.split('@')[0]}</span>
                  </Link>
                  <button onClick={logout} className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-400/10" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={onOpenAuthModal} className="hidden sm:flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
                  <User size={16} />
                  <span>Sign In</span>
                </button>
              )}
              
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
                        className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-slate-800"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}
            </div>
          </div>
        </div>

        {!isWarehouseOnly && (
          <div className="lg:hidden px-4 pb-3 pt-1 border-t border-slate-200 dark:border-slate-700/30">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
        )}
      </header>

      {/* Mobile Sidebar Menu (Hamburger Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  {isAuthenticated ? `Hi, ${userEmail?.split('@')[0]}` : 'Welcome'}
                </span>
                <button onClick={closeMobileMenu} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                  {!isWarehouseOnly && (
                    <>
                      <Link to="/" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">Home (Shop All)</Link>
                      <Link to="/category/electronics" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">Electronics</Link>
                      <Link to="/category/clothes" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">Apparel</Link>
                    </>
                  )}
                  
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors mt-4 border border-emerald-500/20">
                      <div className="flex items-center space-x-2">
                        <Shield size={18} />
                        <span>Admin Dashboard</span>
                      </div>
                    </Link>
                  )}
                  {(roles.includes('FulfillmentStaff')) && (
                    <Link to="/fulfillment" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-colors mt-2 border border-purple-500/20">
                      <div className="flex items-center space-x-2">
                        <Package size={18} />
                        <span>Fulfillment Station</span>
                      </div>
                    </Link>
                  )}
                  {(roles.includes('SupportAgent') || isAdmin) && (
                    <>
                      <Link to="/support" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors mt-2 border border-indigo-500/20">
                        <div className="flex items-center space-x-2">
                          <MessagesSquare size={18} />
                          <span>Support Desk</span>
                        </div>
                      </Link>
                      <Link to="/support/analytics" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors mt-2 border border-indigo-500/20">
                        <div className="flex items-center space-x-2">
                          <BarChart3 size={18} />
                          <span>Support Analytics</span>
                        </div>
                      </Link>
                    </>
                  )}
                </nav>
                
                <div className="mt-8 px-3 border-t border-slate-200 dark:border-slate-800 pt-6">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Link to="/profile" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors">Your Profile & Orders</Link>
                      <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full text-left px-4 py-3 text-base font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { closeMobileMenu(); onOpenAuthModal(); }} className="w-full px-4 py-3 text-base font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors flex items-center justify-center gap-2">
                      <User size={18} />
                      <span>Sign In / Register</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
