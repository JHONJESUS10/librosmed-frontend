import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Footer() {
  const [cats, setCats] = useState([])

  useEffect(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(setCats).catch(() => {})
  }, [])

  const mid  = Math.ceil(cats.length / 2)
  const g1   = cats.slice(0, mid)
  const g2   = cats.slice(mid)

  return (
    <footer style={{ background: '#050810', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Gold shimmer line */}
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <div className="wrap py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">

        {/* Brand */}
        <div>
          <Link to="/" className="font-display text-3xl font-black text-white block mb-5 leading-none">
            Libros<span className="text-gradient-gold">Med</span>
          </Link>
          <p className="text-white/30 text-sm leading-relaxed font-sans font-light mb-7 max-w-[220px]">
            Librería académica especializada en ciencias de la salud y administración.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Pago por WA','Sin cargos','Stock real'].map(t => (
              <span key={t} className="text-[0.62rem] font-semibold px-2.5 py-1 rounded-full bg-yellow-500/8 border border-yellow-500/15 text-yellow-500/60 font-sans">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Cats 1 */}
        <div>
          <p className="eyebrow text-[0.65rem] mb-5">
            {g1.some(c => ['enfermeria','farmacia','laboratorio-clinico'].includes(c.slug))
              ? 'Ciencias de Salud' : 'Especialidades'}
          </p>
          <div className="space-y-3">
            {g1.map(c => (
              <FooterLink key={c.id} to={`/categoria/${c.slug}`}>{c.icon} {c.name}</FooterLink>
            ))}
          </div>
        </div>

        {/* Cats 2 */}
        <div>
          <p className="eyebrow text-[0.65rem] mb-5">
            {g2.some(c => ['contabilidad','gestion-administrativa','negocios-bancarios'].includes(c.slug))
              ? 'Administración' : 'Más Áreas'}
          </p>
          <div className="space-y-3">
            {g2.map(c => (
              <FooterLink key={c.id} to={`/categoria/${c.slug}`}>{c.icon} {c.name}</FooterLink>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="eyebrow text-[0.65rem] mb-5">Contacto</p>
          <div className="space-y-3">
            {[['📧','librosmed@example.com'],['📞','(01) 234-5678'],['📍','Lima, Perú']].map(([i,t]) => (
              <div key={t} className="flex items-center gap-2 text-sm text-white/30 font-sans">
                <span>{i}</span><span>{t}</span>
              </div>
            ))}
          </div>
          <Link to="/admin"
            className="inline-flex items-center gap-1.5 mt-6 px-3.5 py-2 rounded-xl text-xs font-medium text-yellow-500/40 border border-yellow-500/15 hover:text-yellow-500/70 hover:border-yellow-500/35 transition-all font-sans">
            ⚙ Panel Admin
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/4">
        <div className="wrap py-5 flex flex-wrap justify-between items-center gap-3 text-[0.7rem] text-white/20 font-sans">
          <span>© 2024 LibrosMed</span>
          <span className="text-yellow-500/25">Pago 100% por WhatsApp · Sin cargos online</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link to={to}
      className="block text-sm text-white/30 hover:text-yellow-500/80 transition-colors duration-150 font-sans">
      {children}
    </Link>
  )
}