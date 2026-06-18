import { useNavigate } from 'react-router-dom'

const mockHistory = [
  {
    id: 1,
    data: '17 Jun',
    estado: '😄 Levinho',
    companhia: '👥 Com amigos',
    filme: 'Se Beber, Não Case!',
    poster: 'https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63boQJs7rZkz5.jpg',
    cor: 'bg-yellow',
  },
  {
    id: 2,
    data: '14 Jun',
    estado: '🤔 Curioso',
    companhia: '👤 Sozinho',
    filme: 'Parasita',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    cor: 'bg-mint',
  },
  {
    id: 3,
    data: '10 Jun',
    estado: '😢 Sentir algo',
    companhia: '💑 Com alguém especial',
    filme: 'A Vida é Bela',
    poster: 'https://image.tmdb.org/t/p/w500/74hLDKjD5aGYOotO6esUVaeISa2.jpg',
    cor: 'bg-lavender',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const user = sessionStorage.getItem('tf_user') || 'Visitante'

  return (
    <div className="min-h-dvh bg-bg">

      {/* Top bar */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-pink font-display font-bold text-xl">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pink/20 border border-pink/30 flex items-center justify-center">
            <span className="font-display font-bold text-pink text-xs">{user[0].toUpperCase()}</span>
          </div>
          <span className="font-body text-white/60 text-sm hidden sm:block">{user}</span>
        </div>
      </header>

      <main className="px-6 pb-12 md:px-12 max-w-2xl mx-auto">

        {/* Greeting */}
        <div className="mb-10 animate-fade-in">
          <p className="font-body text-white/40 text-sm mb-1">Boa tarde ✦</p>
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight">
            O que você quer<br /><span className="text-pink">sentir hoje?</span>
          </h1>
        </div>

        {/* CTA principal */}
        <button
          onClick={() => navigate('/quiz')}
          className="w-full relative overflow-hidden bg-pink rounded-3xl p-6 mb-10
                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                     shadow-[0_8px_32px_rgba(255,45,120,0.3)] animate-fade-in group"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {/* Deco stars */}
          <span className="absolute top-4 right-6 text-white/20 font-display text-2xl select-none">✦</span>
          <span className="absolute bottom-4 right-16 text-white/10 font-display text-xl select-none">★</span>
          <span className="absolute top-8 right-24 text-white/15 font-display text-lg select-none">✧</span>

          <div className="relative z-10 flex items-center justify-between">
            <div className="text-left">
              <p className="font-body text-white/70 text-sm mb-1 uppercase tracking-widest">Nova análise</p>
              <p className="font-display font-bold text-white text-2xl">Iniciar jornada ✦</p>
              <p className="font-body text-white/60 text-sm mt-1">3 perguntas · 2 indicações</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center
                            group-hover:bg-white/20 transition-colors">
              <span className="text-white text-xl">→</span>
            </div>
          </div>
        </button>

        {/* Histórico */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow text-xs">✦</span>
            <h2 className="font-display font-semibold text-white/70 text-sm uppercase tracking-widest">Histórico</h2>
          </div>

          <div className="space-y-3">
            {mockHistory.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function HistoryCard({ item }) {
  return (
    <div className="card-surface flex items-center gap-4 p-4 hover:border-white/10 transition-colors">
      {/* Color accent */}
      <div className={`w-1 self-stretch rounded-full ${item.cor}`} />

      {/* Poster */}
      <img
        src={item.poster}
        alt={item.filme}
        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
        onError={e => { e.target.style.display = 'none' }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-white text-sm truncate">{item.filme}</p>
        <p className="font-body text-white/40 text-xs mt-0.5">
          {item.estado} · {item.companhia}
        </p>
      </div>

      {/* Date */}
      <span className="font-body text-white/30 text-xs flex-shrink-0">{item.data}</span>
    </div>
  )
}
