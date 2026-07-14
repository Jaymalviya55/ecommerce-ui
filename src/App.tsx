import { useEffect, useState } from 'react'
import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Lazy load pages to split code and improve FCP/LCP
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })))
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })))
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })))
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(module => ({ default: module.ProductDetail })))
const Category = lazy(() => import('./pages/Category').then(module => ({ default: module.Category })))
const Search = lazy(() => import('./pages/Search').then(module => ({ default: module.Search })))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
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
      
      <main className="flex-1 pt-32 pb-12 px-4 w-full max-w-[1750px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-[calc(100vh-250px)]"
          >
            <Suspense fallback={
              <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
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
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <Analytics />
    </div>
  )
}

export default App
