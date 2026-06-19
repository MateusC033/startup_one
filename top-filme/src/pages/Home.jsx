import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const T = 'https://image.tmdb.org/t/p/w500'

const mockHistory = [
  {
    id: 1, data: 'Hoje', hora: '21:42',
    estado: '😄', estadoLabel: 'Levinho',
    companhia: '👥 Amigos', destino: 'Animado', mundo: 'Épico',
    filme: 'Se Beber, Não Case!',
    poster: `${T}/m0tQyMdp3fy5ooUOQkJMd1fQKBJ.jpg`,
    cor: 'bg-yellow', corBorder: 'border-yellow/25', corText: 'text-yellow',
  },
  {
    id: 2, data: 'Ontem', hora: '19:15',
    estado: '🤔', estadoLabel: 'Curioso',
    companhia: '👤 Sozinho', destino: 'Pensativo', mundo: 'Surpresas',
    filme: 'Parasita',
    poster: `${T}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    cor: 'bg-mint', corBorder: 'border-mint/25', corText: 'text-mint',
  },
  {
    id: 3, data: '15 Jun', hora: '20:08',
    estado: '😢', estadoLabel: 'Sentir algo',
    companhia: '💑 Especial', destino: 'Aliviado', mundo: 'Íntimo',
    filme: 'La La Land',
    poster: `${T}/AvMietG6xuobpSSdmVnKuTjv4bL.jpg`,
    cor: 'bg-lavender', corBorder: 'border-lavender/25', corText: 'text-lavender',
  },
  {
    id: 4, data: '12 Jun', hora: '22:00',
    estado: '⚡', estadoLabel: 'Agitado',
    companhia: '👥 Amigos', destino: 'Inspirado', mundo: 'Épico',
    filme: 'Vingadores: Ultimato',
    poster: `${T}/9fRX8UKlIW7Lb9GqNsJVakWWFCi.jpg`,
    cor: 'bg-orange', corBorder: 'border-orange/25', corText: 'text-orange',
  },
  {
    id: 5, data: '8 Jun', hora: '18:30',
    estado: '😄', estadoLabel: 'Levinho',
    companhia: '👨‍👩‍👧 Família', destino: 'Aliviado', mundo: 'Real',
    filme: 'Shrek',
    poster: `${T}/wxeqfC221YMptRRdzxlijAh7q8l.jpg`,
    cor: 'bg-yellow', corBorder: 'border-yellow/25', corText: 'text-yellow',
  },
  {
    id: 6, data: '3 Jun', hora: '21:10',
    estado: '😢', estadoLabel: 'Sentir algo',
    companhia: '👤 Sozinho', destino: 'Pensativo', mundo: 'Real',
    filme: 'Forrest Gump',
    poster: `${T}/d74WpIsH8379TIL4wUxDneRCYv2.jpg`,
    cor: 'bg-pink', corBorder: 'border-pink/25', corText: 'text-pink',
  },
]

const PAGE_SIZE = 3

function HistoryCard({ item }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`flex items-center gap-4 p-3 rounded-2xl bg-surface border ${item.corBorder}
                     hover:border-white/20 transition-all duration-200 group cursor-default`}>
      {/* Poster */}
      <div className="relative flex-shrink-0">
        {!imgError ? (
          <img
            src={item.poster} alt={item.filme}
            className="w-16 h-24 object-cover rounded-xl"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-16 h-24 rounded-xl bg-surface2 flex flex-col items-center justify-center gap-1">
            <span className="text-3xl">🎬</span>
          </div>
        )}
        <div className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full ${item.cor}
                         flex items-center justify-center text-xs shadow-md border-2 border-bg`}>
          {item.estado}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-white text-sm leading-tight truncate mb-1">{item.filme}</p>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span className={`font-body text-xs ${item.corText}`}>{item.estadoLabel}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="font-body text-white/35 text-xs">{item.companhia}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className={`font-body text-[10px] border ${item.corBorder} ${item.corText} rounded-full px-2 py-0.5`}>
            {item.destino}
          </span>
          <span className="font-body text-[10px] border border-border text-white/30 rounded-full px-2 py-0.5">
            {item.mundo}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="flex-shrink-0 text-right">
        <p className="font-body text-white/40 text-xs font-medium">{item.data}</p>
        <p className="font-body text-white/20 text-xs mt-0.5">{item.hora}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [histPage, setHistPage] = useState(0)
  const user = sessionStorage.getItem('tf_user') || 'Visitante'
  const initial = user[0].toUpperCase()

  const totalPages = Math.ceil(mockHistory.length / PAGE_SIZE)
  const visibleHistory = mockHistory.slice(histPage * PAGE_SIZE, (histPage + 1) * PAGE_SIZE)

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Top bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 md:px-10 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-pink font-display font-bold text-xl">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5">
            <span className="text-white/30 text-xs font-body">Bem-vindo,</span>
            <span className="text-white text-xs font-body font-medium">{user}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-pink flex items-center justify-center shadow-[0_0_12px_rgba(255,45,120,0.4)]">
            <span className="font-display font-bold text-white text-xs">{initial}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 py-6 md:px-10 max-w-2xl mx-auto w-full space-y-6">

        {/* Saudação */}
        <div className="animate-fade-in">
          <p className="font-body text-white/30 text-sm mb-0.5 flex items-center gap-2">
            <span className="w-4 h-px bg-border" />
            Como você está hoje?
          </p>
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight">
            Hora de encontrar<br /><span className="text-lavender">o seu filme.</span>
          </h1>
        </div>

        {/* CTA destaque */}
        <button
          onClick={() => navigate('/quiz')}
          className="w-full relative overflow-hidden rounded-3xl p-0 group
                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-fade-in"
          style={{
            animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards',
            boxShadow: '0 8px 40px rgba(0,222,182,0.2)',
          }}
        >
          <div className="absolute inset-0 bg-mint" />
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}
                className="absolute rounded-full border border-white"
                style={{
                  width: `${80 + i * 50}px`, height: `${80 + i * 50}px`,
                  right: `-${20 + i * 25}px`, top: '50%',
                  transform: 'translateY(-50%)',
                }} />
            ))}
          </div>
          <span className="absolute top-3 right-8 text-white/15 font-display text-3xl select-none">✦</span>
          <span className="absolute bottom-3 right-24 text-white/10 font-display text-xl select-none">★</span>
          <span className="absolute top-1/2 right-16 -translate-y-1/2 text-white/10 font-display text-sm select-none">✧</span>

          <div className="relative z-10 flex items-center justify-between px-6 py-6">
            <div className="text-left">
              <p className="font-body text-white/70 text-xs uppercase tracking-[0.15em] mb-1">Nova análise</p>
              <p className="font-display font-bold text-white text-2xl">Iniciar jornada</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-body text-white/60 text-xs">5 perguntas</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="font-body text-white/60 text-xs">3 indicações</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="font-body text-white/60 text-xs">&lt; 2 min</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20
                            flex items-center justify-center group-hover:bg-white/25 transition-colors flex-shrink-0">
              <span className="text-white text-xl font-display font-bold">→</span>
            </div>
          </div>
        </button>

        {/* Mood chips rápidos */}
        <div className="animate-fade-in" style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="font-body text-white/30 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="text-yellow text-xs">✦</span> Humor rápido
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { key:'rir',    label:'😄 Quero rir',    color:'bg-yellow/10 border-yellow/30 text-yellow'   },
              { key:'sentir', label:'😢 Quero sentir',  color:'bg-lavender/10 border-lavender/30 text-lavender' },
              { key:'acao',   label:'⚡ Quero ação',    color:'bg-orange/10 border-orange/30 text-orange'   },
              { key:'pensar', label:'🤔 Quero pensar',  color:'bg-mint/10 border-mint/30 text-mint'         },
            ].map(m => (
              <button key={m.key}
                onClick={() => { sessionStorage.setItem('tf_quick_mood', m.key); navigate('/quiz') }}
                className={`font-body text-xs border rounded-full px-3 py-1.5 transition-all
                            hover:scale-105 active:scale-95 ${m.color}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Histórico */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="font-body text-white/30 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="text-pink text-xs">✦</span> Análises recentes
          </p>
          <div className="space-y-2">
            {visibleHistory.map(item => <HistoryCard key={item.id} item={item} />)}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setHistPage(p => Math.max(0, p - 1))}
                disabled={histPage === 0}
                className="font-body text-xs text-white/70 bg-surface border border-border
                           rounded-xl px-3 py-1.5 hover:border-white/30 hover:text-white
                           transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHistPage(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === histPage ? 'w-5 h-2 bg-lavender' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setHistPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={histPage === totalPages - 1}
                className="font-body text-xs text-white/70 bg-surface border border-border
                           rounded-xl px-3 py-1.5 hover:border-white/30 hover:text-white
                           transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próximo →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
