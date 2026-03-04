import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TABS = [
  { key: 'dashboard', icon: '◈', label: 'Dashboard'  },
  { key: 'products',  icon: '📚', label: 'Productos'  },
  { key: 'settings',  icon: '⚙',  label: 'Ajustes'    },
]

export default function Admin() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [tab,      setTab]      = useState('dashboard')
  const [cats,     setCats]     = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

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
    <div className="min-h-screen flex" style={{ background:'#060a0f' }}>

      {/* SIDEBAR */}
      <aside className="w-[240px] shrink-0 flex flex-col border-r border-white/5 sticky top-0 h-screen"
        style={{ background:'#080c10' }}>
        <div className="px-6 py-7 border-b border-white/5">
          <div className="font-display font-black text-2xl leading-none mb-1">
            <span className="text-white">Libros</span>
            <span className="text-gradient-gold">Med</span>
          </div>
          <p className="text-white/25 text-[0.62rem] uppercase tracking-widest font-sans mt-1.5">Panel de control</p>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
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
          style={{ background:'#080c10' }}>
          <div>
            <h1 className="font-display font-bold text-white text-xl">{TABS.find(t=>t.key===tab)?.label}</h1>
            <p className="text-white/25 text-xs font-sans mt-0.5">
              {new Date().toLocaleDateString('es-PE',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/4 border border-white/8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/50 text-xs font-sans">Dueño conectado</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {loading ? <LoadingState /> : (
            <>
              {tab === 'dashboard' && <DashboardTab products={products} cats={cats} />}
              {tab === 'products'  && <ProductsTab  products={products} cats={cats} onRefresh={loadData} />}
              {tab === 'settings'  && <SettingsTab />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

/* ── DASHBOARD ── */
function DashboardTab({ products, cats }) {
  const totalValue = products.reduce((s,p) => s + parseFloat(p.price)*parseInt(p.stock||0), 0)
  const avgPrice   = products.length ? products.reduce((s,p) => s+parseFloat(p.price),0)/products.length : 0
  const featured   = products.filter(p => p.is_featured).length
  const lowStock   = products.filter(p => parseInt(p.stock) < 4)
  const topCat     = cats.map(c => ({
    ...c,
    count: products.filter(p => p.category_id===c.id).length,
    avg:   products.filter(p => p.category_id===c.id).reduce((s,p)=>s+parseFloat(p.price),0) /
           (products.filter(p => p.category_id===c.id).length||1),
  })).sort((a,b) => b.count-a.count)
  const maxCount = topCat[0]?.count || 1
  const colors   = ['#d4a853','#3b82f6','#8b5cf6','#f97316','#ef4444','#10b981']

  return (
    <div className="space-y-8 animate-fade-up">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Títulos',      value: products.length, sub:`${cats.length} especialidades`, icon:'📚', color:'#d4a853' },
          { label:'Valor Inventario',   value:`S/. ${totalValue.toLocaleString('es-PE',{maximumFractionDigits:0})}`, sub:'precio × stock', icon:'💰', color:'#10b981' },
          { label:'Precio Promedio',    value:`S/. ${avgPrice.toFixed(2)}`, sub:'por libro', icon:'📊', color:'#3b82f6' },
          { label:'Destacados',         value: featured, sub:`de ${products.length} libros`, icon:'⭐', color:'#f59e0b' },
        ].map((k,i) => (
          <div key={k.label} className="rounded-2xl p-5 border border-white/6 animate-fade-up"
            style={{ background:'#0d1218', animationDelay:`${i*80}ms` }}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{k.icon}</span>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:k.color }} />
            </div>
            <div className="font-display font-black text-white leading-none mb-1"
              style={{ fontSize:'clamp(1.4rem,3vw,2rem)' }}>{k.value}</div>
            <p className="text-white/60 text-xs font-semibold font-sans">{k.label}</p>
            <p className="text-white/25 text-[0.62rem] font-sans mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* Bar chart */}
        <div className="rounded-2xl border border-white/6 p-6" style={{ background:'#0d1218' }}>
          <p className="eyebrow text-[0.62rem] mb-1">Distribución</p>
          <h3 className="font-display font-bold text-white text-lg mb-6">Libros por Especialidad</h3>
          <div className="space-y-5">
            {topCat.map((cat,i) => {
              const pct = Math.round((cat.count/maxCount)*100)
              return (
                <div key={cat.id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/60 text-xs font-sans flex items-center gap-2 truncate max-w-[65%]">
                      <span>{cat.icon}</span> {cat.name}
                    </span>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-white font-semibold text-sm font-sans">{cat.count}</span>
                      <span className="text-white/25 text-xs font-sans ml-1">libros</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pct}%`, background:`linear-gradient(90deg,${colors[i%colors.length]},${colors[i%colors.length]}77)` }} />
                  </div>
                  <p className="text-white/20 text-[0.6rem] font-sans mt-1">
                    Precio promedio: S/. {cat.avg.toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/6 p-5" style={{ background:'#0d1218' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-white">⚡ Stock Bajo</h3>
              <span className="badge-gold text-[0.58rem]">{lowStock.length}</span>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-emerald-400/60 text-xs font-sans text-center py-3">✓ Inventario en buen estado</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                {lowStock.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-red-900/15 border border-red-500/12">
                    <p className="text-white/70 text-xs font-sans truncate max-w-[140px]">{p.title}</p>
                    <span className="text-red-400 font-bold text-sm font-sans shrink-0 ml-2">{p.stock}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/6 p-5" style={{ background:'#0d1218' }}>
            <h3 className="font-display font-bold text-white mb-4">💰 Rangos de Precio</h3>
            {(() => {
              const prices = products.map(p => parseFloat(p.price))
              const ranges = [
                { label:'S/. 0–50',   count:prices.filter(p=>p<=50).length,             color:'#10b981' },
                { label:'S/. 51–100', count:prices.filter(p=>p>50&&p<=100).length,       color:'#3b82f6' },
                { label:'S/.101–150', count:prices.filter(p=>p>100&&p<=150).length,      color:'#f59e0b' },
                { label:'S/. 150+',   count:prices.filter(p=>p>150).length,              color:'#ef4444' },
              ]
              return (
                <div className="space-y-3">
                  {prices.length > 0 && (
                    <div className="flex justify-between text-xs font-sans text-white/25 mb-2">
                      <span>Mín: S/. {Math.min(...prices).toFixed(2)}</span>
                      <span>Máx: S/. {Math.max(...prices).toFixed(2)}</span>
                    </div>
                  )}
                  {ranges.map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background:r.color }} />
                      <span className="text-white/40 text-xs font-sans flex-1">{r.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width:`${products.length?(r.count/products.length)*100:0}%`, background:r.color }} />
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

      {/* Recent products */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background:'#0d1218' }}>
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-display font-bold text-white text-lg">Últimos Productos</h3>
          <span className="text-white/20 text-xs font-sans">{products.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Libro','Categoría','Precio','Stock','Rating'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[0.62rem] font-semibold text-white/25 uppercase tracking-widest font-sans">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {products.slice(0,8).map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.cover_url||'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60'} alt=""
                        className="w-8 h-10 object-cover rounded-lg border border-white/8 shrink-0"
                        onError={e=>{e.target.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60'}} />
                      <div>
                        <p className="text-white font-semibold text-sm font-sans truncate max-w-[200px]">{p.title}</p>
                        <p className="text-white/25 text-[0.62rem] italic font-sans">{p.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/35 text-xs font-sans">{p.category_name}</td>
                  <td className="px-5 py-3.5 font-display font-bold text-white text-sm">S/. {parseFloat(p.price).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold font-sans ${parseInt(p.stock)<4?'text-red-400':'text-emerald-400/80'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(parseFloat(p.rating)||4))}</span>
                    <span className="text-white/20 text-xs font-sans ml-1">{p.rating}</span>
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

/* ── PRODUCTS TAB ── */
function ProductsTab({ products, cats, onRefresh }) {
  const empty = { title:'',author:'',price:'',category_id:'',description:'',edition:'',pages:'',isbn:'',language:'Español',rating:'4.5',stock:'10',is_featured:false,cover_url:'' }
  const [view,       setView]      = useState('list')
  const [form,       setForm]      = useState(empty)
  const [editId,     setEditId]    = useState(null)
  const [loading,    setLoading]   = useState(false)
  const [msg,        setMsg]       = useState({ type:'', text:'' })
  const [search,     setSearch]    = useState('')
  const [catFilter,  setCatFilter] = useState('all')
  const [imgTab,     setImgTab]    = useState('url')   // 'url' | 'file'
  const [filePreview,setFilePreview]= useState(null)
  const [uploadLoading,setUploadLoading] = useState(false)
  const fileRef = React.useRef(null)

  const flash = (type, text) => { setMsg({type,text}); setTimeout(()=>setMsg({type:'',text:''}),4000) }
  const handleChange = e => {
    const {name,value,type,checked} = e.target
    setForm(p => ({...p,[name]:type==='checkbox'?checked:value}))
  }

  // Manejo de archivo de imagen
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { flash('error','La imagen no debe superar 5 MB.'); return }

    setUploadLoading(true)
    try {
      // Intentamos subir al servidor backend
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(`${API}/upload`, { method:'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm(p => ({...p, cover_url: data.url}))
        setFilePreview(data.url)
        flash('success','✓ Imagen subida al servidor.')
      } else {
        throw new Error('no_server')
      }
    } catch {
      // Fallback: convertir a base64 (funciona sin endpoint de upload)
      const reader = new FileReader()
      reader.onload = (ev) => {
        const b64 = ev.target.result
        setForm(p => ({...p, cover_url: b64}))
        setFilePreview(b64)
      }
      reader.readAsDataURL(file)
    }
    setUploadLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title||!form.author||!form.price||!form.category_id) { flash('error','Título, autor, precio y categoría son obligatorios.'); return }
    setLoading(true)
    try {
      const payload = {...form,price:parseFloat(form.price),pages:form.pages?parseInt(form.pages):null,stock:parseInt(form.stock)||10,rating:parseFloat(form.rating)||4.5,category_id:parseInt(form.category_id)}
      const res = await fetch(editId?`${API}/products/${editId}`:`${API}/products`,{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      if (!res.ok) throw new Error()
      flash('success',editId?'✓ Actualizado.':'✓ Agregado al catálogo.')
      setForm(empty);setEditId(null);setView('list');setFilePreview(null);onRefresh()
    } catch { flash('error','✕ Error al guardar.') }
    setLoading(false)
  }

  const handleEdit = p => {
    setForm({title:p.title||'',author:p.author||'',price:p.price||'',category_id:p.category_id||'',description:p.description||'',edition:p.edition||'',pages:p.pages||'',isbn:p.isbn||'',language:p.language||'Español',rating:p.rating||'4.5',stock:p.stock||'10',is_featured:p.is_featured||false,cover_url:p.cover_url||''})
    setFilePreview(p.cover_url||null)
    setEditId(p.id);setView('form');window.scrollTo({top:0,behavior:'smooth'})
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

      {/* Toggle */}
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

      {/* LIST */}
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
                  {['','Libro','Especialidad','Precio','Stock',''].map((h,i)=>(
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
                <p className="text-white/20 text-xs font-sans">Intenta con otra búsqueda</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* FORM */}
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
              <div>
                <label className="field-label">Precio (S/.) *</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="89.90" className="input-field" />
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
              <div>
                <label className="field-label">Idioma</label>
                <select name="language" value={form.language} onChange={handleChange} className="input-field cursor-pointer">
                  <option>Español</option><option>Inglés</option><option>Portugués</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Portada del Libro</label>

                {/* Tabs: archivo / URL */}
                <div className="flex gap-1 mb-3">
                  {[{k:'file',icon:'📁',label:'Subir archivo'},{k:'url',icon:'🔗',label:'Pegar URL'}].map(t => (
                    <button key={t.k} type="button" onClick={()=>setImgTab(t.k)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all border"
                      style={{
                        background:  imgTab===t.k?'rgba(212,168,83,0.12)':'rgba(255,255,255,0.03)',
                        color:       imgTab===t.k?'#d4a853':'rgba(255,255,255,0.35)',
                        borderColor: imgTab===t.k?'rgba(212,168,83,0.3)':'rgba(255,255,255,0.07)',
                      }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* File upload */}
                {imgTab==='file' && (
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={()=>!uploadLoading && fileRef.current?.click()}
                      className="relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group"
                      style={{
                        borderColor: filePreview?'rgba(212,168,83,0.4)':'rgba(255,255,255,0.1)',
                        background:  filePreview?'rgba(212,168,83,0.04)':'rgba(255,255,255,0.02)',
                      }}
                    >
                      {uploadLoading ? (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <div className="w-6 h-6 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
                          <p className="text-white/40 text-xs font-sans">Subiendo imagen...</p>
                        </div>
                      ) : filePreview ? (
                        <div className="flex items-center gap-4">
                          <img src={filePreview} alt="preview"
                            className="w-16 h-20 object-cover rounded-xl border border-white/15 shrink-0"
                            onError={e=>e.target.style.display='none'} />
                          <div className="text-left">
                            <p className="text-emerald-400 text-xs font-semibold font-sans mb-1">✓ Imagen cargada</p>
                            <p className="text-white/30 text-[0.65rem] font-sans mb-2">
                              {form.cover_url.startsWith('data:') ? 'Imagen local (base64)' : 'Imagen subida al servidor'}
                            </p>
                            <button type="button"
                              onClick={e=>{e.stopPropagation();setFilePreview(null);setForm(p=>({...p,cover_url:''}));if(fileRef.current)fileRef.current.value=''}}
                              className="text-red-400/60 hover:text-red-400 text-[0.65rem] font-sans underline">
                              Quitar imagen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🖼️</div>
                          <p className="text-white/50 text-sm font-sans mb-1">
                            <span className="text-yellow-500 font-semibold">Haz clic</span> para seleccionar imagen
                          </p>
                          <p className="text-white/25 text-[0.65rem] font-sans">JPG, PNG, WEBP · Máx. 5 MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* URL */}
                {imgTab==='url' && (
                  <div>
                    <input
                      name="cover_url"
                      value={form.cover_url.startsWith('data:') ? '' : form.cover_url}
                      onChange={e=>{setForm(p=>({...p,cover_url:e.target.value}));setFilePreview(e.target.value)}}
                      placeholder="https://images.unsplash.com/..."
                      className="input-field"
                    />
                    {form.cover_url && !form.cover_url.startsWith('data:') && (
                      <div className="flex items-center gap-3 mt-3">
                        <img src={form.cover_url} alt="preview"
                          className="w-12 h-16 object-cover rounded-xl border border-white/10"
                          onError={e=>e.target.style.display='none'} />
                        <span className="text-white/25 text-xs font-sans">Vista previa de portada</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="field-label">Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Descripción..." className="input-field resize-y leading-relaxed" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                  style={{background:'rgba(212,168,83,0.05)',border:'1px solid rgba(212,168,83,0.12)'}}>
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 accent-yellow-500 cursor-pointer" />
                  <span className="text-white/60 text-sm font-sans">⭐ Libro <strong className="text-white">Destacado</strong> <span className="text-white/25 text-xs">(aparece en el inicio)</span></span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button type="submit" disabled={loading}
                className="flex-1 py-4 rounded-xl font-semibold text-base font-sans transition-all"
                style={{background:loading?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#d4a853,#e8c07a)',color:loading?'rgba(255,255,255,0.2)':'#080c10',cursor:loading?'not-allowed':'pointer'}}>
                {loading?'Guardando...':editId?'Guardar cambios':'Agregar al catálogo'}
              </button>
              <button type="button" onClick={()=>{setForm(empty);setEditId(null);setView('list')}}
                className="px-6 py-4 rounded-xl text-sm font-semibold font-sans bg-white/5 text-white/40 border border-white/8 hover:bg-white/8 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

/* ── SETTINGS TAB ── */
function SettingsTab() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  return (
    <div className="space-y-5 animate-fade-up max-w-2xl">
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background:'#0d1218' }}>
        <div className="px-7 py-5 border-b border-white/5">
          <h2 className="font-display font-bold text-white text-xl">Credenciales de Acceso</h2>
          <p className="text-white/25 text-xs font-sans mt-1">
            Edita <code className="text-yellow-500/60">src/context/AuthContext.jsx</code> para cambiarlas
          </p>
        </div>
        <div className="p-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/6 bg-white/2">
              <p className="eyebrow text-[0.6rem] mb-1">Usuario</p>
              <p className="text-white font-semibold font-sans">admin</p>
            </div>
            <div className="p-4 rounded-xl border border-white/6 bg-white/2">
              <p className="eyebrow text-[0.6rem] mb-1">Contraseña</p>
              <p className="text-white/30 font-sans tracking-[4px]">••••••••</p>
            </div>
          </div>
          <div className="text-xs text-white/30 font-sans p-4 rounded-xl bg-white/2 border border-white/5 leading-relaxed">
            <p className="text-yellow-500/60 font-semibold mb-2">📌 Cómo cambiar las credenciales:</p>
            Abre <code className="text-white/50">src/context/AuthContext.jsx</code> y modifica las constantes{' '}
            <code className="text-yellow-500/50">OWNER_USER</code> y <code className="text-yellow-500/50">OWNER_PASS</code>.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background:'#0d1218' }}>
        <div className="px-7 py-5 border-b border-white/5">
          <h2 className="font-display font-bold text-white text-xl">WhatsApp de Pedidos</h2>
        </div>
        <div className="p-7">
          <div className="text-xs text-white/30 font-sans p-4 rounded-xl bg-white/2 border border-white/5 leading-relaxed">
            <p className="text-emerald-400/60 font-semibold mb-2">💬 Cómo cambiar el número:</p>
            Abre <code className="text-white/50">src/components/CheckoutModal.jsx</code> y cambia{' '}
            <code className="text-yellow-500/50">WHATSAPP_NUMBER</code>. Formato: <code className="text-white/50">51987654321</code>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-red-500/15 overflow-hidden" style={{ background:'rgba(80,0,0,0.1)' }}>
        <div className="px-7 py-5">
          <h2 className="font-display font-bold text-white text-lg mb-3">Cerrar Sesión</h2>
          <p className="text-white/25 text-xs font-sans mb-4">La sesión expira automáticamente en 8 horas.</p>
          <button onClick={()=>{logout();navigate('/admin/login')}}
            className="px-6 py-3 rounded-xl text-sm font-semibold font-sans bg-red-900/30 border border-red-500/25 text-red-400 hover:bg-red-900/50 transition-all">
            ⎋ Cerrar sesión ahora
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="font-display text-5xl font-black text-gradient-gold animate-float">LM</div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i=>(
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce" style={{animationDelay:`${i*120}ms`}} />
        ))}
      </div>
    </div>
  )
}