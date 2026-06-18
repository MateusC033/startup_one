import { useNavigate } from 'react-router-dom'

const DECO_STARS = ['✦', '✧', '★', '✸', '✦', '◆', '✧', '★']

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-dvh bg-bg flex flex-col overflow-hidden">

      {/* Background decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pink/5 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-lavender/5 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-mint/5 blur-3xl" />

        {/* Floating stars */}
        {DECO_STARS.map((s, i) => (
          <span
            key={i}
            className="absolute text-yellow/20 font-display font-bold select-none"
            style={{
              top: `${8 + (i * 11) % 80}%`,
              left: `${4 + (i * 13) % 92}%`,
              fontSize: `${12 + (i % 4) * 6}px`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <div className="flex items-center gap-2">
          <span className="text-pink font-display font-bold text-xl">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-white/60 font-body text-sm hover:text-white transition-colors"
        >
          Entrar
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="text-pink text-xs">✦</span>
          <span className="font-body text-white/60 text-xs tracking-wide uppercase">Recomendação por estado emocional</span>
          <span className="text-yellow text-xs">✦</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-white leading-none tracking-tight mb-6 animate-fade-in"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          O filme certo<br />
          <span className="text-pink">para agora.</span>
        </h1>

        {/* Sub */}
        <p className="font-body text-white/50 text-lg max-w-md mb-12 animate-fade-in"
          style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          Responda 3 perguntas sobre como você está se sentindo.<br />
          Nós cuidamos do resto.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-in"
          style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary text-base"
          >
            Começar agora ✦
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="btn-ghost text-sm"
          >
            Já tenho conta
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center gap-6 animate-fade-in"
          style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          <Stat value="3" label="perguntas" color="text-mint" />
          <div className="w-px h-8 bg-border" />
          <Stat value="2" label="indicações" color="text-yellow" />
          <div className="w-px h-8 bg-border" />
          <Stat value="0" label="spoilers" color="text-lavender" />
        </div>
      </main>

      {/* Bottom color bar */}
      <div className="relative z-10 flex h-1 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>
    </div>
  )
}

function Stat({ value, label, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-display font-bold text-2xl ${color}`}>{value}</span>
      <span className="font-body text-white/40 text-xs uppercase tracking-wider">{label}</span>
    </div>
  )
}
