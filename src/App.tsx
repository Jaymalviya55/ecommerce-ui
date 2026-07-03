import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CartSidebar } from './components/CartSidebar'
import { CheckoutModal } from './components/CheckoutModal'
import { AuthModal } from './components/AuthModal'
import { useCartStore } from './store/useCartStore'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const { cart, toggleCart, fetchCart } = useCartStore()
  const { isAuthenticated, userEmail, logout } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen">
      <CartSidebar />
      <CheckoutModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tight">EnterpriseStore</Link>
          <nav>
            <ul className="flex items-center space-x-6 text-sm font-medium text-gray-600">
              <li><Link to="/" className="hover:text-indigo-600">Shop</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600">Profile</Link></li>
              <li className="hover:text-indigo-600 cursor-pointer" onClick={toggleCart}>
                Cart ({cartItemCount})
              </li>
              <li className="border-l pl-6 flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm font-medium text-gray-700">Hi, {userEmail?.split('@')[0]}</span>
                    <button onClick={logout} className="text-red-600 hover:text-red-500 font-medium">Logout</button>
                  </>
                ) : (
                  <button onClick={() => setIsAuthModalOpen(true)} className="text-indigo-600 hover:text-indigo-500 font-medium">Login</button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route element={<ProtectedRoute onShowLogin={() => setIsAuthModalOpen(true)} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App
