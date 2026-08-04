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
const FulfillmentDashboard = lazy(() => import('./pages/FulfillmentDashboard').then(module => ({ default: module.FulfillmentDashboard })))
const SupportDashboard = lazy(() => import('./pages/SupportDashboard').then(module => ({ default: module.SupportDashboard })))
const SupportAnalytics = lazy(() => import('./pages/SupportAnalytics').then(module => ({ default: module.SupportAnalytics })))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(module => ({ default: module.VerifyEmail })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(module => ({ default: module.ResetPassword })))
import { PersonalInfo } from './components/profile/PersonalInfo'
import { ManageAddresses } from './components/profile/ManageAddresses'
import { MyOrders } from './components/profile/MyOrders'
import { MyCoupons } from './components/profile/MyCoupons'
import { MyReviews } from './components/profile/MyReviews'
import { CustomerTickets } from './components/profile/CustomerTickets'
import { DashboardAnalytics } from './components/admin/DashboardAnalytics'
import { ProductManagement } from './components/admin/ProductManagement'
import { OrderManagement } from './components/admin/OrderManagement'
import { CouponManagement } from './components/admin/CouponManagement'
import { UserTypeManagement } from './components/admin/usermanagement/UserTypeManagement'
import { UserLevelManagement } from './components/admin/usermanagement/UserLevelManagement'
import { UserRoleManagement } from './components/admin/usermanagement/UserRoleManagement'
import { UserLevelToRoleManagement } from './components/admin/usermanagement/UserLevelToRoleManagement'
import { UserRoleToFeatureManagement } from './components/admin/usermanagement/UserRoleToFeatureManagement'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { FulfillmentRoute } from './components/FulfillmentRoute'
import { CartSidebar } from './components/CartSidebar'
import { AuthModal } from './components/AuthModal'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'
import { Footer } from './components/layout/Footer'
import { useCartStore } from './store/useCartStore'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Analytics } from '@vercel/analytics/react'
// Cleaned up unused lucide icons
import { motion, AnimatePresence } from 'framer-motion'
import { SupportRoute } from './components/SupportRoute'
import { ToastProvider } from './components/ui/ToastProvider'
// Search is imported from pages

function App() {
  const { fetchCart } = useCartStore()
  const { logout } = useAuthStore()
  useThemeStore() // init theme store for persistence
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
            if (typeof parsed !== 'object' || parsed === null || !parsed.state?.isAuthenticated) {
              logout()
              window.location.href = '/'
            }
          } catch (error) {
            console.error("Failed to parse auth storage sync, enforcing logout for safety", error)
            logout()
            window.location.href = '/'
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [logout])


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 selection:bg-primary selection:text-white transition-colors duration-300">
      <ToastProvider />
      <CartSidebar />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
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
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route element={<ProtectedRoute onShowLogin={() => setIsAuthModalOpen(true)} />}>
                  <Route path="/profile" element={<Profile />}>
                    <Route index element={<PersonalInfo />} />
                    <Route path="account" element={<PersonalInfo />} />
                    <Route path="addresses" element={<ManageAddresses />} />
                    <Route path="orders" element={<MyOrders />} />
                    <Route path="coupons" element={<MyCoupons />} />
                    <Route path="reviews" element={<MyReviews />} />
                    <Route path="support" element={<CustomerTickets />} />
                  </Route>
                  <Route path="/checkout" element={<Checkout />} />
                </Route>

                <Route element={<SupportRoute />}>
                  <Route path="/support" element={<SupportDashboard />} />
                  <Route path="/support/analytics" element={<SupportAnalytics />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<DashboardAnalytics />} />
                    <Route path="overview" element={<DashboardAnalytics />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="coupons" element={<CouponManagement />} />
                    <Route path="user-management/user-type" element={<UserTypeManagement />} />
                    <Route path="user-management/user-level" element={<UserLevelManagement />} />
                    <Route path="user-management/user-role" element={<UserRoleManagement />} />
                    <Route path="user-management/level-to-role" element={<UserLevelToRoleManagement />} />
                    <Route path="user-management/role-to-feature" element={<UserRoleToFeatureManagement />} />
                  </Route>
                </Route>
                
                <Route element={<FulfillmentRoute />}>
                  <Route path="/fulfillment" element={<FulfillmentDashboard />} />
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
