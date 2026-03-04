import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutModal from '../components/CheckoutModal'

export default function Cart({ items, onRemove, onUpdateQuantity, total, clearCart }) {
  const [open, setOpen] = useState(false)
  const envio      = total >= 150 ? 0 : 10
  const totalFinal = total + envio
  const count      = items.reduce((s, i) => s + i.quantity, 0)

  if (!items.length) return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-center px-6 gap-6">
      <div className="font-display text-8xl font-black text-white/5">∅</div>
      <h2 className="font-display text-4xl font-bold text-white">Carrito vacío</h2>
      <p className="text-white/35 font-sans max-w-xs">
        Explora el catálogo y agrega libros para continuar.
      </p>
      <Link to="/" className="btn-primary mt-2">Explorar catálogo →</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Header */}
      <div className="border-b border-white/6 py-14 px-6">
        <div className="wrap">
          <span className="eyebrow block mb-3">Tu selección</span>
          <h1 className="font-display font-black text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Carrito de compras
          </h1>
          <p className="text-white/30 font-sans text-sm mt-2">
            {count} {count === 1 ? 'libro' : 'libros'}
          </p>
        </div>
      </div>

      <div className="wrap py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

          {/* ── Items ── */}
          <div className="space-y-1">
            {items.map(item => (
              <CartRow key={item.id} item={item} onRemove={onRemove} onUpdateQuantity={onUpdateQuantity} />
            ))}
            <div className="pt-6">
              <Link to="/"
                className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-yellow-500 transition-colors font-sans">
                ← Continuar comprando
              </Link>
            </div>
          </div>

          {/* ── Summary ── */}
          <div className="lg:sticky lg:top-28 rounded-2xl border border-white/8 bg-obsidian-50 overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>

            {/* Header */}
            <div className="px-7 py-5 border-b border-white/6">
              <h2 className="font-display text-xl font-bold text-white">Resumen</h2>
            </div>

            <div className="px-7 py-6 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-xs font-sans text-white/40">
                  <span className="truncate max-w-[60%]">{item.title} ×{item.quantity}</span>
                  <span className="text-white/60 font-semibold shrink-0 ml-2">
                    S/. {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-7 pb-6 space-y-3 border-t border-white/6 pt-5">
              <div className="flex justify-between text-sm font-sans text-white/40">
                <span>Subtotal</span>
                <span className="text-white/60">S/. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-white/40">Envío</span>
                <span className={`font-semibold ${envio === 0 ? 'text-emerald-400' : 'text-white/60'}`}>
                  {envio === 0 ? '🎉 GRATIS' : `S/. ${envio.toFixed(2)}`}
                </span>
              </div>

              {envio > 0 && (
                <div className="text-xs text-emerald-400/70 bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-4 py-3 font-sans">
                  Agrega S/. {(150 - total).toFixed(2)} más para envío gratis
                </div>
              )}
            </div>

            {/* Total */}
            <div className="px-7 py-5 border-t border-white/6 flex justify-between items-center">
              <span className="text-white/60 font-sans font-semibold">Total</span>
              <span className="font-display font-black text-3xl text-gradient-gold">
                S/. {totalFinal.toFixed(2)}
              </span>
            </div>

            {/* CTA */}
            <div className="px-7 pb-7">
              <button onClick={() => setOpen(true)} className="btn-whatsapp">
                <WhatsAppIcon />
                Pedir por WhatsApp
              </button>
              <p className="text-center text-[0.68rem] text-white/25 mt-3 font-sans">
                💬 Coordinamos entrega y pago directamente contigo
              </p>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <CheckoutModal items={items} total={total} onClose={() => setOpen(false)} clearCart={clearCart} />
      )}
    </div>
  )
}

function CartRow({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="flex gap-5 items-center py-5 border-b border-white/5 group hover:bg-white/2 rounded-xl px-2 transition-colors">
      <img
        src={item.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
        alt={item.title}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100' }}
        className="w-16 h-[84px] object-cover rounded-xl border border-white/8 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-white text-base leading-snug mb-1 truncate">
          {item.title}
        </h3>
        <p className="text-xs text-white/30 italic font-sans mb-3">{item.author}</p>
        <p className="text-xs text-white/25 font-sans mb-3">
          S/. {parseFloat(item.price).toFixed(2)} c/u
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-white/10 bg-obsidian-100 overflow-hidden">
            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white font-bold transition-colors hover:bg-white/5">
              −
            </button>
            <span className="w-8 text-center text-white font-bold text-sm font-sans">{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white font-bold transition-colors hover:bg-white/5">
              +
            </button>
          </div>
          <button onClick={() => onRemove(item.id)}
            className="text-xs text-red-400/60 hover:text-red-400 transition-colors font-sans">
            Eliminar
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-display font-bold text-xl text-white">
          S/. {(parseFloat(item.price) * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}