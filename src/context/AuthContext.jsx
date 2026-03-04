import React, { createContext, useContext, useState, useEffect } from 'react'

// ══════════════════════════════════════════════
//  CREDENCIALES DEL DUEÑO
//  Cambia estos valores antes de publicar
// ══════════════════════════════════════════════
const OWNER_USER = 'jhony'
const OWNER_PASS = 'jhony1234'
// ══════════════════════════════════════════════

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => {
    // Persiste la sesión en localStorage con expiración de 8 horas
    try {
      const saved = localStorage.getItem('lm_auth')
      if (!saved) return false
      const { token, exp } = JSON.parse(saved)
      if (Date.now() > exp) { localStorage.removeItem('lm_auth'); return false }
      return token === btoa(`${OWNER_USER}:${OWNER_PASS}`)
    } catch { return false }
  })

  const [loginError, setLoginError] = useState('')

  const login = (username, password) => {
    if (username.trim() === OWNER_USER && password === OWNER_PASS) {
      const token = btoa(`${OWNER_USER}:${OWNER_PASS}`)
      const exp   = Date.now() + 8 * 60 * 60 * 1000 // 8 horas
      localStorage.setItem('lm_auth', JSON.stringify({ token, exp }))
      setIsAuth(true)
      setLoginError('')
      return true
    }
    setLoginError('Usuario o contraseña incorrectos.')
    return false
  }

  const logout = () => {
    localStorage.removeItem('lm_auth')
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)