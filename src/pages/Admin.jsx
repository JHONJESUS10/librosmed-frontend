import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Admin() {
  const { logout, adminData, getToken, isMainAdmin } = useAuth()
  const navigate = useNavigate()
  const [tab,      setTab]      = useState('dashboard')
  const [cats,     setCats]     = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  const TABS = [
    { key: 'dashboard',  icon: '◈',  label: 'Dashboard'   },
    { key: 'products',   icon: '📚', label: 'Productos'   },
    { key: 'sales',      icon: '🛒', label: 'Ventas'      },
    { key: 'earnings',   icon: '💰', label: 'Ganancias'   },
    { key: 'users',      icon: '👥', label: 'Clientes'    },
    ...(isMainAdmin() ? [{ key: 'subadmins', icon: '🛡️', label: 'Sub Admins' }] : []),
    { key: 'settings',   icon: '⚙',  label: 'Ajustes'    },
  ]

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  })

  const loadData = useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/categories`).then(r => r.json()).catch(() => []),
      fetch(`${API}/products?limit=500`).then(r => r.json()).catch(() => []),
    ]).then(([c, p]) => { setCats(c||[]); setProducts(p||[]); setLoading(false) })
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div className="min-h-screen flex" style={{ background: '#060a0f' }}>

      {/* SIDEBAR */}
      <aside className="w-[240px] shrink-0 flex flex-col border-r border-white/5 sticky top-0 h-screen"
        style={{ background: '#080c10' }}>
        <div className="px-6 py-7 border-b border-white/5">
          <div className="font-display font-black text-2xl leading-none mb-1">
            <span className="text-white">Libros</span>
            <span className="text-gradient-gold">Med</span>
          </div>
          <p className="text-white/25 text-[0.62rem] uppercase tracking-widest font-sans mt-1.5">Panel de control</p>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all text-left"
              style={{
                background:  tab === t.key ? 'rgba(212,168,83,0.1)' : 'transparent',
                color:       tab === t.key ? '#d4a853' : 'rgba(255,255,255,0.35)',
                border:      tab === t.key ? '1px solid rgba(212,168,83,0.2)' : '1px solid transparent',
              }}>
              <span className="text-base w-5 text-center">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-5 border-t border-white/5 pt-4 space-y-1">
          {/* Info del admin */}
          <div className="px-4 py-3 mb-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-white/70 text-xs font-semibold font-sans truncate">{adminData?.name}</p>
            <p className="text-white/25 text-[0.6rem] font-sans mt-0.5">
              {adminData?.role === 'main' ? '👑 Admin Principal' : '🛡️ SubAdmin'}
            </p>
          </div>
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/25 hover:text-white/50 font-sans transition-colors">
            <span>🏠</span> Ver tienda
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-400/50 hover:text-red-400 hover:bg-red-900/15 font-sans transition-all">
            <span>⎋</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-10"
          style={{ background: '#080c10' }}>
          <div>
            <h1 className="font-display font-bold text-white text-xl">{TABS.find(t => t.key === tab)?.label}</h1>
            <p className="text-white/25 text-xs font-sans mt-0.5">
              {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/4 border border-white/8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/50 text-xs font-sans">
              {adminData?.role === 'main' ? 'Admin Principal' : 'SubAdmin'} conectado
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {loading ? <LoadingState /> : (
            <>
              {tab === 'dashboard'  && <DashboardTab products={products} cats={cats} />}
              {tab === 'products'   && <ProductsTab  products={products} cats={cats} onRefresh={loadData} getToken={getToken} authHeaders={authHeaders} />}
              {tab === 'sales'      && <SalesTab     authHeaders={authHeaders} />}
              {tab === 'earnings'   && <EarningsTab  authHeaders={authHeaders} />}
              {tab === 'users'      && <UsersTab     authHeaders={authHeaders} />}
              {tab === 'subadmins'  && isMainAdmin() && <SubAdminsTab authHeaders={authHeaders} getToken={getToken} />}
              {tab === 'settings'   && <SettingsTab />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   LOADING
════════════════════════════════════════════════════ */
function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="space-y-3 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin mx-auto" />
        <p className="text-white/20 text-xs font-sans">Cargando datos...</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   DASHBOARD TAB
════════════════════════════════════════════════════ */
function DashboardTab({ products, cats }) {
  const totalStock = products.reduce((a, p) => a + parseInt(p.stock || 0), 0)
  const totalValue = products.reduce((a, p) => a + parseFloat(p.price || 0) * parseInt(p.stock || 0), 0)
  const avgPrice   = products.length ? products.reduce((a, p) => a + parseFloat(p.price || 0), 0) / products.length : 0
  const featured   = products.filter(p => p.is_featured).length

  const stats = [
    { icon: '📚', value: products.length, label: 'Total Títulos',    sub: `${cats.length} especialidades`, color: '#f59e0b' },
    { icon: '💰', value: `S/. ${totalValue.toFixed(0)}`, label: 'Valor Inventario', sub: 'precio × stock',     color: '#10b981' },
    { icon: '📊', value: `S/. ${avgPrice.toFixed(2)}`,   label: 'Precio Promedio',  sub: 'por libro',          color: '#3b82f6' },
    { icon: '⭐', value: featured, label: 'Destacados', sub: `de ${products.length} libros`, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 border border-white/6 relative overflow-hidden"
            style={{ background: '#0d1218' }}>
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: s.color }} />
            <div className="text-2xl mb-3">{s.icon}</div>
            <p className="font-display font-black text-white text-2xl">{s.value}</p>
            <p className="text-white/50 text-xs font-sans mt-1">{s.label}</p>
            <p className="text-white/20 text-[0.6rem] font-sans">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <p className="text-white/30 text-[0.6rem] uppercase tracking-widest font-sans mb-1">DISTRIBUCIÓN</p>
            <h3 className="font-display font-bold text-white text-lg">Libros por Especialidad</h3>
          </div>
          <div className="p-6 space-y-4">
            {cats.map(c => {
              const count = products.filter(p => p.category_id === c.id).length
              const avg   = count ? products.filter(p => p.category_id === c.id).reduce((a, p) => a + parseFloat(p.price || 0), 0) / count : 0
              return (
                <div key={c.id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/70 text-sm font-sans">{c.icon} {c.name}</span>
                    <span className="text-white/30 text-xs font-sans">{count} libros</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${products.length ? (count / products.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #d4a853, #e8c07a)' }} />
                  </div>
                  <p className="text-white/20 text-[0.6rem] font-sans mt-1">Precio promedio: S/. {avg.toFixed(2)}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/6 p-5" style={{ background: '#0d1218' }}>
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Stock Bajo
              <span className="ml-auto text-xs font-sans px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                {products.filter(p => parseInt(p.stock) < 4).length}
              </span>
            </h3>
            {products.filter(p => parseInt(p.stock) < 4).length === 0
              ? <p className="text-emerald-400/60 text-xs font-sans">✓ Inventario en buen estado</p>
              : products.filter(p => parseInt(p.stock) < 4).map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-white/60 text-xs font-sans truncate max-w-[140px]">{p.title}</span>
                    <span className="text-red-400 text-xs font-bold font-sans">{p.stock}</span>
                  </div>
                ))
            }
          </div>

          <div className="rounded-2xl border border-white/6 p-5" style={{ background: '#0d1218' }}>
            <h3 className="font-display font-bold text-white mb-4">💰 Rangos de Precio</h3>
            {(() => {
              const prices = products.map(p => parseFloat(p.price))
              const ranges = [
                { label: 'S/. 0–50',   count: prices.filter(p => p <= 50).length,             color: '#10b981' },
                { label: 'S/. 51–100', count: prices.filter(p => p > 50 && p <= 100).length,  color: '#3b82f6' },
                { label: 'S/.101–150', count: prices.filter(p => p > 100 && p <= 150).length, color: '#f59e0b' },
                { label: 'S/. 150+',   count: prices.filter(p => p > 150).length,             color: '#ef4444' },
              ]
              return (
                <div className="space-y-3">
                  {ranges.map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                      <span className="text-white/40 text-xs font-sans flex-1">{r.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${products.length ? (r.count / products.length) * 100 : 0}%`, background: r.color }} />
                        </div>
                        <span className="text-white/50 text-xs font-sans w-4 text-right">{r.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-display font-bold text-white text-lg">Últimos Productos</h3>
          <span className="text-white/20 text-xs font-sans">{products.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">
              {['Libro', 'Categoría', 'Precio Venta', 'Precio Compra', 'Stock'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[0.62rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/4">
              {products.slice(0, 8).map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60'} alt=""
                        className="w-8 h-10 object-cover rounded-lg border border-white/8 shrink-0"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60' }} />
                      <div>
                        <p className="text-white font-semibold text-sm font-sans truncate max-w-[180px]">{p.title}</p>
                        <p className="text-white/25 text-[0.62rem] italic font-sans">{p.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/35 text-xs font-sans">{p.category_name}</td>
                  <td className="px-5 py-3.5 font-display font-bold text-white text-sm">S/. {parseFloat(p.price).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-white/40 text-sm font-sans">S/. {parseFloat(p.purchase_price || 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold font-sans ${parseInt(p.stock) < 4 ? 'text-red-400' : 'text-emerald-400/80'}`}>{p.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   SALES TAB
════════════════════════════════════════════════════ */
function SalesTab({ authHeaders }) {
  const [sales,   setSales]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  const loadSales = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? `${API}/sales` : `${API}/sales?status=${filter}`
      const res  = await fetch(url, { headers: authHeaders() })
      const data = await res.json()
      setSales(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadSales() }, [filter])

  const updateStatus = async (id, status) => {
    await fetch(`${API}/sales/${id}/status`, {
      method:  'PATCH',
      headers: authHeaders(),
      body:    JSON.stringify({ status }),
    })
    loadSales()
  }

  const statusColor = {
    pendiente:  { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b'  },
    confirmado: { bg: 'rgba(59,130,246,0.15)',   text: '#60a5fa'  },
    entregado:  { bg: 'rgba(16,185,129,0.15)',   text: '#34d399'  },
    cancelado:  { bg: 'rgba(239,68,68,0.15)',    text: '#f87171'  },
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex gap-2 flex-wrap">
        {['all', 'pendiente', 'confirmado', 'entregado', 'cancelado'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all border capitalize"
            style={{
              background:   filter === s ? 'rgba(212,168,83,0.1)' : 'transparent',
              color:        filter === s ? '#d4a853' : 'rgba(255,255,255,0.35)',
              borderColor:  filter === s ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.07)',
            }}>
            {s === 'all' ? '📋 Todas' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <LoadingState /> : (
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
          {sales.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl text-white/30 mb-1">Sin ventas aún</p>
              <p className="text-white/20 text-xs font-sans">Las ventas aparecerán aquí cuando los clientes hagan pedidos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead><tr className="border-b border-white/5">
                  {['#', 'Cliente', 'Total', 'Ganancia', 'Estado', 'Fecha', 'Acción'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[0.6rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/4">
                  {sales.map(s => {
                    const profit = parseFloat(s.total_sale) - parseFloat(s.total_cost || 0) - parseFloat(s.shipping || 0)
                    const sc     = statusColor[s.status] || statusColor.pendiente
                    return (
                      <tr key={s.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-white/30 text-xs font-sans">#{s.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-white text-sm font-semibold font-sans">{s.customer_name}</p>
                          <p className="text-white/30 text-xs font-sans">{s.customer_email || s.user_name || '—'}</p>
                        </td>
                        <td className="px-4 py-3 font-display font-bold text-white text-sm">S/. {parseFloat(s.total_sale).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-sm font-sans ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            S/. {profit.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-sans capitalize"
                            style={{ background: sc.bg, color: sc.text }}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/30 text-xs font-sans">
                          {new Date(s.created_at).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-4 py-3">
                          <select value={s.status}
                            onChange={e => updateStatus(s.id, e.target.value)}
                            className="text-xs font-sans rounded-lg px-2 py-1.5 border border-white/10 bg-white/5 text-white/60 cursor-pointer outline-none">
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════
   EARNINGS TAB
════════════════════════════════════════════════════ */
function EarningsTab({ authHeaders }) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState('month')

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/sales/reports/earnings?period=${period}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [period])

  if (loading) return <LoadingState />
  if (!data || !data.totals) return <p className="text-white/30 text-sm font-sans">No se pudo cargar el reporte.</p>

  const { totals = {}, byCategory = [], byDay = [] } = data
  const safeTotal = {
    total_sales:   totals.total_sales   || 0,
    gross_revenue: totals.gross_revenue || 0,
    total_cost:    totals.total_cost    || 0,
    net_profit:    totals.net_profit    || 0,
  }
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Filtro de período */}
      <div className="flex gap-2">
        {[
          { k: 'today', l: 'Hoy'        },
          { k: 'week',  l: '7 días'     },
          { k: 'month', l: '30 días'    },
          { k: 'all',   l: 'Todo'       },
        ].map(p => (
          <button key={p.k} onClick={() => setPeriod(p.k)}
            className="px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all border"
            style={{
              background:  period === p.k ? 'rgba(212,168,83,0.1)' : 'transparent',
              color:       period === p.k ? '#d4a853' : 'rgba(255,255,255,0.35)',
              borderColor: period === p.k ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.07)',
            }}>
            {p.l}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ventas Totales',    value: totals.total_sales,                                       icon: '🛒', color: '#3b82f6' },
          { label: 'Ingresos Brutos',   value: `S/. ${parseFloat(totals.gross_revenue).toFixed(2)}`,     icon: '💵', color: '#f59e0b' },
          { label: 'Costo Total',       value: `S/. ${parseFloat(totals.total_cost).toFixed(2)}`,        icon: '📦', color: '#ef4444' },
          { label: 'Ganancia Neta',     value: `S/. ${parseFloat(totals.net_profit).toFixed(2)}`,        icon: '💰', color: '#10b981' },
        ].map((k, i) => (
          <div key={i} className="rounded-2xl p-5 border border-white/6 relative overflow-hidden"
            style={{ background: '#0d1218' }}>
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: k.color }} />
            <div className="text-2xl mb-3">{k.icon}</div>
            <p className="font-display font-black text-white text-2xl">{k.value}</p>
            <p className="text-white/40 text-xs font-sans mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Por categoría */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="font-display font-bold text-white">Ganancias por Especialidad</h3>
        </div>
        {byCategory.length === 0 ? (
          <p className="text-white/25 text-sm font-sans p-6">Sin datos para este período.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Especialidad', 'Ventas', 'Ingresos', 'Costo', 'Ganancia Neta'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[0.6rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-white/4">
                {byCategory.map((c, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-white font-semibold text-sm font-sans">{c.category}</td>
                    <td className="px-5 py-3.5 text-white/50 text-sm font-sans">{c.sales_count}</td>
                    <td className="px-5 py-3.5 text-white text-sm font-sans">S/. {parseFloat(c.revenue).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-red-400/70 text-sm font-sans">S/. {parseFloat(c.cost).toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-sm font-sans text-emerald-400">S/. {parseFloat(c.profit).toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Por día */}
      {byDay.length > 0 && (
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="font-display font-bold text-white">Ventas por Día (últimos 30 días)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Fecha', 'Pedidos', 'Ingresos', 'Ganancia'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[0.6rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-white/4">
                {byDay.map((d, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 text-white/70 text-sm font-sans">{new Date(d.day).toLocaleDateString('es-PE')}</td>
                    <td className="px-5 py-3 text-white/50 text-sm font-sans">{d.sales_count}</td>
                    <td className="px-5 py-3 text-white text-sm font-sans">S/. {parseFloat(d.revenue).toFixed(2)}</td>
                    <td className="px-5 py-3 text-emerald-400 font-bold text-sm font-sans">S/. {parseFloat(d.profit).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════
   USERS TAB — Clientes registrados
════════════════════════════════════════════════════ */
function UsersTab({ authHeaders }) {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    fetch(`${API}/admin/auth/users`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingState />

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente..." className="input-field max-w-xs py-2.5 text-sm" />
        <span className="text-white/30 text-xs font-sans">{users.length} clientes registrados</span>
      </div>

      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-xl text-white/30 mb-1">Sin clientes aún</p>
            <p className="text-white/20 text-xs font-sans">Los clientes aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['#', 'Nombre', 'Correo', 'Teléfono', 'Registro'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[0.6rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-white/25 text-xs font-sans">#{u.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                          style={{ background: 'rgba(212,168,83,0.15)', color: '#d4a853' }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold text-sm font-sans">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/50 text-sm font-sans">{u.email}</td>
                    <td className="px-5 py-3.5 text-white/40 text-sm font-sans">{u.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-white/30 text-xs font-sans">
                      {new Date(u.created_at).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   SUBADMINS TAB — Solo main admin
════════════════════════════════════════════════════ */
function SubAdminsTab({ authHeaders, getToken }) {
  const [subadmins, setSubadmins] = useState([])
  const [codes,     setCodes]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [genLoading,setGenLoading]= useState(false)
  const [hours,     setHours]     = useState('24')
  const [msg,       setMsg]       = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [sa, co] = await Promise.all([
        fetch(`${API}/admin/auth/subadmins`, { headers: authHeaders() }).then(r => r.json()),
        fetch(`${API}/admin/auth/invite`,    { headers: authHeaders() }).then(r => r.json()),
      ])
      setSubadmins(Array.isArray(sa) ? sa : [])
      setCodes(Array.isArray(co) ? co : [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const generateCode = async () => {
    setGenLoading(true)
    try {
      const res  = await fetch(`${API}/admin/auth/invite`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ expires_hours: parseInt(hours) }),
      })
      const data = await res.json()
      setMsg(`✓ Código generado: ${data.code?.code}`)
      load()
    } catch { setMsg('Error al generar código.') }
    setTimeout(() => setMsg(''), 5000)
    setGenLoading(false)
  }

  const toggleActive = async (id, current) => {
    await fetch(`${API}/admin/auth/subadmins/${id}`, {
      method:  'PATCH',
      headers: authHeaders(),
      body:    JSON.stringify({ is_active: !current }),
    })
    load()
  }

  const deleteCode = async (id) => {
    await fetch(`${API}/admin/auth/invite/${id}`, { method: 'DELETE', headers: authHeaders() })
    load()
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Generar código */}
      <div className="rounded-2xl border border-white/6 p-6" style={{ background: '#0d1218' }}>
        <h3 className="font-display font-bold text-white text-lg mb-4">🔑 Generar Código de Invitación</h3>
        {msg && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-sans"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
            {msg}
          </div>
        )}
        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="field-label">Expira en (horas)</label>
            <select value={hours} onChange={e => setHours(e.target.value)}
              className="input-field py-2.5 text-sm w-36 cursor-pointer">
              <option value="12">12 horas</option>
              <option value="24">24 horas</option>
              <option value="48">48 horas</option>
              <option value="168">7 días</option>
            </select>
          </div>
          <button onClick={generateCode} disabled={genLoading}
            className="px-6 py-3 rounded-xl font-bold text-sm font-sans transition-all"
            style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)', color: '#0a0f16' }}>
            {genLoading ? 'Generando...' : '+ Generar código'}
          </button>
        </div>
      </div>

      {/* Códigos activos */}
      {codes.filter(c => !c.is_used).length > 0 && (
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="font-display font-bold text-white">Códigos Pendientes</h3>
          </div>
          <div className="divide-y divide-white/4">
            {codes.filter(c => !c.is_used).map(c => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-mono font-bold text-sm">{c.code}</p>
                  <p className="text-white/30 text-xs font-sans mt-0.5">
                    Expira: {c.expires_at ? new Date(c.expires_at).toLocaleString('es-PE') : 'Sin expiración'}
                  </p>
                </div>
                <button onClick={() => deleteCode(c.id)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-red-900/25 border border-red-500/20 text-red-400 hover:bg-red-900/40 transition-colors font-sans">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de subadmins */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0d1218' }}>
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-display font-bold text-white">Sub Administradores</h3>
          <span className="text-white/30 text-xs font-sans">{subadmins.length} registrados</span>
        </div>
        {subadmins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/30 text-sm font-sans">Aún no hay subadmins registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Nombre', 'Correo', 'Estado', 'Registro', 'Acción'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[0.6rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-white/4">
                {subadmins.map(s => (
                  <tr key={s.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold text-sm font-sans">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/50 text-sm font-sans">{s.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-sans"
                        style={{
                          background: s.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color:      s.is_active ? '#34d399' : '#f87171',
                        }}>
                        {s.is_active ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/30 text-xs font-sans">
                      {new Date(s.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleActive(s.id, s.is_active)}
                        className="px-3 py-1.5 text-xs rounded-lg font-semibold font-sans transition-all border"
                        style={{
                          background:  s.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          color:       s.is_active ? '#f87171' : '#34d399',
                          borderColor: s.is_active ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                        }}>
                        {s.is_active ? 'Suspender' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   PRODUCTS TAB
════════════════════════════════════════════════════ */
function ProductsTab({ products, cats, onRefresh, authHeaders }) {
  const empty = { title:'',author:'',price:'',purchase_price:'',category_id:'',description:'',edition:'',pages:'',isbn:'',language:'Español',rating:'4.5',stock:'10',is_featured:false,cover_url:'' }
  const [view,          setView]          = useState('list')
  const [form,          setForm]          = useState(empty)
  const [editId,        setEditId]        = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [msg,           setMsg]           = useState({ type:'', text:'' })
  const [search,        setSearch]        = useState('')
  const [catFilter,     setCatFilter]     = useState('all')
  const [imgTab,        setImgTab]        = useState('url')
  const [filePreview,   setFilePreview]   = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const fileRef = React.useRef(null)

  const flash = (type, text) => { setMsg({type,text}); setTimeout(()=>setMsg({type:'',text:''}),4000) }
  const handleChange = e => {
    const {name,value,type,checked} = e.target
    setForm(p => ({...p,[name]:type==='checkbox'?checked:value}))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { flash('error','La imagen no debe superar 5 MB.'); return }
    setUploadLoading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(`${API}/upload`, { method:'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm(p => ({...p, cover_url: data.url}))
        setFilePreview(data.url)
        flash('success','✓ Imagen subida.')
      } else throw new Error()
    } catch {
      const reader = new FileReader()
      reader.onload = ev => { setForm(p => ({...p, cover_url: ev.target.result})); setFilePreview(ev.target.result) }
      reader.readAsDataURL(file)
    }
    setUploadLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title||!form.author||!form.price||!form.category_id) { flash('error','Título, autor, precio y categoría son obligatorios.'); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        price:          parseFloat(form.price),
        purchase_price: parseFloat(form.purchase_price || 0),
        pages:          form.pages ? parseInt(form.pages) : null,
        stock:          parseInt(form.stock)||10,
        rating:         parseFloat(form.rating)||4.5,
        category_id:    parseInt(form.category_id),
      }
      const res = await fetch(
        editId ? `${API}/products/${editId}` : `${API}/products`,
        { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }
      )
      if (!res.ok) throw new Error()
      flash('success', editId ? '✓ Actualizado.' : '✓ Libro agregado al catálogo.')
      setForm(empty); setEditId(null); setView('list'); setFilePreview(null); onRefresh()
    } catch { flash('error','✕ Error al guardar.') }
    setLoading(false)
  }

  const handleEdit = p => {
    setForm({
      title: p.title||'', author: p.author||'', price: p.price||'',
      purchase_price: p.purchase_price||'',
      category_id: p.category_id||'', description: p.description||'',
      edition: p.edition||'', pages: p.pages||'', isbn: p.isbn||'',
      language: p.language||'Español', rating: p.rating||'4.5',
      stock: p.stock||'10', is_featured: p.is_featured||false, cover_url: p.cover_url||''
    })
    setFilePreview(p.cover_url||null)
    setEditId(p.id); setView('form'); window.scrollTo({top:0,behavior:'smooth'})
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return
    try { await fetch(`${API}/products/${id}`,{method:'DELETE'}); flash('success','✓ Eliminado.'); onRefresh() }
    catch { flash('error','✕ No se pudo eliminar.') }
  }

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (!q || p.title?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q)) &&
           (catFilter === 'all' || p.category_id?.toString() === catFilter)
  })

  return (
    <div className="space-y-5 animate-fade-up">
      {msg.text && (
        <div className={`px-5 py-3.5 rounded-xl text-sm font-semibold font-sans border ${msg.type==='success'?'bg-emerald-900/25 border-emerald-500/20 text-emerald-400':'bg-red-900/25 border-red-500/20 text-red-400'}`}>
          {msg.text}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {[{key:'list',label:`📋 Lista (${products.length})`},{key:'form',label:editId?'✏ Editar':'+ Nuevo Libro'}].map(v => (
          <button key={v.key} onClick={()=>setView(v.key)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold font-sans transition-all border"
            style={{background:view===v.key?'rgba(212,168,83,0.1)':'transparent',color:view===v.key?'#d4a853':'rgba(255,255,255,0.35)',borderColor:view===v.key?'rgba(212,168,83,0.25)':'rgba(255,255,255,0.07)'}}>
            {v.label}
          </button>
        ))}
        {editId && (
          <button onClick={()=>{setForm(empty);setEditId(null);setView('form')}}
            className="px-4 py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 border border-red-500/15 hover:border-red-500/30 transition-all font-sans">
            Cancelar edición
          </button>
        )}
      </div>

      {view==='list' && (
        <>
          <div className="flex flex-wrap gap-3">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar título o autor..." className="input-field max-w-xs py-2.5 text-sm" />
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} className="input-field py-2.5 text-sm w-auto cursor-pointer">
              <option value="all">Todas las especialidades</option>
              {cats.map(c=><option key={c.id} value={c.id.toString()}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background:'#0d1218' }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead><tr className="border-b border-white/5">
                  {['','Libro','Especialidad','P. Venta','P. Compra','Stock',''].map((h,i)=>(
                    <th key={i} className="px-4 py-3 text-left text-[0.6rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/4">
                  {filtered.map(p => (
                    <tr key={p.id} className="group hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <img src={p.cover_url||'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60'} alt=""
                          className="w-9 h-12 object-cover rounded-lg border border-white/8"
                          onError={e=>{e.target.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60'}} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold text-sm font-sans truncate max-w-[200px]">{p.title}</p>
                        <p className="text-white/30 text-xs italic font-sans">{p.author}</p>
                        {p.is_featured && <span className="text-[0.55rem] text-yellow-500 font-bold font-sans">⭐ DEST</span>}
                      </td>
                      <td className="px-4 py-3 text-white/35 text-xs font-sans">{p.category_name}</td>
                      <td className="px-4 py-3 font-display font-bold text-white text-sm">S/. {parseFloat(p.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-white/40 text-sm font-sans">S/. {parseFloat(p.purchase_price||0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold font-sans ${parseInt(p.stock)<4?'text-red-400':'text-emerald-400/70'}`}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={()=>handleEdit(p)} className="px-3 py-1.5 text-xs font-semibold font-sans bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/12 transition-colors">Editar</button>
                          <button onClick={()=>handleDelete(p.id,p.title)} className="px-3 py-1.5 text-xs font-semibold font-sans bg-red-900/25 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-display text-xl text-white/30 mb-1">Sin resultados</p>
              </div>
            )}
          </div>
        </>
      )}

      {view==='form' && (
        <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background:'#0d1218' }}>
          <div className="px-7 py-5 border-b border-white/5">
            <h2 className="font-display font-bold text-white text-xl">{editId?`Editando #${editId}`:'Nuevo libro'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="field-label">Título *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Fundamentos de Enfermería" className="input-field" />
              </div>
              <div>
                <label className="field-label">Autor *</label>
                <input name="author" value={form.author} onChange={handleChange} placeholder="Patricia Potter" className="input-field" />
              </div>
              <div>
                <label className="field-label">Especialidad *</label>
                <select name="category_id" value={form.category_id} onChange={handleChange} className="input-field cursor-pointer">
                  <option value="">— Seleccionar —</option>
                  {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              {/* PRECIOS */}
              <div>
                <label className="field-label">
                  Precio de Venta (S/.) *
                  <span className="ml-1 text-white/20 normal-case font-normal">— lo que paga el cliente</span>
                </label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="89.90" className="input-field" />
              </div>
              <div>
                <label className="field-label">
                  Precio de Compra (S/.)
                  <span className="ml-1 text-white/20 normal-case font-normal">— lo que te cuesta</span>
                </label>
                <input name="purchase_price" type="number" step="0.01" value={form.purchase_price} onChange={handleChange} placeholder="45.00" className="input-field" />
                {form.price && form.purchase_price && (
                  <p className="text-emerald-400/70 text-xs font-sans mt-1.5">
                    Ganancia por unidad: S/. {(parseFloat(form.price||0) - parseFloat(form.purchase_price||0)).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="field-label">Edición</label>
                <input name="edition" value={form.edition} onChange={handleChange} placeholder="9a edición" className="input-field" />
              </div>
              <div>
                <label className="field-label">Páginas</label>
                <input name="pages" type="number" value={form.pages} onChange={handleChange} placeholder="850" className="input-field" />
              </div>
              <div>
                <label className="field-label">ISBN</label>
                <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="978-84-..." className="input-field" />
              </div>
              <div>
                <label className="field-label">Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="field-label">Valoración (1–5)</label>
                <input name="rating" type="number" step="0.1" min="1" max="5" value={form.rating} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="featured" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 accent-yellow-500 cursor-pointer" />
                <label htmlFor="featured" className="text-white/50 text-sm font-sans cursor-pointer">⭐ Destacar en inicio</label>
              </div>

              <div className="md:col-span-2">
                <label className="field-label">Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Descripción del libro..." className="input-field resize-none" />
              </div>

              {/* Imagen */}
              <div className="md:col-span-2">
                <label className="field-label">Portada</label>
                <div className="flex gap-2 mb-3">
                  {['url','file'].map(t => (
                    <button key={t} type="button" onClick={()=>setImgTab(t)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all border"
                      style={{background:imgTab===t?'rgba(212,168,83,0.1)':'transparent',color:imgTab===t?'#d4a853':'rgba(255,255,255,0.3)',borderColor:imgTab===t?'rgba(212,168,83,0.2)':'rgba(255,255,255,0.07)'}}>
                      {t === 'url' ? '🔗 URL' : '📁 Archivo'}
                    </button>
                  ))}
                </div>
                {imgTab==='url'
                  ? <input name="cover_url" value={form.cover_url} onChange={handleChange} placeholder="https://..." className="input-field" />
                  : (
                    <div>
                      <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                      <button type="button" onClick={()=>fileRef.current?.click()}
                        className="px-5 py-3 rounded-xl text-sm font-sans border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all">
                        {uploadLoading ? 'Subiendo...' : '📁 Seleccionar imagen'}
                      </button>
                    </div>
                  )
                }
                {(filePreview || form.cover_url) && (
                  <img src={filePreview||form.cover_url} alt="Preview"
                    className="mt-3 w-20 h-28 object-cover rounded-xl border border-white/10"
                    onError={e=>{e.target.style.display='none'}} />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button type="submit" disabled={loading}
                className="px-8 py-3.5 rounded-xl font-bold text-sm font-sans transition-all"
                style={{background:'linear-gradient(135deg,#d4a853,#b8922e)',color:'#0a0f16',opacity:loading?0.6:1}}>
                {loading ? 'Guardando...' : editId ? '✓ Guardar cambios' : '+ Agregar libro'}
              </button>
              <button type="button" onClick={()=>{setForm(empty);setEditId(null);setView('list');setFilePreview(null)}}
                className="px-6 py-3.5 rounded-xl text-sm font-sans border border-white/10 text-white/40 hover:text-white/70 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════
   SETTINGS TAB
════════════════════════════════════════════════════ */
function SettingsTab() {
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="rounded-2xl border border-white/6 p-8" style={{ background:'#0d1218' }}>
        <h3 className="font-display font-bold text-white text-xl mb-2">Ajustes del Sistema</h3>
        <p className="text-white/30 text-sm font-sans">Próximamente: configuración de WhatsApp, número de contacto, colores del tema y más.</p>
      </div>
    </div>
  )
}