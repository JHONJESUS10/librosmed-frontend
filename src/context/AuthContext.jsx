import React, { createContext, useContext, useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuth,     setIsAuth]     = useState(false)
  const [adminData,  setAdminData]  = useState(null)   // { id, name, email, role }
  const [loginError, setLoginError] = useState('')

  // Restaurar sesión al cargar
  useEffect(() => {
    try {
      const token = localStorage.getItem('lm_admin_token')
      const data  = localStorage.getItem('lm_admin_data')
      if (token && data) {
        // Verificar que el token no haya expirado decodificando el payload
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setIsAuth(true)
          setAdminData(JSON.parse(data))
        } else {
          localStorage.removeItem('lm_admin_token')
          localStorage.removeItem('lm_admin_data')
        }
      }
    } catch {}
  }, [])

  // Login contra el backend
  const login = async (email, password) => {
    setLoginError('')
    try {
      const res  = await fetch(`${API}/admin/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || 'Credenciales incorrectas.')
        return false
      }

      localStorage.setItem('lm_admin_token', data.token)
      localStorage.setItem('lm_admin_data',  JSON.stringify(data.admin))
      setIsAuth(true)
      setAdminData(data.admin)
      return true
    } catch {
      setLoginError('Error de conexión con el servidor.')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('lm_admin_token')
    localStorage.removeItem('lm_admin_data')
    setIsAuth(false)
    setAdminData(null)
  }

  const getToken = () => localStorage.getItem('lm_admin_token')

  const isMainAdmin = () => adminData?.role === 'main'

  return (
    <AuthContext.Provider value={{
      isAuth, adminData, loginError, setLoginError,
      login, logout, getToken, isMainAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)