import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Checkout } from './pages/Checkout'
import { ProductDetail } from './pages/ProductDetail'
import { Category } from './pages/Category'
import { AdminDashboard } from './pages/AdminDashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { CartSidebar } from './components/CartSidebar'
import { AuthModal } from './components/AuthModal'
import { useCartStore } from './store/useCartStore'
import { useAuthStore } from './store/useAuthStore'
import { Analytics } from '@vercel/analytics/react'
import { ShoppingBag, User, LogOut, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const { cart, toggleCart, fetchCart } = useCartStore()
  const { isAuthenticated, isAdmin, userEmail, logout } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    fetchCart()
  }, [])

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-primary selection:text-white">
      <CartSidebar />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pb-2">
        <div className="max-w-7xl mx-auto rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl px-6 py-3 flex justify-between items-center transition-all duration-300">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity">
            EXOUSIA.
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-8 text-sm font-semibold text-slate-300">
              <li><Link to="/" className="hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/category/electronics" className="hover:text-primary transition-colors">Tech</Link></li>
              <li><Link to="/category/clothes" className="hover:text-primary transition-colors">Apparel</Link></li>
              
              {isAdmin && (
                <li>
                  <Link to="/admin" className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-full">
                    <Shield size={14} />
                    <span>Admin</span>
                  </Link>
                </li>
              )}
              
              <li className="flex items-center space-x-6 border-l border-slate-700/50 pl-6">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="flex items-center space-x-2 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors border border-slate-600">
                        <User size={16} className="text-slate-300 group-hover:text-white" />
                      </div>
                      <span className="max-w-[100px] truncate">{userEmail?.split('@')[0]}</span>
                    </Link>
                    <button onClick={logout} className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-400/10" title="Logout">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5">
                    <User size={16} />
                    <span>Sign In</span>
                  </button>
                )}
                
                <button 
                  onClick={toggleCart}
                  className="relative p-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  <AnimatePresence>
                    {cartItemCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-rose-500/40 border-2 border-slate-800"
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:name" element={<Category />} />
              
              <Route element={<ProtectedRoute onShowLogin={() => setIsAuthModalOpen(true)} />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Analytics />
    </div>
  )
}

export default App
