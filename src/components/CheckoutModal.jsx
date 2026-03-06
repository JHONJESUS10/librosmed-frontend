import React, { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

// ═══════════════════════════════════
//  CAMBIA ESTE NÚMERO POR EL TUYO
const WHATSAPP_NUMBER = '51983553140'
// ═══════════════════════════════════

export default function CheckoutModal({ items, total, onClose, clearCart }) {
  const [step,       setStep]       = useState('form')   // 'form' | 'success'
  const [form,       setForm]       = useState({ name: '', email: '' })
  const [error,      setError]      = useState('')
  const [showAuth,   setShowAuth]   = useState(false)
  const [user,       setUser]       = useState(null)

  const envio      = total >= 150 ? 0 : 10
  const totalFinal = (total + envio).toFixed(2)

  // Verificar si ya hay sesión activa
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lm_user')
      if (saved) {
        const u = JSON.parse(saved)
        setUser(u)
        setForm(p => ({ ...p, name: u.name || '', email: u.email || '' }))
      }
    } catch {}
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Por favor ingresa tu nombre.'); return }

    const lines = items.map(i =>
      `  • ${i.title} (×${i.quantity}) — S/. ${(parseFloat(i.price) * i.quantity).toFixed(2)}`
    ).join('\n')

    const msg = [
      '📚 *PEDIDO — LibrosMed*',
      '─────────────────────',
      `👤 *Cliente:* ${form.name.trim()}`,
      form.email.trim() ? `📧 ${form.email.trim()}` : null,
      '', '*Detalle:*', lines, '',
      `🚚 Envío: ${envio === 0 ? 'GRATIS' : `S/. ${envio}.00`}`,
      `💰 *TOTAL: S/. ${totalFinal}*`,
      '─────────────────────',
      '✅ Confirmar disponibilidad y coordinar entrega.',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    clearCart()
    setStep('success')
  }

  const handleAuthSuccess = (u) => {
    setUser(u)
    setShowAuth(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('lm_token')
    localStorage.removeItem('lm_user')
    setUser(null)
    setForm(p => ({ ...p, name: '', email: '' }))
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose}
        className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-md animate-fade-in" />

      {/* Modal */}
      <div className="fixed inset-0 z-[3001] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-obsidian-100 rounded-3xl overflow-hidden animate-scale-up"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)', maxHeight: '90vh', overflowY: 'auto' }}>

          {/* Gold top line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

          {/* Header */}
          <div className="px-8 py-6 flex justify-between items-start border-b border-white/6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                {step === 'success' ? '¡Listo!' : 'Finalizar pedido'}
              </h2>
              <p className="text-white/35 text-xs mt-1 font-sans">
                {step === 'success' ? 'WhatsApp abierto con tu pedido' : 'Se enviará por WhatsApp'}
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/6 text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center text-xl transition-all">
              ×
            </button>
          </div>

          <div className="px-8 py-7">

            {/* FORM */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Si hay sesión activa — mostrar usuario */}
                {user ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
                    style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black"
                        style={{ background: 'rgba(212,168,83,0.2)', color: '#d4a853' }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold font-sans leading-tight">{user.name}</p>
                        <p className="text-white/35 text-xs font-sans">{user.email}</p>
                      </div>
                    </div>
                    <button type="button" onClick={handleLogout}
                      className="text-white/25 hover:text-white/60 text-xs font-sans transition-colors">
                      Salir
                    </button>
                  </div>
                ) : (
                  /* Sin sesión — botón para iniciar/registrar */
                  <button type="button" onClick={() => setShowAuth(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center text-white/30 text-lg">
                        👤
                      </div>
                      <div className="text-left">
                        <p className="text-white/60 text-sm font-semibold font-sans group-hover:text-white transition-colors">
                          ¿Tienes cuenta? Inicia sesión
                        </p>
                        <p className="text-white/25 text-xs font-sans">O continúa sin registrarte</p>
                      </div>
                    </div>
                    <span className="text-white/20 group-hover:text-white/50 transition-colors">→</span>
                  </button>
                )}

                {/* Resumen del pedido */}
                <div className="rounded-2xl border border-white/8 bg-obsidian-50 p-5 space-y-2.5">
                  <p className="eyebrow text-[0.65rem] mb-3">Tu pedido</p>
                  {items.map(i => (
                    <div key={i.id} className="flex justify-between items-start gap-3">
                      <span className="text-white/60 text-xs font-sans leading-snug flex-1">
                        {i.title}
                        <span className="text-white/30 ml-1">×{i.quantity}</span>
                      </span>
                      <span className="text-white text-xs font-semibold font-sans shrink-0">
                        S/. {(parseFloat(i.price) * i.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/6 pt-3 mt-3 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/35 text-xs font-sans">
                        Envío {envio === 0 && <span className="text-emerald-400 font-semibold">GRATIS 🎉</span>}
                      </span>
                      <span className="text-white/35 text-xs font-sans">
                        {envio === 0 ? 'GRATIS 🎉' : 'S/. 10.00'}
                      </span>
                    </div>
                    <span className="font-display font-black text-2xl text-gradient-gold">
                      S/. {totalFinal}
                    </span>
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="field-label">Tu nombre *</label>
                  <input
                    name="name" value={form.name}
                    onChange={e => { setError(''); setForm(p => ({ ...p, name: e.target.value })) }}
                    placeholder="Ej: María García"
                    className="input-field"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label className="field-label">
                    Correo <span className="text-white/20 font-normal normal-case tracking-normal">(opcional)</span>
                  </label>
                  <input
                    name="email" type="email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="input-field"
                  />
                </div>

                {error && (
                  <div className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-3 font-sans">
                    ⚠️ {error}
                  </div>
                )}

                <div className="text-xs text-emerald-400/70 bg-emerald-900/15 border border-emerald-500/20 rounded-xl px-4 py-3 font-sans flex gap-2.5">
                  <span className="text-base shrink-0">💬</span>
                  Se abrirá WhatsApp con tu pedido completo listo para enviar.
                </div>

                <button type="submit" className="btn-whatsapp">
                  <WhatsAppIcon />
                  Enviar pedido por WhatsApp
                </button>
              </form>
            )}

            {/* SUCCESS — aquí se muestra el banner de registro */}
            {step === 'success' && (
              <div className="space-y-5">
                {/* Confirmación */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <span className="text-4xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Pedido enviado</h3>
                    <p className="text-white/40 text-sm font-sans leading-relaxed">
                      WhatsApp se abrió con tu resumen.<br />
                      <strong className="text-white/70">Envía el mensaje</strong> para confirmar.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-obsidian-50 p-5 text-left space-y-3">
                    {[
                      ['1', 'Envía el mensaje en WhatsApp'],
                      ['2', 'Confirmamos disponibilidad'],
                      ['3', 'Coordinamos entrega y pago'],
                    ].map(([n, t]) => (
                      <div key={n} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs font-black flex items-center justify-center shrink-0">
                          {n}
                        </div>
                        <span className="text-sm text-white/60 font-sans">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── BANNER DE REGISTRO OPCIONAL ── */}
                {!user && (
                  <div className="rounded-2xl p-5 space-y-3"
                    style={{ background: 'rgba(212,168,83,0.07)', border: '1px solid rgba(212,168,83,0.2)' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-white font-semibold text-sm font-sans mb-1">
                          ¿Quieres guardar tus datos?
                        </p>
                        <p className="text-white/40 text-xs font-sans leading-relaxed">
                          Crea una cuenta gratis y la próxima vez tu nombre y correo se llenarán solos.
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setShowAuth(true)}
                      className="w-full py-3 rounded-xl font-bold text-sm font-sans transition-all"
                      style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)', color: '#0d1520' }}>
                      Crear cuenta gratis →
                    </button>
                    <button onClick={onClose}
                      className="w-full py-2 text-xs font-sans text-white/25 hover:text-white/50 transition-colors">
                      No, gracias
                    </button>
                  </div>
                )}

                {/* Si ya tiene sesión, solo botón de cerrar */}
                {user && (
                  <button onClick={onClose} className="btn-dark w-full py-3.5">
                    Seguir explorando →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AuthModal — aparece encima del checkout */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
          message="Crea tu cuenta para que la próxima compra sea más rápida."
        />
      )}
    </>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}