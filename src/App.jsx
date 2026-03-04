import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import ProtectedRoute    from './components/ProtectedRoute'
import Navbar            from './components/Navbar'
import Footer            from './components/Footer'
import CartDrawer        from './components/CartDrawer'
import WhatsAppChat      from './components/Whatsappchat'
import Home              from './pages/Home'
import Category          from './pages/Category'
import ProductDetail     from './pages/ProductDetail'
import Cart              from './pages/Cart'
import Admin             from './pages/Admin'
import Login             from './pages/Login'

function AppRoutes() {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('librosmed_cart') || '[]') }
    catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('librosmed_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }
  const removeFromCart = (id)      => setCartItems(p => p.filter(i => i.id !== id))
  const updateQuantity = (id, qty) => {
    if (qty < 1) return removeFromCart(id)
    setCartItems(p => p.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }
  const clearCart  = () => setCartItems([])
  const cartCount  = cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartTotal  = cartItems.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0)

  const location = useLocation()
  const isAdmin  = location.pathname.startsWith('/admin')

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#080c10' }}>

      {/* Solo en rutas de clientes */}
      {!isAdmin && <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />}
      {!isAdmin && (
        <CartDrawer
          open={cartOpen} onClose={() => setCartOpen(false)}
          items={cartItems} onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity} total={cartTotal} clearCart={clearCart}
        />
      )}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/"                element={<Home addToCart={addToCart} />} />
          <Route path="/categoria/:slug" element={<Category addToCart={addToCart} />} />
          <Route path="/producto/:id"    element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/carrito"         element={
            <Cart items={cartItems} onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity} total={cartTotal} clearCart={clearCart} />
          } />

          {/* Rutas de admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}

      {/* Chatbot flotante — solo en rutas de clientes */}
      {!isAdmin && <WhatsAppChat />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}