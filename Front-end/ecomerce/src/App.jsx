import { useState } from 'react'
import { Header } from './layouts/Header.jsx'
import { AppRoutes } from './routes/AppRoute.jsx'
import { Footer } from './layouts/Footer.jsx'
import { Mockup } from './components/Mockup.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { CartDrawer } from './components/cart/CartDrawer.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Checkoutform } from './components/cart/Checkoutform.jsx'
import { HistoryCard } from './components/HistoryCard.jsx'
import { useAuth } from './hooks/useAuth.js'
import './App.css'

function AppContent() {
  const { isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false)
  const [closeForm, openForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Đang xác minh tài khoản...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <CartProvider>
        <Header onSearch={setSearchQuery} onAccountClick={() => setShowModal(true)}
          openForm={() => openForm(true)} />

        <AppRoutes searchQuery={searchQuery} />
        <Footer />
        {showModal && <Mockup onClose={() => setShowModal(false)} />}
        {showCheckOut && <Checkoutform onClose1={() => setShowCheckOut(false)} />}
        {closeForm && <HistoryCard onCloseForm={() => openForm(false)} />}
        <CartDrawer onAccountClick={() => setShowModal(true)}
          onAccountClick1={() => setShowCheckOut(true)}
        />
      </CartProvider>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
