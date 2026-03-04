import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Navbar({ cartCount, onCartOpen }) {
  const [cats,     setCats]     = useState([])
  const [search,   setSearch]   = useState('')
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(setCats).catch(() => {})
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const onSearch = e => {
    e.preventDefault()
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header
      style={{
        background: scrolled
          ? 'rgba(8,12,16,0.96)'
          : 'rgba(8,12,16,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.5)' : 'none',
      }}
      className="sticky top-0 z-50"
    >
      {/* ── Ticker bar ── */}
      <div className="overflow-hidden bg-gradient-to-r from-yellow-600/20 via-yellow-500/30 to-yellow-600/20 border-b border-yellow-500/20 py-1.5">
        <div className="animate-ticker whitespace-nowrap flex gap-0 text-xs font-medium text-yellow-400/90 tracking-widest uppercase">
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
      <div className="wrap flex items-center gap-5 h-[68px]">

        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-baseline gap-0.5 group">
          <span className="font-display text-[1.65rem] font-black text-white tracking-tight leading-none">
            Libros
          </span>
          <span className="font-display text-[1.65rem] font-black leading-none text-gradient-gold tracking-tight">
            Med
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-8 bg-white/8 shrink-0" />

        {/* Search */}
        <form onSubmit={onSearch}
          className="flex-1 flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/5 transition-all focus-within:border-yellow-500/40 focus-within:bg-white/8">
          <span className="pl-4 text-white/30 text-sm shrink-0">⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar libros, autores, ISBN..."
            className="flex-1 py-3 px-3 bg-transparent border-none outline-none text-white text-[0.88rem] placeholder:text-white/30 font-sans"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')}
              className="px-3 text-white/30 hover:text-white/60 text-lg transition-colors">×</button>
          )}
          <button type="submit"
            className="px-5 py-3 bg-yellow-500 text-obsidian font-bold text-xs tracking-widest uppercase hover:bg-yellow-400 transition-colors shrink-0">
            BUSCAR
          </button>
        </form>

        {/* Cart */}
        <button onClick={onCartOpen}
          className={`relative shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 ${
            cartCount > 0
              ? 'bg-yellow-500 text-obsidian shadow-[0_4px_20px_rgba(212,168,83,0.4)]'
              : 'bg-white/7 text-white border border-white/12 hover:border-white/25'
          }`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          <span>Carrito</span>
          {cartCount > 0 && (
            <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-obsidian text-yellow-400 text-[0.65rem] font-black">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Category nav ── */}
      <div className="border-t border-white/5 bg-black/30">
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
  )
}

function NavItem({ to, label, icon, active }) {
  return (
    <Link to={to}
      className={`flex items-center gap-1.5 px-4 py-3 text-[0.8rem] whitespace-nowrap border-b-2 transition-all duration-200 font-sans ${
        active
          ? 'text-yellow-400 border-yellow-500 font-semibold'
          : 'text-white/45 border-transparent hover:text-white/80 hover:border-white/20'
      }`}>
      <span className="text-[0.85rem]">{icon}</span>
      {label}
    </Link>
  )
}