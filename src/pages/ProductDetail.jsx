import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ProductDetail({ addToCart }) {
  const { id }    = useParams()
  const [product, setProduct]  = useState(null)
  const [loading, setLoading]  = useState(true)
  const [error,   setError]    = useState('')
  const [added,   setAdded]    = useState(false)
  const [qty,     setQty]      = useState(1)
  const [imgErr,  setImgErr]   = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/products/${id}`)
      .then(r => { if (!r.ok) throw new Error('No encontrado'); return r.json() })
      .then(d => { setProduct(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian">
      <div className="font-display text-4xl text-gradient-gold animate-float">Cargando...</div>
    </div>
  )
  if (error || !product) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center text-center px-6">
      <div>
        <div className="font-display text-2xl text-white mb-4">{error}</div>
        <Link to="/" className="btn-primary">← Volver</Link>
      </div>
    </div>
  )

  const stars = Math.round(parseFloat(product.rating) || 4)

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="wrap py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-white/25 mb-12 font-sans">
          <Link to="/" className="hover:text-yellow-500 transition-colors">Inicio</Link>
          <span>›</span>
          <Link to={`/categoria/${product.category_slug}`} className="hover:text-yellow-500 transition-colors">
            {product.category_name}
          </Link>
          <span>›</span>
          <span className="text-white/50 truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 items-start">

          {/* ── Cover ── */}
          <div className="lg:sticky lg:top-28 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)' }}>
              <img
                src={imgErr
                  ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80'
                  : (product.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80')}
                alt={product.title}
                onError={() => setImgErr(true)}
                className="w-full aspect-[3/4] object-cover"
              />
              {/* Gold border shimmer */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(212,168,83,0.15)' }} />
            </div>

            {product.is_featured && (
              <div className="mt-4 text-center">
                <span className="badge-gold">★ Libro Destacado</span>
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="animate-fade-up">
            <span className="badge-gold mb-5 block w-fit">{product.category_name}</span>

            <h1 className="font-display font-black text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}>
              {product.title}
            </h1>

            <p className="text-white/40 font-sans text-base mb-5">
              por <span className="text-white/70 font-medium">{product.author}</span>
            </p>

            {/* Stars */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-yellow-500 tracking-[-1.5px] text-lg">
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              </span>
              <span className="text-white/30 text-sm font-sans">{product.rating} / 5.0</span>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-white/8">
              <span className="font-display font-black text-gradient-gold"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                S/. {parseFloat(product.price).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8 p-5 rounded-2xl border border-white/8 bg-white/3">
                <p className="text-white/55 font-sans text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {[
                ['Edición',  product.edition],
                ['Páginas',  product.pages],
                ['Idioma',   product.language],
                ['ISBN',     product.isbn],
                ['Stock',    product.stock ? `${product.stock} uds.` : null],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label}
                  className="p-4 rounded-xl bg-obsidian-100 border border-white/6">
                  <div className="eyebrow text-[0.6rem] mb-1.5">{label}</div>
                  <div className="text-white font-semibold text-sm font-sans">{value}</div>
                </div>
              ))}
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 items-center mb-4">
              <div className="flex items-center rounded-xl overflow-hidden border border-white/10 bg-obsidian-100">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-12 h-14 flex items-center justify-center text-white/60 hover:text-white font-bold text-xl transition-colors hover:bg-white/5">
                  −
                </button>
                <div className="w-12 h-14 flex items-center justify-center text-white font-bold text-lg font-sans">
                  {qty}
                </div>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-12 h-14 flex items-center justify-center text-white/60 hover:text-white font-bold text-xl transition-colors hover:bg-white/5">
                  +
                </button>
              </div>

              <button onClick={handleAdd}
                className={`flex-1 py-4 rounded-xl font-semibold text-base font-sans transition-all duration-200 hover:-translate-y-0.5 ${
                  added
                    ? 'bg-emerald-600/90 text-white shadow-[0_8px_24px_rgba(16,107,74,0.4)]'
                    : 'bg-yellow-500 text-obsidian hover:bg-yellow-400 shadow-[0_4px_20px_rgba(212,168,83,0.35)] hover:shadow-[0_8px_32px_rgba(212,168,83,0.5)]'
                }`}>
                {added
                  ? '✓ ¡Agregado al carrito!'
                  : `Agregar — S/. ${(parseFloat(product.price) * qty).toFixed(2)}`}
              </button>
            </div>

            <p className="text-center text-xs text-white/25 font-sans">
              💬 Pago coordinado por WhatsApp · Sin cargos online
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}