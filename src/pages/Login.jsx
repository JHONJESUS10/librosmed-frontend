import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Login() {
  const [tab,      setTab]      = useState('login')     // 'login' | 'register'
  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [name,     setName]     = useState('')
  const [code,     setCode]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [shake,    setShake]    = useState(false)
  const [regMsg,   setRegMsg]   = useState('')

  const { login, loginError, setLoginError, isAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/admin'

  useEffect(() => { if (isAuth) navigate(from, { replace: true }) }, [isAuth])
  useEffect(() => { setLoginError(''); setRegMsg('') }, [email, pass, name, code, tab])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const ok = await login(email, pass)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name || !email || !pass || !code) { setRegMsg('Todos los campos son obligatorios.'); return }
    setLoading(true)
    try {
      const res  = await fetch(`${API}/admin/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password: pass, invite_code: code }),
      })
      const data = await res.json()
      if (!res.ok) { setRegMsg(data.error || 'Error al registrarse.'); setLoading(false); return }

      // Auto-login después de registrarse
      await login(email, pass)
      navigate(from, { replace: true })
    } catch {
      setRegMsg('Error de conexión.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 65%)' }} />
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.3), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.15), transparent)' }} />

      {/* Card */}
      <div className="relative w-full max-w-md animate-scale-up"
        style={{
          background:  'rgba(13,18,24,0.95)',
          border:      '1px solid rgba(255,255,255,0.07)',
          borderRadius:'24px',
          boxShadow:   '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,83,0.08)',
          ...(shake && { animation: 'shake 0.4s ease' }),
        }}>

        <div className="h-px rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.6), transparent)' }} />

        <div className="px-10 py-10">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <span className="font-display font-black text-4xl text-white">Libros</span>
              <span className="font-display font-black text-4xl text-gradient-gold">Med</span>
            </div>
            <div className="w-10 h-px mx-auto mb-3"
              style={{ background: 'linear-gradient(90deg, transparent, #d4a853, transparent)' }} />
            <p className="eyebrow text-[0.65rem]">Panel de Administración</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-white/8 mb-7">
            {[
              { k: 'login',    l: 'Iniciar sesión'   },
              { k: 'register', l: 'Nuevo subadmin'   },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className="flex-1 py-2.5 text-sm font-semibold font-sans transition-all"
                style={{
                  background:  tab === t.k ? 'rgba(212,168,83,0.1)' : 'transparent',
                  color:       tab === t.k ? '#d4a853' : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === t.k ? '2px solid #d4a853' : '2px solid transparent',
                }}>
                {t.l}
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="field-label">Correo electrónico</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">✉️</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com" className="input-field pl-10" required />
                </div>
              </div>
              <div>
                <label className="field-label">Contraseña</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">🔒</span>
                  <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                    placeholder="Tu contraseña" className="input-field pl-10 pr-12" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-sm">
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/25 text-red-400 text-sm font-sans">
                  <span className="shrink-0">⚠️</span>{loginError}
                </div>
              )}

              <button type="submit" disabled={loading || !email || !pass}
                className="w-full py-4 rounded-xl font-semibold text-base font-sans transition-all duration-200 flex items-center justify-center gap-3"
                style={{
                  background: loading || !email || !pass ? 'rgba(212,168,83,0.2)' : 'linear-gradient(135deg, #d4a853, #e8c07a)',
                  color:      loading || !email || !pass ? 'rgba(212,168,83,0.4)' : '#080c10',
                  cursor:     loading || !email || !pass ? 'not-allowed' : 'pointer',
                  boxShadow:  loading || !email || !pass ? 'none' : '0 8px 24px rgba(212,168,83,0.3)',
                }}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Verificando...</>
                  : <>Ingresar al Panel <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></>
                }
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="px-4 py-3 rounded-xl text-xs font-sans"
                style={{ background: 'rgba(212,168,83,0.07)', border: '1px solid rgba(212,168,83,0.2)', color: 'rgba(212,168,83,0.8)' }}>
                🔑 Necesitas un código de invitación del administrador principal para registrarte.
              </div>
              <div>
                <label className="field-label">Nombre completo *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre" className="input-field" required />
              </div>
              <div>
                <label className="field-label">Correo electrónico *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com" className="input-field" required />
              </div>
              <div>
                <label className="field-label">Contraseña *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                    placeholder="Mínimo 6 caracteres" className="input-field pr-12" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-sm">
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div>
                <label className="field-label">Código de invitación *</label>
                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="LIBROS-XXXXXX" className="input-field font-mono tracking-wider" required />
              </div>

              {regMsg && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/25 text-red-400 text-sm font-sans">
                  <span className="shrink-0">⚠️</span>{regMsg}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-base font-sans transition-all duration-200 flex items-center justify-center gap-3"
                style={{
                  background: loading ? 'rgba(212,168,83,0.2)' : 'linear-gradient(135deg, #d4a853, #e8c07a)',
                  color:      loading ? 'rgba(212,168,83,0.4)' : '#080c10',
                  boxShadow:  loading ? 'none' : '0 8px 24px rgba(212,168,83,0.3)',
                }}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Creando cuenta...</>
                  : 'Registrarme como SubAdmin'
                }
              </button>
            </form>
          )}

          <div className="mt-7 pt-5 border-t border-white/6 text-center">
            <a href="/" className="text-white/25 hover:text-white/50 text-xs font-sans transition-colors">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}