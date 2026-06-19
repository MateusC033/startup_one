import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../utils/recommend'

/* ─── Poster com reset de erro ao trocar de filme ─────────────── */
function Poster({ src, alt, className, style }) {
  const [error, setError] = useState(false)

  useEffect(() => { setError(false) }, [src])   // ← fix: reseta ao trocar filme

  if (error) {
    return (
      <div className={`${className} bg-surface2 flex flex-col items-center justify-center gap-2`} style={style}>
        <span className="text-5xl">🎬</span>
        <span className="font-display font-bold text-white/20 text-xs text-center px-2 line-clamp-2">{alt}</span>
      </div>
    )
  }
  return (
    <img
      src={src} alt={alt}
      className={className} style={style}
      onError={() => setError(true)}
    />
  )
}

/* ─── Chips de atributos ──────────────────────────────────────── */
const ATTRS = [
  { key:'humor',     label:'Humor',     cls:'bg-yellow/15 text-yellow border-yellow/30'   },
  { key:'emocional', label:'Emocional', cls:'bg-lavender/15 text-lavender border-lavender/30' },
  { key:'acao',      label:'Ação',      cls:'bg-orange/15 text-orange border-orange/30'   },
  { key:'reflexivo', label:'Reflexivo', cls:'bg-mint/15 text-mint border-mint/30'         },
  { key:'social',    label:'Social',    cls:'bg-sky/15 text-sky border-sky/30'             },
  { key:'atencao',   label:'Atenção',   cls:'bg-pink/15 text-pink border-pink/30'          },
]
function Chips({ movie }) {
  return ATTRS
    .filter(a => movie[a.key] >= 0.6)
    .sort((a, b) => movie[b.key] - movie[a.key])
    .slice(0, 3)
    .map(a => (
      <span key={a.key} className={`font-body text-xs border rounded-full px-3 py-1 ${a.cls}`}>
        {a.label}
      </span>
    ))
}

/* ─── Card central ────────────────────────────────────────────── */
function CenterCard({ film, fading }) {
  return (
    <div
      className="rounded-3xl overflow-hidden border border-pink/30 bg-surface transition-opacity duration-200"
      style={{
        opacity: fading ? 0 : 1,
        boxShadow: fading ? 'none' : '0 0 40px rgba(255,45,120,0.15)',
      }}
    >
      <div className="h-1.5 w-full bg-pink" />

      {/* Poster widescreen */}
      <div className="relative">
        <Poster
          src={film.poster} alt={film.titulo}
          className="w-full object-cover"
          style={{ aspectRatio: '2/3', maxHeight: '320px', objectFit: 'cover', objectPosition: 'top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        <div className="absolute top-3 left-3 bg-pink rounded-full px-3 py-1">
          <span className="text-white font-display font-bold text-xs">✦ Principal</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h2 className="font-display font-bold text-white text-xl leading-tight mb-1">{film.titulo}</h2>
        <p className="font-body italic text-white/40 text-xs mb-4">"{film.tagline}"</p>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-surface2 mb-4">
          <span className="text-pink text-sm mt-0.5 flex-shrink-0">✦</span>
          <p className="font-body text-white/70 text-sm leading-relaxed">{film.porQueAgora}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chips movie={film} />
        </div>
      </div>
    </div>
  )
}

/* ─── Card lateral ────────────────────────────────────────────── */
function SideCard({ film, onClick, fading, accentClass }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl overflow-hidden border border-border bg-surface
                 transition-all duration-200 hover:border-white/20 hover:scale-[1.03]
                 active:scale-[0.97] cursor-pointer text-left"
      style={{ opacity: fading ? 0 : 0.75, transition: 'opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease' }}
    >
      <div className={`h-1 w-full ${accentClass}`} />
      <Poster
        src={film.poster} alt={film.titulo}
        className="w-full object-cover"
        style={{ aspectRatio: '2/3', objectFit: 'cover', objectPosition: 'top' }}
      />
      <div className="p-3">
        <p className="font-display font-semibold text-white/80 text-xs leading-tight line-clamp-2 mb-1">
          {film.titulo}
        </p>
        <p className="font-body text-white/30 text-xs flex items-center gap-1">
          <span>clique</span><span>→</span>
        </p>
      </div>
    </button>
  )
}

/* ─── Página ──────────────────────────────────────────────────── */
export default function Result() {
  const navigate = useNavigate()
  const [films, setFilms] = useState(null)
  const [centerIdx, setCenterIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const locked = useRef(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('tf_answers')
    if (!raw) { navigate('/quiz'); return }
    setFilms(getRecommendations(JSON.parse(raw)))
  }, [navigate])

  if (!films) return null

  const leftIdx   = (centerIdx - 1 + 3) % 3
  const rightIdx  = (centerIdx + 1) % 3

  const rotate = (dir) => {
    if (locked.current) return
    locked.current = true
    setFading(true)
    setTimeout(() => {
      setCenterIdx(i => dir === 'right' ? (i + 1) % 3 : (i - 1 + 3) % 3)
      setFading(false)
      setTimeout(() => { locked.current = false }, 250)
    }, 200)
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Top bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-pink" /><div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" /><div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 md:px-10">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 group">
          <span className="text-pink font-display font-bold text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </button>
        <button
          onClick={() => { sessionStorage.removeItem('tf_answers'); navigate('/quiz') }}
          className="btn-ghost text-xs py-2 px-4"
        >
          Nova análise
        </button>
      </header>

      <main className="flex-1 px-4 pt-6 pb-10 md:px-8 flex flex-col">

        {/* Heading */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-3">
            <span className="text-yellow text-xs">✦</span>
            <span className="font-body text-white/40 text-xs uppercase tracking-widest">Para o seu momento</span>
            <span className="text-yellow text-xs">✦</span>
          </div>
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight">
            Suas <span className="text-pink">indicações</span>
          </h1>
          <p className="font-body text-white/30 text-sm mt-1">
            Toque nas laterais para explorar
          </p>
        </div>

        {/* Carrossel 3 cards */}
        <div className="flex items-center gap-3 md:gap-4 w-full max-w-xl mx-auto">

          {/* Esquerdo — ~72% do centro */}
          <div className="w-[29%] flex-shrink-0">
            <SideCard
              film={films[leftIdx]}
              onClick={() => rotate('left')}
              fading={fading}
              accentClass="bg-lavender"
            />
          </div>

          {/* Centro */}
          <div className="flex-1 min-w-0">
            <CenterCard film={films[centerIdx]} fading={fading} />
          </div>

          {/* Direito — ~72% do centro */}
          <div className="w-[29%] flex-shrink-0">
            <SideCard
              film={films[rightIdx]}
              onClick={() => rotate('right')}
              fading={fading}
              accentClass="bg-yellow"
            />
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {films.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === centerIdx || locked.current) return
                rotate(i === rightIdx ? 'right' : 'left')
              }}
              className={`rounded-full transition-all duration-300 ${
                i === centerIdx ? 'w-6 h-2 bg-pink' : 'w-2 h-2 bg-surface2 hover:bg-muted'
              }`}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto w-full">
          <button
            onClick={() => { sessionStorage.removeItem('tf_answers'); navigate('/quiz') }}
            className="btn-primary flex-1 text-center"
          >
            Nova análise ✦
          </button>
          <button onClick={() => navigate('/home')} className="btn-ghost flex-1 text-center">
            Início
          </button>
        </div>
      </main>
    </div>
  )
}
