import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ open, onClose, items, onRemove, onUpdateQuantity, total }) {
  const navigate = useNavigate()
  const count    = items.reduce((s, i) => s + i.quantity, 0)

  if (!open) return null

  return (
    <>
      <div onClick={onClose}
        className="fixed inset-0 z-[2000] bg-black/75 backdrop-blur-sm animate-fade-in" />

      <div className="fixed top-0 right-0 bottom-0 z-[2001] w-full max-w-[400px] flex flex-col animate-slide-right"
        style={{ background: '#0d1218', boxShadow: '-16px 0 80px rgba(0,0,0,0.7), -1px 0 0 rgba(255,255,255,0.05)' }}>

        {/* Gold top accent */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Mi Carrito</h2>
            <p className="text-white/30 text-xs font-sans mt-0.5">{count} {count === 1 ? 'libro' : 'libros'}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/6 text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center text-xl transition-all">
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
              <div className="font-display text-6xl font-black text-white/5">∅</div>
              <p className="font-display text-lg text-white">Vacío</p>
              <p className="text-white/25 text-sm font-sans">Agrega libros para continuar</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map(item => (
                <DrawerItem key={item.id} item={item} onRemove={onRemove} onUpdateQuantity={onUpdateQuantity} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-white/6 px-6 py-5 space-y-4"
            style={{ background: '#080c10' }}>
            <div className="flex justify-between items-center">
              <span className="text-white/40 font-sans text-sm">Total</span>
              <span className="font-display font-black text-3xl text-gradient-gold">
                S/. {total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => { onClose(); navigate('/carrito') }}
              className="w-full py-3.5 rounded-xl bg-yellow-500 text-obsidian font-semibold text-sm font-sans transition-all hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-[0_8px_24px_rgba(212,168,83,0.35)]">
              Ir al checkout →
            </button>

            <p className="text-center text-[0.65rem] text-white/20 font-sans">
              Pago por WhatsApp · Sin cargos online
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function DrawerItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="flex gap-3.5 py-4 items-center">
      <img
        src={item.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80'}
        alt={item.title}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80' }}
        className="w-12 h-[62px] object-cover rounded-lg border border-white/8 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold font-sans leading-snug truncate mb-0.5">{item.title}</p>
        <p className="text-white/25 text-xs italic font-sans mb-2">{item.author}</p>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded-md bg-white/6 border border-white/10 text-white/60 hover:text-white font-bold text-sm flex items-center justify-center transition-colors">
            −
          </button>
          <span className="w-6 text-center text-white text-xs font-bold font-sans">{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded-md bg-white/6 border border-white/10 text-white/60 hover:text-white font-bold text-sm flex items-center justify-center transition-colors">
            +
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-display font-bold text-base text-white">
          S/. {(parseFloat(item.price) * item.quantity).toFixed(2)}
        </p>
        <button onClick={() => onRemove(item.id)}
          className="text-[0.65rem] text-red-400/50 hover:text-red-400 transition-colors font-sans mt-1 block">
          Eliminar
        </button>
      </div>
    </div>
  )
}