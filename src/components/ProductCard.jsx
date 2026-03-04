import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false)
  const [added,   setAdded]   = useState(false)
  const [imgErr,  setImgErr]  = useState(false)

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const stars = Math.round(parseFloat(product.rating) || 4)
  const price = parseFloat(product.price).toFixed(2)
  const stockLow = parseInt(product.stock) < 4

  return (
    <Link to={`/producto/${product.id}`} className="block h-full">
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="book-card group"
        style={{ boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,83,0.3)' : '0 4px 24px rgba(0,0,0,0.4)' }}
      >
        {/* ── Cover image ── */}
        <div className="relative overflow-hidden shrink-0 bg-obsidian-200" style={{ paddingTop: '145%' }}>
          <img
            src={imgErr
              ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
              : (product.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80')}
            alt={product.title}
            onError={() => setImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
          />

          {/* Cinematic overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(to top, rgba(8,12,16,0.96) 0%, rgba(8,12,16,0.5) 40%, rgba(8,12,16,0.1) 70%, transparent 100%)',
              opacity: hovered ? 1 : 0.5,
            }}
          />

          {/* Featured badge */}
          {product.is_featured && (
            <div className="absolute top-3 right-3 badge-gold text-[0.6rem] tracking-widest">
              ★ DEST
            </div>
          )}

          {/* Price — always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div
              className="transition-all duration-400"
              style={{ transform: hovered ? 'translateY(0)' : 'translateY(4px)', opacity: hovered ? 1 : 0.9 }}
            >
              <span className="font-display font-bold text-xl text-white">
                S/. {price}
              </span>
            </div>

            {/* CTA button */}
            <button
              onClick={handleAdd}
              className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs tracking-wider transition-all duration-300"
              style={{
                background: added ? '#1a6b4a' : 'rgba(212,168,83,0.95)',
                color: added ? '#fff' : '#080c10',
                transform: hovered ? 'translateY(0) scaleY(1)' : 'translateY(8px) scaleY(0.8)',
                opacity: hovered ? 1 : 0,
                transformOrigin: 'bottom',
              }}
            >
              {added ? '✓ Agregado' : '+ Agregar al carrito'}
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <span className="eyebrow text-[0.62rem] truncate">
            {product.category_name || ''}
          </span>

          <h3 className="font-display font-bold text-[0.95rem] text-white leading-snug line-clamp-2 group-hover:text-yellow-50 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-white/40 italic truncate">{product.author}</p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/6">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs tracking-[-1.5px]">
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              </span>
              <span className="text-[0.65rem] text-white/30 ml-1">{product.rating}</span>
            </div>

            <span className={`text-[0.65rem] font-semibold ${stockLow ? 'text-red-400' : 'text-emerald-400/80'}`}>
              {stockLow ? `⚡ ${product.stock}` : '✓ Stock'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}