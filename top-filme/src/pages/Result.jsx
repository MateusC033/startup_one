import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../utils/recommend'

export default function Result() {
  const navigate = useNavigate()
  const [films, setFilms] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('tf_answers')
    if (!raw) { navigate('/quiz'); return }
    const answers = JSON.parse(raw)
    setFilms(getRecommendations(answers))
  }, [navigate])

  if (!films) return null

  const [main, alt] = films

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Top bar */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 md:px-12">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 group">
          <span className="text-pink font-display font-bold text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </button>
        <button
          onClick={() => navigate('/quiz')}
          className="btn-ghost text-xs py-2 px-4"
        >
          Nova análise
        </button>
      </header>

      <main className="flex-1 px-6 py-10 md:px-12 max-w-2xl mx-auto w-full">

        {/* Intro */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow text-xs">✦</span>
            <span className="font-body text-white/40 text-xs uppercase tracking-widest">Resultado da sua análise</span>
          </div>
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight">
            Para o seu<br /><span className="text-pink">momento de agora.</span>
          </h1>
        </div>

        {/* Main recommendation */}
        <div
          className="card-surface overflow-hidden mb-4 animate-fade-in"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {/* Pink accent bar */}
          <div className="h-1 bg-pink w-full" />

          <div className="flex gap-5 p-5">
            {/* Poster */}
            <div className="relative flex-shrink-0">
              <img
                src={main.poster}
                alt={main.titulo}
                className="w-28 md:w-36 rounded-xl object-cover"
                style={{ aspectRatio: '2/3' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div
                className="w-28 md:w-36 rounded-xl bg-surface2 items-center justify-center text-4xl hidden"
                style={{ aspectRatio: '2/3', display: 'none' }}
              >
                🎬
              </div>
              {/* "Principal" badge */}
              <div className="absolute -top-2 -right-2 bg-pink rounded-full px-2 py-0.5">
                <span className="font-display font-bold text-white text-xs">✦ 1</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <h2 className="font-display font-bold text-white text-xl leading-tight mb-1">
                  {main.titulo}
                </h2>
                <p className="font-body italic text-white/50 text-sm mb-3">
                  "{main.tagline}"
                </p>
                <div className="flex items-start gap-2">
                  <span className="text-pink text-xs mt-0.5 flex-shrink-0">✦</span>
                  <p className="font-body text-white/70 text-sm leading-relaxed">
                    {main.porQueAgora}
                  </p>
                </div>
              </div>

              {/* Attribute chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <VectorChips movie={main} />
              </div>
            </div>
          </div>
        </div>

        {/* Alternative recommendation */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/30 text-xs">✧</span>
            <span className="font-body text-white/30 text-xs uppercase tracking-widest">Caso já tenha visto</span>
          </div>

          <div className="card-surface overflow-hidden">
            <div className="h-1 bg-lavender w-full" />
            <div className="flex items-center gap-4 p-4">
              <div className="relative flex-shrink-0">
                <img
                  src={alt.poster}
                  alt={alt.titulo}
                  className="w-16 rounded-lg object-cover"
                  style={{ aspectRatio: '2/3' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div className="absolute -top-1.5 -right-1.5 bg-lavender rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-xs">2</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-white text-base mb-0.5">{alt.titulo}</h3>
                <p className="font-body text-white/40 text-xs italic">"{alt.tagline}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in"
          style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <button
            onClick={() => { sessionStorage.removeItem('tf_answers'); navigate('/quiz') }}
            className="btn-primary flex-1 text-center"
          >
            Nova análise ✦
          </button>
          <button
            onClick={() => navigate('/home')}
            className="btn-ghost flex-1 text-center"
          >
            Ir para o início
          </button>
        </div>
      </main>
    </div>
  )
}

const TOP_ATTRS = [
  { key: 'humor',     label: '😄 Humor',     color: 'border-yellow/40 text-yellow/80' },
  { key: 'emocional', label: '😢 Emocional', color: 'border-lavender/40 text-lavender/80' },
  { key: 'acao',      label: '⚡ Ação',       color: 'border-orange/40 text-orange/80' },
  { key: 'reflexivo', label: '🤔 Reflexivo',  color: 'border-mint/40 text-mint/80' },
  { key: 'social',    label: '👥 Social',     color: 'border-sky/40 text-sky/80' },
  { key: 'atencao',   label: '🎯 Atenção',    color: 'border-pink/40 text-pink/80' },
]

function VectorChips({ movie }) {
  const top = TOP_ATTRS
    .filter(a => movie[a.key] >= 0.6)
    .sort((a, b) => movie[b.key] - movie[a.key])
    .slice(0, 3)

  return top.map(a => (
    <span
      key={a.key}
      className={`font-body text-xs border rounded-full px-2.5 py-1 ${a.color}`}
    >
      {a.label}
    </span>
  ))
}
