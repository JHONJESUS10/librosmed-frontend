import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthModal from './AuthModal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Navbar({ cartCount, onCartOpen }) {
  const [cats,      setCats]      = useState([])
  const [search,    setSearch]    = useState('')
  const [scrolled,  setScrolled]  = useState(false)
  const [user,      setUser]      = useState(null)
  const [showAuth,  setShowAuth]  = useState(false)
  const [authTab,   setAuthTab]   = useState('login')
  const [dropdown,  setDropdown]  = useState(false)
  const dropRef  = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // ── Cargar categorías ──────────────────────────────────
  useEffect(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(setCats).catch(() => {})
  }, [])

  // ── Scroll effect ──────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // ── Leer sesión guardada ───────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lm_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
  }, [])

  // ── Cerrar dropdown al hacer click fuera ──────────────
  useEffect(() => {
    const fn = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const onSearch = e => {
    e.preventDefault()
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('lm_token')
    localStorage.removeItem('lm_user')
    setUser(null)
    setDropdown(false)
  }

  const openLogin    = () => { setAuthTab('login');    setShowAuth(true) }
  const openRegister = () => { setAuthTab('register'); setShowAuth(true) }

  return (
    <>
      <header
        style={{
          background: scrolled
            ? 'rgba(6,9,14,0.97)'
            : 'rgba(8,12,18,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(212,168,83,0.15)'
            : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.4s ease',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(212,168,83,0.1)'
            : 'none',
        }}
        className="sticky top-0 z-50"
      >
        {/* ── Ticker ── */}
        <div className="overflow-hidden border-b border-yellow-500/15"
          style={{ background: 'linear-gradient(90deg, rgba(212,168,83,0.08), rgba(212,168,83,0.15), rgba(212,168,83,0.08))' }}>
          <div className="animate-ticker whitespace-nowrap flex gap-0 text-xs font-medium text-yellow-400/80 tracking-widest uppercase py-1.5">
            {Array(4).fill(null).map((_, i) => (
              <span key={i} className="inline-flex gap-12 px-6">
                <span>📚 Envío gratis en pedidos mayores a S/. 150</span>
                <span>✦</span>
                <span>Libros académicos especializados</span>
                <span>✦</span>
                <span>Pago por WhatsApp · Sin cargos online</span>
                <span>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Main bar ── */}
        <div className="wrap flex items-center gap-4 h-[68px]">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-baseline gap-0 group">
            <span className="font-display text-[1.65rem] font-black text-white tracking-tight leading-none transition-opacity group-hover:opacity-80">
              Libros
            </span>
            <span className="font-display text-[1.65rem] font-black leading-none tracking-tight transition-all"
              style={{ color: '#d4a853', textShadow: '0 0 20px rgba(212,168,83,0.4)' }}>
              Med
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-7 shrink-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)' }} />

          {/* Search */}
          <form onSubmit={onSearch}
            className="flex-1 flex items-center rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,168,83,0.4)'}
            onBlur={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <span className="pl-4 text-white/25 text-sm shrink-0">⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar libros, autores, ISBN..."
              className="flex-1 py-3 px-3 bg-transparent border-none outline-none text-white text-[0.88rem] placeholder:text-white/25 font-sans"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')}
                className="px-3 text-white/25 hover:text-white/60 text-lg transition-colors">×</button>
            )}
            <button type="submit"
              className="px-5 py-3 font-bold text-xs tracking-widest uppercase transition-all shrink-0 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)', color: '#0a0f16' }}>
              BUSCAR
            </button>
          </form>

          {/* ── Botones de usuario ── */}
          {user ? (
            /* Usuario logueado — avatar + dropdown */
            <div className="relative shrink-0" ref={dropRef}>
              <button onClick={() => setDropdown(d => !d)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/6"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)', color: '#0a0f16' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/80 text-sm font-semibold font-sans hidden sm:block max-w-[100px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <svg className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${dropdown ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 animate-fade-up"
                  style={{
                    background: '#0d1520',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,168,83,0.05)',
                  }}>
                  {/* Header del dropdown */}
                  <div className="px-4 py-3.5 border-b border-white/6"
                    style={{ background: 'rgba(212,168,83,0.05)' }}>
                    <p className="text-white font-semibold text-sm font-sans truncate">{user.name}</p>
                    <p className="text-white/35 text-xs font-sans truncate mt-0.5">{user.email}</p>
                  </div>

                  {/* Opciones */}
                  <div className="py-1.5">
                    <DropItem icon="👤" label="Mi cuenta" onClick={() => { setDropdown(false) }} />
                    <DropItem icon="📦" label="Mis pedidos" onClick={() => { setDropdown(false) }} />
                  </div>

                  <div className="border-t border-white/6 py-1.5">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans transition-all hover:bg-red-500/8 group">
                      <span className="text-base">🚪</span>
                      <span className="text-red-400/70 group-hover:text-red-400 transition-colors">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Sin sesión — botones login + registro */
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={openLogin}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold font-sans transition-all duration-200 hover:bg-white/8"
                style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Iniciar sesión
              </button>
              <button onClick={openRegister}
                className="px-4 py-2.5 rounded-xl text-sm font-bold font-sans transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #d4a853, #b8922e)',
                  color: '#0a0f16',
                  boxShadow: '0 4px 16px rgba(212,168,83,0.25)',
                }}>
                Registrarse
              </button>
            </div>
          )}

          {/* Cart */}
          <button onClick={onCartOpen}
            className={`relative shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 ${
              cartCount > 0
                ? 'bg-yellow-500 text-obsidian shadow-[0_4px_20px_rgba(212,168,83,0.35)]'
                : 'bg-white/6 text-white border border-white/10 hover:border-white/22'
            }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-obsidian text-yellow-400 text-[0.6rem] font-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Category nav ── */}
        <div className="border-t border-white/4" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="wrap flex no-scrollbar overflow-x-auto">
            <NavItem to="/" label="Inicio" icon="◈" active={location.pathname === '/'} />
            {cats.map(c => (
              <NavItem key={c.id}
                to={`/categoria/${c.slug}`}
                label={c.name} icon={c.icon}
                active={location.pathname === `/categoria/${c.slug}`} />
            ))}
          </div>
        </div>
      </header>

      {/* AuthModal */}
      {showAuth && (
        <AuthModal
          initialTab={authTab}
          onClose={() => setShowAuth(false)}
          onSuccess={u => { setUser(u); setShowAuth(false) }}
        />
      )}
    </>
  )
}

function NavItem({ to, label, icon, active }) {
  return (
    <Link to={to}
      className={`flex items-center gap-1.5 px-4 py-3 text-[0.8rem] whitespace-nowrap border-b-2 transition-all duration-200 font-sans ${
        active
          ? 'text-yellow-400 border-yellow-500 font-semibold'
          : 'text-white/40 border-transparent hover:text-white/75 hover:border-white/15'
      }`}>
      <span className="text-[0.85rem]">{icon}</span>
      {label}
    </Link>
  )
}

function DropItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans transition-all hover:bg-white/5 group">
      <span className="text-base">{icon}</span>
      <span className="text-white/55 group-hover:text-white/85 transition-colors">{label}</span>
    </button>
  )
}