import React, { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AuthModal({ onClose, onSuccess, message, initialTab }) {
  const [tab,     setTab]     = useState(initialTab || 'login')   // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form,    setForm]    = useState({ name: '', email: '', password: '', phone: '' })

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Completa todos los campos obligatorios.'); return }
    if (tab === 'register' && !form.name) { setError('El nombre es obligatorio.'); return }

    setLoading(true)
    try {
      const endpoint = tab === 'register' ? '/auth/register' : '/auth/login'
      const body     = tab === 'register'
        ? { name: form.name, email: form.email, password: form.password, phone: form.phone }
        : { email: form.email, password: form.password }

      const res  = await fetch(`${API}${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Ocurrió un error.'); setLoading(false); return }

      // Guardar sesión en localStorage
      localStorage.setItem('lm_token', data.token)
      localStorage.setItem('lm_user',  JSON.stringify(data.user))

      onSuccess(data.user)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="relative w-full max-w-md rounded-3xl overflow-hidden animate-fade-up"
        style={{ background: '#0d1520', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>

        {/* Header dorado */}
        <div className="px-8 pt-8 pb-6 border-b border-white/6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-2xl font-black text-white">
              Libros<span style={{ color: '#d4a853' }}>Med</span>
            </span>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/8 transition-all text-lg">
              ✕
            </button>
          </div>

          {/* Mensaje opcional (ej: "Para completar tu pedido...") */}
          {message && (
            <p className="text-sm font-sans mt-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', color: '#d4a853' }}>
              {message}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/6">
          {[
            { k: 'login',    label: 'Iniciar sesión' },
            { k: 'register', label: 'Crear cuenta'   },
          ].map(t => (
            <button key={t.k} onClick={() => { setTab(t.k); setError('') }}
              className="flex-1 py-3.5 text-sm font-semibold font-sans transition-all"
              style={{
                color:       tab === t.k ? '#d4a853' : 'rgba(255,255,255,0.35)',
                borderBottom: tab === t.k ? '2px solid #d4a853' : '2px solid transparent',
                background:  'transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <div className="px-8 py-6 space-y-4">

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 font-sans">
                Nombre completo *
              </label>
              <input name="name" value={form.name} onChange={handle}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 rounded-xl text-sm font-sans text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.target.style.borderColor = '#d4a853'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 font-sans">
              Correo electrónico *
            </label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 rounded-xl text-sm font-sans text-white outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.target.style.borderColor = '#d4a853'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 font-sans">
              Contraseña *
            </label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 rounded-xl text-sm font-sans text-white outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.target.style.borderColor = '#d4a853'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 font-sans">
                Teléfono / WhatsApp <span className="text-white/20 normal-case">(opcional)</span>
              </label>
              <input name="phone" value={form.phone} onChange={handle}
                placeholder="987 654 321"
                className="w-full px-4 py-3 rounded-xl text-sm font-sans text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.target.style.borderColor = '#d4a853'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs font-sans px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </p>
          )}

          {/* Botón principal */}
          <button onClick={submit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm font-sans transition-all mt-2"
            style={{
              background:  loading ? 'rgba(212,168,83,0.4)' : 'linear-gradient(135deg, #d4a853, #b8922e)',
              color:       '#0d1520',
              opacity:     loading ? 0.7 : 1,
              cursor:      loading ? 'not-allowed' : 'pointer',
            }}>
            {loading ? 'Procesando...' : tab === 'login' ? 'Iniciar sesión' : 'Crear mi cuenta'}
          </button>

          {/* Saltar (opcional) */}
          <button onClick={onClose}
            className="w-full py-2 text-xs font-sans text-white/25 hover:text-white/50 transition-colors">
            {tab === 'login' ? 'Continuar sin cuenta →' : 'Registrarme después →'}
          </button>

        </div>
      </div>
    </div>
  )
}