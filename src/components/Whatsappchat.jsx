import React, { useState, useRef, useEffect } from 'react'

// ════════════════════════════════════════
//  CAMBIA TU NÚMERO DE WHATSAPP AQUÍ
const WA_NUMBER = '51983553140'
// ════════════════════════════════════════

// ── Base de conocimiento del chatbot ──────────────────────────
const BOT_KB = [
  {
    keywords: ['hola','hi','buenos','buenas','saludos','hey'],
    response:  '¡Hola! 👋 Soy el asistente de LibrosMed. Puedo ayudarte con información sobre nuestros libros, precios, envíos y disponibilidad. ¿En qué te puedo ayudar?',
  },
  {
    keywords: ['envio','envío','delivery','entrega','despacho','llegar','llega'],
    response:  '🚚 **Información de envíos:**\n\n• Envío gratis en pedidos mayores a S/. 150\n• Pedidos menores: costo de S/. 10.00\n• Coordinamos la entrega directamente por WhatsApp\n• Realizamos envíos a Lima y provincias',
  },
  {
    keywords: ['pago','pagar','precio','costo','cobro','transferencia','yape','plin'],
    response:  '💳 **Métodos de pago:**\n\n• Yape / Plin\n• Transferencia bancaria\n• Efectivo al momento de la entrega\n\nTodos los pagos se coordinan directamente por WhatsApp con nosotros.',
  },
  {
    keywords: ['tiempo','cuanto','demora','dias','días','rápido','rapido'],
    response:  '⏱️ **Tiempos de entrega:**\n\n• Lima: 1-2 días hábiles\n• Provincias: 3-5 días hábiles\n\nTe confirmamos el tiempo exacto cuando coordines tu pedido por WhatsApp.',
  },
  {
    keywords: ['devolucion','devolución','cambio','garantia','garantía','defecto','dañado'],
    response:  '↩️ **Política de devoluciones:**\n\nAceptamos devoluciones dentro de los 7 días posteriores a la entrega si el libro tiene algún defecto de fábrica o fue enviado equivocado. Escríbenos por WhatsApp para coordinar.',
  },
  {
    keywords: ['enfermeria','enfermería','enfermera','enfermero'],
    response:  '💉 **Libros de Enfermería:**\n\nTenemos amplia selección en:\n• Fundamentos de enfermería\n• Enfermería clínica\n• Farmacología para enfermeros\n• Procedimientos y técnicas\n\n¿Buscas algún autor o título específico?',
  },
  {
    keywords: ['farmacia','farmacología','farmacologia','medicamento','farma'],
    response:  '💊 **Libros de Farmacia y Farmacología:**\n\nTenemos títulos de:\n• Farmacología básica y clínica\n• Farmacoterapia\n• Toxicología\n• Farmacia hospitalaria\n\n¿Necesitas algún texto en particular?',
  },
  {
    keywords: ['laboratorio','lab','análisis','analisis','hemato','bioquimica','bioquímica'],
    response:  '🔬 **Libros de Laboratorio Clínico:**\n\nContamos con:\n• Hematología clínica\n• Bioquímica diagnóstica\n• Microbiología médica\n• Inmunología y serología\n\n¿Hay algún área específica que te interese?',
  },
  {
    keywords: ['contabilidad','contable','niif','auditoria','auditoría','costo','costos'],
    response:  '📊 **Libros de Contabilidad:**\n\nTenemos textos de:\n• Contabilidad financiera y de costos\n• NIIF / IFRS\n• Auditoría financiera y tributaria\n• Tributación peruana\n\n¿Buscas algún nivel o área específica?',
  },
  {
    keywords: ['administracion','administración','rrhh','marketing','logistica','logística'],
    response:  '📋 **Libros de Administración:**\n\nContamos con:\n• Gestión empresarial\n• Recursos humanos\n• Marketing estratégico\n• Logística y cadena de suministro\n\n¿Cuál área te interesa?',
  },
  {
    keywords: ['finanzas','banca','banco','inversion','inversión','credito','crédito'],
    response:  '🏦 **Libros de Finanzas y Banca:**\n\nTenemos títulos de:\n• Finanzas corporativas\n• Banca comercial\n• Inversiones y portafolios\n• Gestión de riesgo financiero\n\n¿Tienes algún título en mente?',
  },
  {
    keywords: ['catalogo','catálogo','disponible','disponibles','stock','inventario'],
    response:  '📚 **Nuestro catálogo:**\n\nTenemos libros en 6 especialidades:\n💉 Enfermería · 💊 Farmacia\n🔬 Laboratorio Clínico · 🏥 Medicina General\n📊 Contabilidad · 📋 Administración\n\nPuedes explorar todas las categorías en nuestra tienda o preguntarme por una específica.',
  },
  {
    keywords: ['descuento','oferta','promocion','promoción','rebaja','barato'],
    response:  '🎁 **Ofertas y descuentos:**\n\n• Envío GRATIS en pedidos mayores a S/. 150\n• Descuentos especiales por compra de varios libros\n• Preguntar por paquetes académicos\n\nEscríbenos por WhatsApp para consultar nuestras ofertas actuales.',
  },
  {
    keywords: ['horario','atencion','atención','abierto','cerrado','disponible'],
    response:  '🕐 **Horario de atención:**\n\nLunes a Viernes: 9:00 am – 7:00 pm\nSábados: 9:00 am – 2:00 pm\n\nFuera de horario puedes dejarnos tu consulta por WhatsApp y te respondemos apenas estemos disponibles.',
  },
  {
    keywords: ['numero','número','contacto','telefono','teléfono','llamar','whatsapp'],
    response:  '📞 **Contacto:**\n\nPuedes comunicarte con nosotros por WhatsApp:\n👆 Presiona el botón verde de abajo para abrir una conversación directa con nuestro equipo.',
  },
  {
    keywords: ['pedido','pedir','comprar','compra','orden'],
    response:  '🛒 **¿Cómo hacer un pedido?**\n\n1. Agrega libros al carrito\n2. Ve a "Carrito" y presiona "Pedir por WhatsApp"\n3. Ingresa tu nombre y se abrirá WhatsApp con tu pedido listo\n4. Envía el mensaje y coordinamos contigo\n\n¿Necesitas ayuda con algún libro en específico?',
  },
  {
    keywords: ['gracias','thank','perfecto','genial','excelente','listo'],
    response:  '¡Con gusto! 😊 Si tienes más preguntas, aquí estoy. Recuerda que también puedes comunicarte directamente con nosotros por WhatsApp para una atención más personalizada. 📚',
  },
]

const FALLBACK = '🤔 No entendí tu consulta. Puedes preguntarme sobre:\n\n• Envíos y entregas\n• Métodos de pago\n• Libros por especialidad\n• Cómo hacer un pedido\n• Horarios y contacto\n\nO si prefieres, escríbenos directamente por WhatsApp y te atendemos de inmediato.'

function getBotResponse(text) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const item of BOT_KB) {
    if (item.keywords.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return item.response
    }
  }
  return FALLBACK
}

// Formatea el texto del bot con negritas y saltos de línea
function FormatText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        }
        return part.split('\n').map((line, j) => (
          <React.Fragment key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </React.Fragment>
        ))
      })}
    </>
  )
}

export default function WhatsAppChat() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      id:   0,
      from: 'bot',
      text: '¡Hola! 👋 Soy el asistente de **LibrosMed**. Puedo ayudarte con información sobre nuestros libros, envíos, pagos y más. ¿En qué te puedo ayudar?',
      time: new Date(),
    },
  ])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const [pulse,    setPulse]    = useState(true)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)

  // Pulse notification every 20s if chat is closed
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [messages, open])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), from: 'user', text: text.trim(), time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      setTyping(false)
      const botText = getBotResponse(text)
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: botText, time: new Date() }])
    }, 900 + Math.random() * 600)
  }

  const openWhatsApp = (msg = '') => {
    const defaultMsg = msg || '¡Hola! Me gustaría obtener más información sobre sus libros.'
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(defaultMsg)}`, '_blank', 'noopener,noreferrer')
  }

  const quickReplies = [
    '¿Cómo hacer un pedido?',
    'Información de envíos',
    'Métodos de pago',
    'Ver catálogo',
  ]

  const fmt = (date) => date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

  return (
    <>
      {/* ── Floating button ── */}
      <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end gap-3">

        {/* Tooltip */}
        {!open && (
          <div className="animate-fade-in mb-1">
            <div className="px-4 py-2 rounded-xl text-xs font-semibold font-sans text-white/80 border border-white/10 whitespace-nowrap"
              style={{ background: 'rgba(10,15,20,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              💬 ¿Necesitas ayuda?
            </div>
          </div>
        )}

        {/* Main button */}
        <button
          onClick={() => { setOpen(!open); setPulse(false) }}
          className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background:  'linear-gradient(135deg, #25D366, #128C7E)',
            boxShadow:   open ? '0 8px 32px rgba(37,211,102,0.5)' : '0 8px 32px rgba(37,211,102,0.4)',
          }}
        >
          {open ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <WhatsAppIcon size={32} />
          )}

          {/* Notification pulse */}
          {!open && (
            <>
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-2 border-obsidian flex items-center justify-center text-[0.5rem] text-white font-black">
                1
              </span>
              <span className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ background: '#25D366' }} />
            </>
          )}
        </button>
      </div>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-[8999] w-[360px] flex flex-col rounded-2xl overflow-hidden animate-scale-up"
          style={{
            maxHeight: '520px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)',
            background: '#111820',
          }}
        >
          {/* ── Header ── */}
          <div className="flex items-center gap-3 px-4 py-4 shrink-0"
            style={{ background: 'linear-gradient(135deg, #128C7E, #25D366)' }}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <WhatsAppIcon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm font-sans">LibrosMed</p>
              <p className="text-white/70 text-[0.68rem] font-sans">Responde habitualmente de inmediato</p>
            </div>
            <button onClick={() => openWhatsApp()}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-white/15 text-white text-xs font-semibold font-sans hover:bg-white/25 transition-colors border border-white/20">
              Abrir WA
            </button>
          </div>

          {/* Date chip */}
          <div className="flex justify-center py-2 shrink-0" style={{ background: '#0d1520' }}>
            <span className="text-white/25 text-[0.62rem] font-sans px-3 py-0.5 rounded-full bg-white/4">
              Hoy · {fmt(new Date())}
            </span>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar"
            style={{ background: '#0d1520' }}>

            {messages.map(msg => (
              <div key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div
                  className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed font-sans"
                  style={{
                    background:  msg.from === 'bot'
                      ? 'rgba(255,255,255,0.07)'
                      : 'linear-gradient(135deg, #25D366, #1da855)',
                    color:       'rgba(255,255,255,0.88)',
                    borderBottomLeftRadius:  msg.from === 'bot'  ? '4px' : '16px',
                    borderBottomRightRadius: msg.from === 'user' ? '4px' : '16px',
                    border: msg.from === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <FormatText text={msg.text} />
                  <div className={`text-[0.55rem] mt-1.5 ${msg.from === 'bot' ? 'text-white/25' : 'text-white/50'}`}>
                    {fmt(msg.time)}
                  </div>
                </div>
              </div>
            ))}

            {/* Bot typing indicator */}
            {typing && (
              <div className="flex justify-start animate-fade-in">
                <div className="rounded-2xl rounded-bl px-4 py-3 border border-white/6"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Quick replies ── */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-t border-white/5"
            style={{ background: '#111820' }}>
            {quickReplies.map(qr => (
              <button key={qr} onClick={() => sendMessage(qr)}
                className="whitespace-nowrap text-[0.68rem] px-3 py-1.5 rounded-full font-sans font-medium border border-white/10 text-white/55 hover:border-green-500/40 hover:text-green-400 hover:bg-green-900/15 transition-all shrink-0">
                {qr}
              </button>
            ))}
          </div>

          {/* ── Input ── */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-white/5 shrink-0"
            style={{ background: '#111820' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
              placeholder="Escribe tu consulta..."
              className="flex-1 py-2.5 px-3.5 rounded-xl text-xs text-white placeholder:text-white/25 outline-none font-sans border border-white/8 transition-all focus:border-green-500/40"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
            {input.trim() ? (
              <button onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            ) : (
              <button onClick={() => openWhatsApp()}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 hover:scale-105 border border-white/10"
                style={{ background: 'rgba(37,211,102,0.12)' }}
                title="Abrir WhatsApp">
                <WhatsAppIcon size={16} color="#25D366" />
              </button>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center pb-2 shrink-0" style={{ background: '#111820' }}>
            <p className="text-white/15 text-[0.58rem] font-sans">
              Powered by LibrosMed · Respuesta instantánea
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function WhatsAppIcon({ size = 24, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}