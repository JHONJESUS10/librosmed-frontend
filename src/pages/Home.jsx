import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Imágenes y configuración visual por especialidad ──────────────
const SPECIALTY_DATA = {
  'enfermeria': {
    image:   'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=800&auto=format&fit=crop',
    color:   '#3b9ae1',
    tagline: 'Cuidado · Clínica · Pediatría',
  },
  'farmacologia': {
    image:   'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=800&auto=format&fit=crop',
    color:   '#10b981',
    tagline: 'Mecanismos · Terapéutica · Toxicología',
  },
  'farmacia': {
    image:   'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=800&auto=format&fit=crop',
    color:   '#10b981',
    tagline: 'Dispensación · Clínica · Bioquímica',
  },
  'laboratorio-clinico': {
    image:   'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=800&auto=format&fit=crop',
    color:   '#8b5cf6',
    tagline: 'Hematología · Microbiología · Inmunología',
  },
  'medicina-general': {
    image:   'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=800&auto=format&fit=crop',
    color:   '#ef4444',
    tagline: 'Semiología · Interna · Diagnóstico',
  },
  'contabilidad': {
    image:   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    color:   '#f59e0b',
    tagline: 'NIIF · Auditoría · Costos · Tributación',
  },
  'gestion-administrativa': {
    image:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    color:   '#f97316',
    tagline: 'Gestión · RRHH · Marketing · Logística',
  },
  'negocios-bancarios': {
    image:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    color:   '#06b6d4',
    tagline: 'Finanzas · Banca · Inversiones',
  },
}
const DEFAULT_SPEC = {
  image:   'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
  color:   '#d4a853',
  tagline: 'Textos académicos especializados',
}

export default function Home({ addToCart }) {
  const [cats,        setCats]        = useState([])
  const [featured,    setFeatured]    = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [params]      = useSearchParams()
  const search        = params.get('search') || ''

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/categories`).then(r => r.json()).catch(() => []),
      fetch(search
        ? `${API}/products?search=${encodeURIComponent(search)}`
        : `${API}/products?featured=true`).then(r => r.json()).catch(() => []),
      search
        ? Promise.resolve([])
        : fetch(`${API}/products?limit=200`).then(r => r.json()).catch(() => []),
    ]).then(([c, f, a]) => {
      setCats(c || [])
      setFeatured(f || [])
      setAllProducts(search ? (f || []) : (a || []))
      setLoading(false)
    })
  }, [search])

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-obsidian">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      {!search && (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage:"url('https://images.unsplash.com/photo-1635253547947-99e92cc36149?q=80&w=1600&auto=format&fit=crop')" }} />
          <div className="absolute inset-0"
            style={{ background:'linear-gradient(105deg, rgba(8,12,16,0.97) 0%, rgba(8,12,16,0.88) 45%, rgba(8,12,16,0.55) 75%, rgba(8,12,16,0.3) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background:'linear-gradient(to top, rgba(8,12,16,1) 0%, transparent 30%)' }} />
          <div className="absolute top-0 left-0 w-1 h-full"
            style={{ background:'linear-gradient(to bottom, transparent, #d4a853, transparent)' }} />

          <div className="wrap relative z-10 pt-24 pb-40 max-w-[760px]">
            <div className="animate-fade-in flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-yellow-500" />
              <span className="eyebrow text-yellow-500/70">Librería Académica Especializada</span>
            </div>
            <h1 className="font-display font-black text-white leading-[1.05] mb-6 animate-fade-up"
              style={{ fontSize:'clamp(3rem, 7vw, 6.5rem)' }}>
              El saber<br />
              <span className="text-gradient-gold italic">transforma</span><br />
              tu futuro.
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-md mb-10 animate-fade-up delay-200 font-sans font-light">
              Enfermería · Farmacia · Laboratorio · Contabilidad<br />
              Administración · Finanzas Bancarias
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
              {cats.length > 0 && (
                <Link to={`/categoria/${cats[0].slug}`} className="btn-primary text-base px-8 py-4">
                  Explorar Catálogo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              <a href="#especialidades" className="btn-outline text-base px-8 py-4">
                Ver Especialidades
              </a>
            </div>
            <div className="flex gap-10 mt-16 pt-10 border-t border-white/8 animate-fade-up delay-400">
              {[
                [allProducts.length || '48', 'Títulos en stock'],
                [cats.length || '6',         'Especialidades'],
                ['100%',                     'Académicos'],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="font-display font-black text-4xl text-gradient-gold leading-none">{val}</div>
                  <div className="text-white/35 text-xs uppercase tracking-widest mt-1.5 font-sans">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background:'linear-gradient(to top, #080c10, transparent)' }} />
        </section>
      )}

      {/* ── Search banner ── */}
      {search && (
        <div className="bg-obsidian-50 border-b border-white/6 py-16 px-6">
          <div className="wrap">
            <div className="gold-rule" />
            <h2 className="font-display text-4xl font-bold text-white mb-2">
              "<span className="text-gradient-gold">{search}</span>"
            </h2>
            <p className="text-white/40 font-sans text-sm">
              {allProducts.length} resultado{allProducts.length !== 1 ? 's' : ''}
            </p>
            <Link to="/" className="inline-block mt-4 text-yellow-500 text-sm hover:underline font-sans">← Volver al catálogo</Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          ESPECIALIDADES — con fotos reales
      ══════════════════════════════════ */}
      {!search && (
        <section id="especialidades" className="py-24 relative">
          <div className="wrap">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="eyebrow">Áreas de Estudio</span>
                <div className="gold-rule" />
                <h2 className="font-display text-4xl font-bold text-white">Especialidades</h2>
              </div>
              <p className="text-white/30 text-sm font-sans max-w-xs">
                {cats.length} especialidades académicas con libros actualizados
              </p>
            </div>

            {/* ── Cards con foto ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cats.map((cat, i) => (
                <SpecialtyCard key={cat.id} cat={cat} index={i} allProducts={allProducts} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          FEATURED
      ══════════════════════════════════ */}
      {!search && featured.length > 0 && (
        <section className="py-20 border-t border-white/5">
          <div className="wrap mb-10">
            <span className="eyebrow">Selección Editorial</span>
            <div className="gold-rule" />
            <h2 className="font-display text-4xl font-bold text-white">Libros Destacados</h2>
          </div>
          <div className="wrap">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {featured.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay:`${i*55}ms` }}>
                  <ProductCard product={p} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Search results ── */}
      {search && (
        <div className="wrap py-16">
          {allProducts.length === 0 ? (
            <EmptySearch term={search} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allProducts.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay:`${i*45}ms` }}>
                  <ProductCard product={p} addToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════
          POR CATEGORÍA
      ══════════════════════════════════ */}
      {!search && cats.map((cat, ci) => {
        const spec  = SPECIALTY_DATA[cat.slug] || DEFAULT_SPEC
        const books = allProducts.filter(p => p.category_slug === cat.slug || p.category_id === cat.id)
        if (!books.length) return null

        return (
          <section key={cat.id} className="py-20 border-t border-white/5">
            <div className="wrap">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="eyebrow text-[0.65rem]" style={{ color: spec.color }}>Especialidad</span>
                  <div className="w-8 h-px mt-2 mb-3" style={{ background: spec.color }} />
                  <h2 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </h2>
                </div>
                <Link to={`/categoria/${cat.slug}`}
                  className="hidden sm:flex items-center gap-2 text-sm font-sans font-medium transition-colors"
                  style={{ color: spec.color }}>
                  Ver todos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {books.slice(0, 6).map((p, i) => (
                  <div key={p.id} className="animate-fade-up" style={{ animationDelay:`${i*60}ms` }}>
                    <ProductCard product={p} addToCart={addToCart} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* ══════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════ */}
      {!search && (
        <section className="py-28 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0"
            style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.08) 0%, transparent 70%)' }} />
          <div className="wrap text-center relative z-10">
            <p className="eyebrow mb-4">¿Listo para empezar?</p>
            <h2 className="font-display text-5xl font-black text-white mb-4">
              Tu siguiente libro<br />
              <span className="text-gradient-gold">te está esperando.</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto mb-10 font-sans font-light text-base leading-relaxed">
              Pago coordinado por WhatsApp. Sin plataformas complicadas, sin registros.
            </p>
            <a href="#especialidades" className="btn-primary text-base px-10 py-4">
              Explorar especialidades →
            </a>
          </div>
        </section>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════
   SPECIALTY CARD — con foto real de la especialidad
════════════════════════════════════════════ */
function SpecialtyCard({ cat, index, allProducts }) {
  const [hov, setHov] = useState(false)
  const spec          = SPECIALTY_DATA[cat.slug] || DEFAULT_SPEC
  const count         = allProducts.filter(p => p.category_slug === cat.slug || p.category_id === cat.id).length
  const productCount  = count || cat.product_count || 0

  return (
    <Link
      to={`/categoria/${cat.slug}`}
      className="animate-fade-up block"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="relative rounded-2xl overflow-hidden border transition-all duration-400 cursor-pointer"
        style={{
          borderColor: hov ? `${spec.color}55` : 'rgba(255,255,255,0.07)',
          boxShadow:   hov
            ? `0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px ${spec.color}35`
            : '0 4px 20px rgba(0,0,0,0.35)',
          transform:   hov ? 'translateY(-6px)' : 'translateY(0)',
          height: '220px',
        }}
      >
        {/* Background photo */}
        <img
          src={spec.image}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{
            filter:    `brightness(${hov ? 0.45 : 0.3}) saturate(${hov ? 1.1 : 0.8})`,
            transform: hov ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 transition-all duration-400"
          style={{
            background: hov
              ? `linear-gradient(135deg, ${spec.color}22 0%, rgba(6,10,15,0.85) 100%)`
              : `linear-gradient(135deg, ${spec.color}12 0%, rgba(6,10,15,0.92) 100%)`,
          }}
        />

        {/* Color accent top-left corner */}
        <div className="absolute top-0 left-0 w-16 h-1 transition-all duration-400"
          style={{ background: `linear-gradient(90deg, ${spec.color}, transparent)`, opacity: hov ? 1 : 0.5 }} />

        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none transition-all duration-400"
          style={{ background: `radial-gradient(circle, ${spec.color}${hov ? '22' : '10'} 0%, transparent 70%)` }} />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between">

          {/* Top: icon + count */}
          <div className="flex items-start justify-between">
            <div
              className="text-3xl leading-none p-2.5 rounded-xl transition-all duration-300"
              style={{
                background:  `${spec.color}20`,
                border:      `1px solid ${spec.color}30`,
                transform:   hov ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {cat.icon}
            </div>
            <span
              className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full font-sans transition-all duration-300"
              style={{
                color:       spec.color,
                background:  `${spec.color}18`,
                border:      `1px solid ${spec.color}30`,
              }}
            >
              {productCount} libros
            </span>
          </div>

          {/* Bottom: title + tagline */}
          <div>
            <h3
              className="font-display font-black text-white text-xl leading-tight mb-1.5 transition-colors duration-300"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
            >
              {cat.name}
            </h3>
            <p
              className="text-xs font-sans leading-relaxed transition-all duration-400"
              style={{
                color:   hov ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
                opacity: hov ? 1 : 0.8,
              }}
            >
              {spec.tagline}
            </p>

            {/* Hover arrow */}
            <div
              className="flex items-center gap-1.5 mt-3 text-xs font-semibold font-sans transition-all duration-400"
              style={{
                color:     spec.color,
                opacity:   hov ? 1 : 0,
                transform: hov ? 'translateX(0)' : 'translateX(-8px)',
              }}
            >
              Ver libros
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function EmptySearch({ term }) {
  return (
    <div className="text-center py-28">
      <div className="text-5xl mb-5 opacity-50">◎</div>
      <h3 className="font-display text-3xl text-white mb-2">Sin resultados para "{term}"</h3>
      <p className="text-white/35 font-sans mb-8">Prueba con otro título, autor o ISBN.</p>
      <Link to="/" className="btn-outline">← Ver catálogo completo</Link>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-obsidian gap-5">
      <div className="font-display text-6xl font-black text-gradient-gold animate-float">LM</div>
      <div className="flex gap-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce"
            style={{ animationDelay:`${i*120}ms` }} />
        ))}
      </div>
      <p className="text-white/30 text-xs uppercase tracking-widest font-sans">Cargando catálogo</p>
    </div>
  )
}