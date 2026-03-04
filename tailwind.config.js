/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"','Georgia','serif'],
        sans: ['"DM Sans"','system-ui','sans-serif'],
      },
      colors: {
        obsidian: {
          DEFAULT:'#080c10',
          50:'#0d1218',
          100:'#111820',
          200:'#192130',
          300:'#1e2a3d'
        },
        gold: {
          DEFAULT:'#d4a853',
          warm:'#e8c07a',
          pale:'#f5e6c3',
          faint:'#fdf8ee'
        },
        slate: {
          ink:'#1a2332',
          mist:'#8fa3b8',
          frost:'#c8d8e8'
        },
        ivory: {
          DEFAULT:'#f8f5ef',
          warm:'#f0ead8'
        },
      },
      boxShadow: {
        'glow-gold':'0 0 40px rgba(212,168,83,0.25), 0 0 80px rgba(212,168,83,0.1)',
        'glow-sm':'0 0 20px rgba(212,168,83,0.18)',
        'card':'0 4px 24px rgba(0,0,0,0.45)',
        'card-hover':'0 24px 64px rgba(0,0,0,0.65), 0 4px 20px rgba(0,0,0,0.4)',
        'inner-top':'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}