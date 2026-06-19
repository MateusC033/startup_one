import { useNavigate } from 'react-router-dom'

const mockHistory = [
  {
    id: 1, data: '17 Jun', hora: '21:42',
    estado: '😄', estadoLabel: 'Levinho',
    companhia: '👥 Amigos',
    filme: 'Se Beber, Não Case!',
    poster: 'https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63boQJs7rZkz5.jpg',
    cor: 'bg-yellow', corBorder: 'border-yellow/20', corText: 'text-yellow',
  },
  {
    id: 2, data: '14 Jun', hora: '19:15',
    estado: '🤔', estadoLabel: 'Curioso',
    companhia: '👤 Sozinho',
    filme: 'Parasita',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    cor: 'bg-mint', corBorder: 'border-mint/20', corText: 'text-mint',
  },
  {
    id: 3, data: '10 Jun', hora: '20:08',
    estado: '😢', estadoLabel: 'Sentir algo',
    companhia: '💑 Especial',
    filme: 'A Vida é Bela',
    poster: 'https://image.tmdb.org/t/p/w500/74hLDKjD5aGYOotO6esUVaeISa2.jpg',
    cor: 'bg-lavender', corBorder: 'border-lavender/20', corText: 'text-lavender',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const user = sessionStorage.getItem('tf_user') || 'Visitante'
  const initial = user[0].toUpperCase()

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
            Hora de encontrar<br /><span className="text-pink">o seu filme.</span>
          </h1>
        </div>

        {/* CTA destaque */}
        <button
          onClick={() => navigate('/quiz')}
          className="w-full relative overflow-hidden rounded-3xl p-0 group
                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-fade-in"
          style={{
            animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards',
            boxShadow: '0 8px 40px rgba(255,45,120,0.25)',
          }}
        >
          {/* Background com padrão */}
          <div className="absolute inset-0 bg-pink" />
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

          {/* Estrelas decorativas */}
          <span className="absolute top-3 right-8 text-white/15 font-display text-3xl select-none">✦</span>
          <span className="absolute bottom-3 right-24 text-white/10 font-display text-xl select-none">★</span>
          <span className="absolute top-1/2 right-16 -translate-y-1/2 text-white/10 font-display text-sm select-none">✧</span>

          <div className="relative z-10 flex items-center justify-between px-6 py-6">
            <div className="text-left">
              <p className="font-body text-white/70 text-xs uppercase tracking-[0.15em] mb-1">Nova análise</p>
              <p className="font-display font-bold text-white text-2xl">Iniciar jornada</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-body text-white/60 text-xs">3 perguntas</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="font-body text-white/60 text-xs">3 indicações</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="font-body text-white/60 text-xs">&lt; 1 min</span>
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
              { key:'rir',    label:'😄 Quero rir',       color:'bg-yellow/10 border-yellow/30 text-yellow' },
              { key:'sentir', label:'😢 Quero sentir',     color:'bg-lavender/10 border-lavender/30 text-lavender' },
              { key:'acao',   label:'⚡ Quero ação',       color:'bg-orange/10 border-orange/30 text-orange' },
              { key:'pensar', label:'🤔 Quero pensar',     color:'bg-mint/10 border-mint/30 text-mint' },
            ].map(m => (
              <button key={m.key}
                onClick={() => {
                  sessionStorage.setItem('tf_quick_mood', m.key)
                  navigate('/quiz')
                }}
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
            {mockHistory.map(item => <HistoryCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryCard({ item }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl bg-surface border ${item.corBorder}
                     hover:border-white/15 transition-all duration-200 group`}>
      {/* Poster mini */}
      <div className="relative flex-shrink-0">
        <img
          src={item.poster} alt={item.filme}
          className="w-9 h-14 object-cover rounded-lg"
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className={`absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full ${item.cor}
                         flex items-center justify-center text-[8px] shadow-sm`}>
          {item.estado}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-white text-sm truncate">{item.filme}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`font-body text-xs ${item.corText}`}>{item.estadoLabel}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="font-body text-white/35 text-xs">{item.companhia}</span>
        </div>
      </div>

      {/* Date */}
      <div className="flex-shrink-0 text-right">
        <p className="font-body text-white/30 text-xs">{item.data}</p>
        <p className="font-body text-white/20 text-xs">{item.hora}</p>
      </div>
    </div>
  )
}
