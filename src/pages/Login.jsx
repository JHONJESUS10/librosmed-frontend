import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [user,    setUser]    = useState('')
  const [pass,    setPass]    = useState('')
  const [showPass,setShowPass]= useState(false)
  const [loading, setLoading] = useState(false)
  const [shake,   setShake]   = useState(false)

  const { login, loginError, setLoginError, isAuth } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/admin'

  useEffect(() => {
    if (isAuth) navigate(from, { replace: true })
  }, [isAuth])

  useEffect(() => {
    setLoginError('')
  }, [user, pass])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Pequeño delay para feedback visual
    await new Promise(r => setTimeout(r, 600))

    const ok = login(user, pass)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* Gold vertical lines */}
      <div className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.3), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.15), transparent)' }} />

      {/* Card */}
      <div
        className="relative w-full max-w-md animate-scale-up"
        style={{
          background: 'rgba(13,18,24,0.95)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,83,0.08)',
          ...(shake && { animation: 'shake 0.4s ease' }),
        }}
      >
        {/* Gold top shimmer */}
        <div className="h-px rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.6), transparent)' }} />

        <div className="px-10 py-12">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-block mb-4">
              <span className="font-display font-black text-4xl text-white">Libros</span>
              <span className="font-display font-black text-4xl text-gradient-gold">Med</span>
            </div>
            <div className="w-10 h-px mx-auto mb-4"
              style={{ background: 'linear-gradient(90deg, transparent, #d4a853, transparent)' }} />
            <p className="eyebrow text-[0.65rem]">Panel de Administración</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="field-label">Usuario</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">
                  👤
                </span>
                <input
                  type="text"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="input-field pl-10"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="field-label">Contraseña</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">
                  🔒
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="input-field pl-10 pr-12"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-sm"
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error */}
            {loginError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/25 text-red-400 text-sm font-sans animate-fade-in">
                <span className="text-base shrink-0">⚠️</span>
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !user || !pass}
              className="w-full py-4 rounded-xl font-semibold text-base font-sans transition-all duration-200 mt-2 flex items-center justify-center gap-3"
              style={{
                background: loading || !user || !pass
                  ? 'rgba(212,168,83,0.2)'
                  : 'linear-gradient(135deg, #d4a853, #e8c07a)',
                color: loading || !user || !pass ? 'rgba(212,168,83,0.4)' : '#080c10',
                cursor: loading || !user || !pass ? 'not-allowed' : 'pointer',
                boxShadow: loading || !user || !pass
                  ? 'none'
                  : '0 8px 24px rgba(212,168,83,0.3)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar al Panel
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Back to store */}
          <div className="mt-8 pt-6 border-t border-white/6 text-center">
            <a href="/" className="text-white/25 hover:text-white/50 text-xs font-sans transition-colors">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>

      {/* Shake keyframe */}
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