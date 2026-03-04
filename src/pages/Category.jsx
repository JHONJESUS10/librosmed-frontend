import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SPECIALTY_VISUALS = {
  'enfermeria': {
    image:    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1400&auto=format&fit=crop',
    color:    '#3b9ae1', accent: '#3b9ae1',
    stats:    ['Atención al paciente','Farmacología clínica','Procedimientos'],
    quote:    '"El cuidado es la esencia de la enfermería."',
    tags:     ['Fundamentos','Clínica','Cirugía','Pediatría','Geriatría'],
  },
  'farmacologia': {
    image:    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1400&auto=format&fit=crop',
    color:    '#10b981', accent: '#10b981',
    stats:    ['Mecanismos de acción','Interacciones farmacológicas','Terapéutica'],
    quote:    '"Conocer el fármaco es conocer la cura."',
    tags:     ['Farmacología básica','Clínica','Toxicología','Bioquímica'],
  },
  'farmacia': {
    image:    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1400&auto=format&fit=crop',
    color:    '#10b981', accent: '#10b981',
    stats:    ['Dispensación','Farmacoterapia','Gestión farmacéutica'],
    quote:    '"El farmacéutico, guardián de la salud."',
    tags:     ['Farmacia clínica','Bioquímica','Toxicología'],
  },
  'laboratorio-clinico': {
    image:    'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=1400&auto=format&fit=crop',
    color:    '#8b5cf6', accent: '#8b5cf6',
    stats:    ['Hematología','Bioquímica clínica','Microbiología'],
    quote:    '"El diagnóstico nace en el laboratorio."',
    tags:     ['Análisis clínicos','Hematología','Microbiología','Inmunología'],
  },
  'medicina-general': {
    image:    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1400&auto=format&fit=crop',
    color:    '#ef4444', accent: '#ef4444',
    stats:    ['Semiología','Diagnóstico clínico','Terapéutica médica'],
    quote:    '"La medicina es el arte de curar."',
    tags:     ['Semiología','Interna','Cirugía','Pediatría'],
  },
  'contabilidad': {
    image:    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1400&auto=format&fit=crop',
    color:    '#f59e0b', accent: '#f59e0b',
    stats:    ['Contabilidad financiera','Costos y presupuestos','Auditoría'],
    quote:    '"Los números son el lenguaje de los negocios."',
    tags:     ['NIIF','Auditoría','Costos','Tributación'],
  },
  'gestion-administrativa': {
    image:    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400&auto=format&fit=crop',
    color:    '#f97316', accent: '#f97316',
    stats:    ['Gestión empresarial','Recursos humanos','Estrategia'],
    quote:    '"Administrar es prever y actuar con eficiencia."',
    tags:     ['Administración','RRHH','Marketing','Logística'],
  },
  'negocios-bancarios': {
    image:    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1400&auto=format&fit=crop',
    color:    '#06b6d4', accent: '#06b6d4',
    stats:    ['Banca y finanzas','Inversiones','Riesgo financiero'],
    quote:    '"Las finanzas son el motor de la economía."',
    tags:     ['Finanzas','Banca','Inversiones','Seguros'],
  },
}

const DEFAULT_VISUAL = {
  image:  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1400&auto=format&fit=crop',
  color:  '#d4a853', accent: '#d4a853',
  stats:  ['Teoría','Práctica','Aplicaciones'],
  quote:  '"El conocimiento es poder."',
  tags:   ['Especialidad'],
}

export default function Category({ addToCart }) {
  const { slug }   = useParams()
  const [cat,      setCat]      = useState(null)
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [sort,     setSort]     = useState('default')

  const V = SPECIALTY_VISUALS[slug] || DEFAULT_VISUAL

  useEffect(() => {
    setLoading(true); setError(''); setCat(null); setProducts([])
    fetch(`${API}/categories/${slug}`)
      .then(r => { if (!r.ok) throw new Error('No encontrado'); return r.json() })
      .then(c  => { setCat(c); return fetch(`${API}/products?category=${slug}`) })
      .then(r  => r.json())
      .then(p  => { setProducts(p); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [slug])

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price_asc')  return parseFloat(a.price) - parseFloat(b.price)
    if (sort === 'price_desc') return parseFloat(b.price) - parseFloat(a.price)
    if (sort === 'rating')     return parseFloat(b.rating) - parseFloat(a.rating)
    return 0
  })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian">
      <div className="font-display text-4xl text-gradient-gold animate-float">Cargando...</div>
    </div>
  )

  if (error || !cat) return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center text-center px-6">
      <div>
        <div className="text-5xl mb-6 opacity-20">◎</div>
        <h2 className="font-display text-3xl text-white mb-3">Especialidad no encontrada</h2>
        <p className="text-white/35 text-sm mb-8 font-sans">
          Verifica el servidor en <code className="text-yellow-500">localhost:5000</code>
        </p>
        <Link to="/" className="btn-primary">← Volver al inicio</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-obsidian">

      {/* ─────────────────────────────────────────
          HERO con imagen real de especialidad
      ───────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: '500px' }}>

        {/* Imagen de fondo con parallax effect */}
        <div className="absolute inset-0">
          <img src={V.image} alt={cat.name}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) saturate(0.9)', transform: 'scale(1.05)' }} />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(6,10,15,0.97) 0%, rgba(6,10,15,0.87) 45%, rgba(6,10,15,0.45) 75%, rgba(6,10,15,0.15) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to top, #080c10, transparent)' }} />

        {/* Color accent left line */}
        <div className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: `linear-gradient(to bottom, transparent, ${V.accent}, transparent)` }} />

        {/* Glow orbs */}
        <div className="absolute top-8 right-8 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${V.accent}15 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${V.accent}08 0%, transparent 65%)` }} />

        {/* Main content grid */}
        <div className="wrap relative py-16 pb-28"
          style={{ zIndex: 2 }}>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-center">

            {/* LEFT */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-white/25 mb-8 font-sans">
                <Link to="/" className="hover:text-white/55 transition-colors">Inicio</Link>
                <span className="text-white/15">›</span>
                <span className="text-white/50">{cat.name}</span>
              </nav>

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-px" style={{ background: V.accent }} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] font-sans" style={{ color: V.accent }}>
                  Especialidad Académica
                </span>
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-5">
                <div className="text-5xl leading-none">{cat.icon}</div>
                <h1 className="font-display font-black text-white leading-none"
                  style={{ fontSize: 'clamp(2.8rem,6.5vw,5.5rem)' }}>
                  {cat.name}
                </h1>
              </div>

              {/* Description */}
              {cat.description && (
                <p className="text-white/45 max-w-lg font-sans font-light text-base leading-relaxed mb-5">
                  {cat.description}
                </p>
              )}

              {/* Quote */}
              <blockquote className="font-display italic text-lg mb-6"
                style={{ color: `${V.accent}80` }}>
                {V.quote}
              </blockquote>

              {/* Topic tags */}
              <div className="flex flex-wrap gap-2 mb-7">
                {V.tags.map(tag => (
                  <span key={tag}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full font-sans border transition-all"
                    style={{
                      color:       V.accent,
                      borderColor: `${V.accent}30`,
                      background:  `${V.accent}10`,
                    }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Count */}
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold font-sans border"
                style={{ background: `${V.accent}12`, borderColor: `${V.accent}28`, color: V.accent }}>
                📚 {products.length} libro{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* RIGHT — Cards visuals */}
            <div className="hidden lg:flex flex-col gap-3">

              {/* Specialty photo card */}
              <div className="rounded-2xl overflow-hidden border border-white/8"
                style={{ boxShadow: `0 20px 50px rgba(0,0,0,0.65), 0 0 0 1px ${V.accent}22` }}>
                <div className="relative" style={{ paddingTop: '60%' }}>
                  <img src={V.image} alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.65) saturate(1.2)' }} />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(6,10,15,0.92) 0%, transparent 55%)' }} />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white font-display font-bold text-lg leading-tight">{cat.name}</p>
                    <p className="text-white/40 text-xs font-sans mt-0.5">{products.length} títulos · LibrosMed</p>
                  </div>
                  {/* Accent glow overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 80% 20%, ${V.accent}18 0%, transparent 60%)` }} />
                </div>
              </div>

              {/* Topics list */}
              <div className="rounded-2xl p-4 border border-white/6"
                style={{ background: 'rgba(13,18,24,0.95)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest font-sans mb-3"
                  style={{ color: V.accent }}>
                  Áreas cubiertas
                </p>
                <div className="space-y-2.5">
                  {V.stats.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: V.accent, opacity: 1 - i*0.2 }} />
                      <span className="text-white/55 text-xs font-sans">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          PRODUCTS
      ───────────────────────────────────────── */}
      <div className="wrap py-12">

        {/* Sort + count */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <p className="text-white/30 text-sm font-sans">
            Mostrando <span className="font-semibold" style={{ color: V.accent }}>{sorted.length}</span> libro{sorted.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-white/25 text-xs uppercase tracking-widest font-sans hidden sm:block">Ordenar</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2.5 rounded-xl border text-sm text-white font-sans outline-none cursor-pointer"
              style={{ background: '#0d1218', borderColor: 'rgba(255,255,255,0.1)' }}>
              <option value="default">Predeterminado</option>
              <option value="price_asc">Precio ↑</option>
              <option value="price_desc">Precio ↓</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <EmptyState catName={cat.name} V={V} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sorted.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i*45}ms` }}>
                <ProductCard product={p} addToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ catName, V }) {
  return (
    <div className="py-24 text-center">
      <div className="relative w-36 h-36 mx-auto mb-8 rounded-2xl overflow-hidden border border-white/6">
        <img src={V.image} alt={catName} className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.2) blur(2px)' }} />
        <div className="absolute inset-0 flex items-center justify-center text-5xl">📭</div>
      </div>
      <h3 className="font-display text-2xl font-bold text-white mb-2">Sin libros en {catName} aún</h3>
      <p className="text-white/25 text-sm font-sans mb-8 max-w-xs mx-auto">
        Próximamente agregaremos títulos especializados en esta área.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/admin" className="btn-outline text-sm px-6 py-3">⚙ Agregar desde Admin →</Link>
        <Link to="/"      className="btn-dark text-sm px-6 py-3">← Ver otras especialidades</Link>
      </div>
    </div>
  )
}