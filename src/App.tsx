import { useEffect } from 'react'
import { ProductGrid } from './components/ProductGrid'
import { CartSidebar } from './components/CartSidebar'
import { CheckoutModal } from './components/CheckoutModal'
import { useCartStore } from './store/useCartStore'

function App() {
  const { cart, toggleCart, fetchCart } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [])

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="min-h-screen">
      <CartSidebar />
      <CheckoutModal />
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight">EnterpriseStore</h1>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium text-gray-600">
              <li className="hover:text-indigo-600 cursor-pointer">Shop</li>
              <li className="hover:text-indigo-600 cursor-pointer">Categories</li>
              <li className="hover:text-indigo-600 cursor-pointer" onClick={toggleCart}>
                Cart ({cartItemCount})
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <ProductGrid />
      </main>
    </div>
  )
}

export default App
