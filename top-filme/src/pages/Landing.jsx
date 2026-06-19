import { useNavigate } from 'react-router-dom'

/* Chuva de emojis no fundo */
const BG_EMOJIS = [
  { e:'🎬', size:110, top: 4,  left: 6,  rot:-18, op:0.18, dur:'7s',  del:'0s'   },
  { e:'⭐',  size:140, top: 2,  left:40,  rot: 22, op:0.12, dur:'9s',  del:'1.2s' },
  { e:'🍿',  size: 80, top:14,  left:78,  rot:  8, op:0.20, dur:'6s',  del:'0.4s' },
  { e:'🎭',  size: 96, top:62,  left: 4,  rot:-22, op:0.15, dur:'8s',  del:'2s'   },
  { e:'✨',  size: 72, top:70,  left:68,  rot: 32, op:0.22, dur:'5s',  del:'0.8s' },
  { e:'🎞️', size:100, top:38,  left:87,  rot: -6, op:0.14, dur:'7.5s',del:'1.6s' },
  { e:'🌟',  size: 64, top:86,  left:26,  rot: 14, op:0.20, dur:'6.5s',del:'0.2s' },
  { e:'🎪',  size: 76, top:18,  left:57,  rot:-28, op:0.13, dur:'8.5s',del:'3s'   },
  { e:'💫',  size:120, top:44,  left:22,  rot: 18, op:0.10, dur:'10s', del:'1s'   },
  { e:'🎠',  size: 88, top:78,  left:82,  rot:-12, op:0.12, dur:'7s',  del:'2.5s' },
  { e:'🌈',  size:108, top:56,  left:48,  rot:  4, op:0.08, dur:'9s',  del:'1.8s' },
  { e:'🎨',  size: 58, top:90,  left:53,  rot:-32, op:0.22, dur:'6s',  del:'0.6s' },
  { e:'🎯',  size: 68, top: 8,  left:24,  rot: 10, op:0.16, dur:'7.5s',del:'2.2s' },
  { e:'🎶',  size: 84, top:32,  left:91,  rot:-14, op:0.12, dur:'8s',  del:'0.9s' },
  { e:'💥',  size: 52, top:76,  left:14,  rot: 28, op:0.18, dur:'5.5s',del:'1.4s' },
  { e:'🦋',  size: 90, top:24,  left:14,  rot:-10, op:0.11, dur:'9.5s',del:'3.5s' },
  { e:'🎀',  size: 60, top:50,  left:35,  rot: 20, op:0.14, dur:'7s',  del:'0.5s' },
  { e:'💝',  size: 78, top:92,  left:72,  rot:-20, op:0.16, dur:'6.5s',del:'1.7s' },
  { e:'🌸',  size: 66, top:48,  left: 8,  rot: 15, op:0.13, dur:'8s',  del:'2.8s' },
  { e:'🎲',  size: 82, top:10,  left:92,  rot:-25, op:0.10, dur:'7.5s',del:'0.3s' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-dvh bg-bg flex flex-col overflow-hidden">

      {/* ── Blobs de cor animados ──────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-animate-1 absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-pink blur-[120px]" />
        <div className="blob-animate-2 absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-lavender blur-[100px]" />
        <div className="blob-animate-3 absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-mint blur-[110px]" />
        <div className="blob-animate-1 absolute top-1/4 left-1/2 w-[300px] h-[300px] rounded-full bg-yellow blur-[90px]"
          style={{ animationDelay: '3s' }} />
      </div>

      {/* ── Chuva de emojis ────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {BG_EMOJIS.map((item, i) => (
          <span
            key={i}
            className="emoji-bg"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              fontSize: `${item.size}px`,
              opacity: item.op,
              '--rot': `${item.rot}deg`,
              '--dur': item.dur,
              '--delay': item.del,
              animationDelay: item.del,
            }}
          >
            {item.e}
          </span>
        ))}
      </div>

      {/* ── Nav ───────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <div className="flex items-center gap-2">
          <span className="text-pink font-display font-bold text-2xl">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="font-body text-white/50 text-sm hover:text-white transition-colors
                     border border-border rounded-full px-4 py-1.5 hover:border-white/20 bg-bg/60 backdrop-blur-sm"
        >
          Entrar
        </button>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-10 text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 animate-fade-in
                     bg-surface/80 border border-border backdrop-blur-md"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
          <span className="font-body text-white/60 text-xs tracking-wide">
            Recomendação por estado emocional
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold leading-[0.92] tracking-tight mb-6 animate-fade-in"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7.5rem)',
            animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards',
          }}
        >
          <span className="text-white">O filme </span>
          <span className="text-mint">certo</span>
          <br />
          <span className="text-lavender">para agora.</span>
        </h1>

        {/* Sub */}
        <div
          className="max-w-md mb-10 animate-fade-in"
          style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <p className="font-display font-semibold text-white text-xl md:text-2xl mb-3 leading-snug">
            Encontre o filme certo para o seu momento.
          </p>
          <p className="font-body text-white/50 text-base leading-relaxed">
            Em poucos cliques, descobrimos o que combina com o que você está sentindo agora.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 items-center animate-fade-in"
          style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <button onClick={() => navigate('/auth')} className="btn-primary text-base px-10">
            Começar agora ✦
          </button>
          <button onClick={() => navigate('/auth')} className="btn-ghost text-sm">
            Já tenho conta
          </button>
        </div>
      </main>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center divide-x divide-border border-t border-border
                      bg-surface/60 backdrop-blur-sm px-6 py-4 md:px-12">
        {[
          { n: '5',       label: 'cliques',    color: 'text-mint'    },
          { n: '3',      label: 'indicações', color: 'text-yellow'  },
          { n: '100%',   label: 'gratuito',   color: 'text-lavender'},
          { n: '< 1min', label: 'de você',    color: 'text-pink'    },
        ].map(s => (
          <div key={s.label} className="flex-1 flex flex-col items-center gap-0.5 px-2">
            <span className={`font-display font-bold text-lg ${s.color}`}>{s.n}</span>
            <span className="font-body text-white/30 text-xs uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex h-1.5 w-full">
        <div className="flex-1 bg-pink" /><div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" /><div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>
    </div>
  )
}
