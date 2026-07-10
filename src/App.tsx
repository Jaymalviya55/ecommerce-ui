import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Checkout } from './pages/Checkout'
import { ProductDetail } from './pages/ProductDetail'
import { Category } from './pages/Category'
import { Search } from './pages/Search'
import { AdminDashboard } from './pages/AdminDashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { CartSidebar } from './components/CartSidebar'
import { AuthModal } from './components/AuthModal'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { useCartStore } from './store/useCartStore'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Analytics } from '@vercel/analytics/react'
// Cleaned up unused lucide icons
import { motion, AnimatePresence } from 'framer-motion'
// Search is imported from pages

function App() {
  const { fetchCart } = useCartStore()
  const { logout } = useAuthStore()
  useThemeStore() // init theme store for persistence
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    fetchCart()
  }, [])

  // Cross-tab synchronization for secure logout
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-storage') {
        if (!e.newValue) {
          // The storage was completely removed (Hard Logout in another tab)
          logout()
          window.location.href = '/'
        } else {
          try {
            const parsed = JSON.parse(e.newValue)
            if (!parsed.state?.isAuthenticated) {
              logout()
              window.location.href = '/'
            }
          } catch (error) {
            console.error("Failed to parse auth storage sync", error)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [logout])


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 selection:bg-primary selection:text-white transition-colors duration-300">
      <CartSidebar />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-1 pt-32 pb-12 px-4 w-full max-w-7xl mx-auto">
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
              <Route path="/search" element={<Search />} />
              
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

      <Footer />
      <Analytics />
    </div>
  )
}

export default App
