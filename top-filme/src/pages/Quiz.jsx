import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    id: 'q1',
    pergunta: 'Como você está se sentindo agora?',
    hint: 'Seja honesto — é pra isso que serve',
    options: [
      {
        key: 'rir',
        emoji: '😄',
        texto: 'Levinho, quero rir',
        sub: 'Modo descanso ativado',
        bg: 'bg-yellow',
        hover: 'hover:bg-yellow hover:border-yellow',
        text: 'text-yellow',
        glow: 'hover:shadow-[0_0_24px_rgba(255,229,102,0.3)]',
      },
      {
        key: 'sentir',
        emoji: '😢',
        texto: 'Com vontade de sentir algo',
        sub: 'Deixa rolar uma lágrima',
        bg: 'bg-lavender',
        hover: 'hover:bg-lavender hover:border-lavender',
        text: 'text-lavender',
        glow: 'hover:shadow-[0_0_24px_rgba(180,144,255,0.3)]',
      },
      {
        key: 'acao',
        emoji: '⚡',
        texto: 'Agitado, quero ação',
        sub: 'Adrenalina na veia',
        bg: 'bg-orange',
        hover: 'hover:bg-orange hover:border-orange',
        text: 'text-orange',
        glow: 'hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]',
      },
      {
        key: 'pensar',
        emoji: '🤔',
        texto: 'Curioso, quero pensar',
        sub: 'Mente em modo exploração',
        bg: 'bg-mint',
        hover: 'hover:bg-mint hover:border-mint',
        text: 'text-mint',
        glow: 'hover:shadow-[0_0_24px_rgba(0,222,182,0.3)]',
      },
    ],
  },
  {
    id: 'q2',
    pergunta: 'Vai assistir com quem?',
    hint: 'O contexto muda tudo',
    options: [
      {
        key: 'sozinho',
        emoji: '👤',
        texto: 'Sozinho',
        sub: 'Liberdade total de escolha',
        bg: 'bg-lavender',
        hover: 'hover:bg-lavender hover:border-lavender',
        text: 'text-lavender',
        glow: 'hover:shadow-[0_0_24px_rgba(180,144,255,0.3)]',
      },
      {
        key: 'especial',
        emoji: '💑',
        texto: 'Com alguém especial',
        sub: 'Noite perfeita para dois',
        bg: 'bg-pink',
        hover: 'hover:bg-pink hover:border-pink',
        text: 'text-pink',
        glow: 'hover:shadow-[0_0_24px_rgba(255,45,120,0.3)]',
      },
      {
        key: 'amigos',
        emoji: '👥',
        texto: 'Com amigos',
        sub: 'Quanto mais, melhor',
        bg: 'bg-yellow',
        hover: 'hover:bg-yellow hover:border-yellow',
        text: 'text-yellow',
        glow: 'hover:shadow-[0_0_24px_rgba(255,229,102,0.3)]',
      },
      {
        key: 'familia',
        emoji: '👨‍👩‍👧',
        texto: 'Com a família',
        sub: 'Para todas as idades',
        bg: 'bg-mint',
        hover: 'hover:bg-mint hover:border-mint',
        text: 'text-mint',
        glow: 'hover:shadow-[0_0_24px_rgba(0,222,182,0.3)]',
      },
    ],
  },
  {
    id: 'q3',
    pergunta: 'Quanto você consegue se concentrar hoje?',
    hint: 'Sem julgamento — relaxar também é válido',
    options: [
      {
        key: 'relaxar',
        emoji: '🛋️',
        texto: 'Pouco — só quero relaxar',
        sub: 'Modo cobertor ativado',
        bg: 'bg-mint',
        hover: 'hover:bg-mint hover:border-mint',
        text: 'text-mint',
        glow: 'hover:shadow-[0_0_24px_rgba(0,222,182,0.3)]',
      },
      {
        key: 'medio',
        emoji: '😊',
        texto: 'Médio — me envolvo sem esforço',
        sub: 'No flow certo',
        bg: 'bg-yellow',
        hover: 'hover:bg-yellow hover:border-yellow',
        text: 'text-yellow',
        glow: 'hover:shadow-[0_0_24px_rgba(255,229,102,0.3)]',
      },
      {
        key: 'intenso',
        emoji: '🎯',
        texto: 'Total — pode ser intenso',
        sub: 'Traz o difícil',
        bg: 'bg-pink',
        hover: 'hover:bg-pink hover:border-pink',
        text: 'text-pink',
        glow: 'hover:shadow-[0_0_24px_rgba(255,45,120,0.3)]',
      },
    ],
  },
  {
    id: 'q4',
    pergunta: 'Como quer se sentir quando o filme acabar?',
    hint: 'O destino emocional importa',
    options: [
      {
        key: 'inspirado',
        emoji: '✨',
        texto: 'Inspirado e motivado',
        sub: 'Carregado de energia',
        bg: 'bg-mint',
        hover: 'hover:bg-mint hover:border-mint',
        text: 'text-mint',
        glow: 'hover:shadow-[0_0_24px_rgba(0,222,182,0.3)]',
      },
      {
        key: 'aliviado',
        emoji: '😌',
        texto: 'Leve e aliviado',
        sub: 'Sem peso no coração',
        bg: 'bg-lavender',
        hover: 'hover:bg-lavender hover:border-lavender',
        text: 'text-lavender',
        glow: 'hover:shadow-[0_0_24px_rgba(180,144,255,0.3)]',
      },
      {
        key: 'pensativo',
        emoji: '🌀',
        texto: 'Pensativo e reflexivo',
        sub: 'Com muito o que mastigar',
        bg: 'bg-pink',
        hover: 'hover:bg-pink hover:border-pink',
        text: 'text-pink',
        glow: 'hover:shadow-[0_0_24px_rgba(255,45,120,0.3)]',
      },
      {
        key: 'animado',
        emoji: '😂',
        texto: 'Bem-humorado e animado',
        sub: 'Rindo até o final',
        bg: 'bg-yellow',
        hover: 'hover:bg-yellow hover:border-yellow',
        text: 'text-yellow',
        glow: 'hover:shadow-[0_0_24px_rgba(255,229,102,0.3)]',
      },
    ],
  },
  {
    id: 'q5',
    pergunta: 'Que tipo de mundo você quer entrar?',
    hint: 'Cada filme é uma porta',
    options: [
      {
        key: 'real',
        emoji: '🌍',
        texto: 'Real e humano',
        sub: 'Histórias que tocam a vida',
        bg: 'bg-lavender',
        hover: 'hover:bg-lavender hover:border-lavender',
        text: 'text-lavender',
        glow: 'hover:shadow-[0_0_24px_rgba(180,144,255,0.3)]',
      },
      {
        key: 'epico',
        emoji: '🚀',
        texto: 'Épico e grandioso',
        sub: 'Aventuras maiores que tudo',
        bg: 'bg-orange',
        hover: 'hover:bg-orange hover:border-orange',
        text: 'text-orange',
        glow: 'hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]',
      },
      {
        key: 'intimo',
        emoji: '💭',
        texto: 'Íntimo e delicado',
        sub: 'Sentimentos em close',
        bg: 'bg-pink',
        hover: 'hover:bg-pink hover:border-pink',
        text: 'text-pink',
        glow: 'hover:shadow-[0_0_24px_rgba(255,45,120,0.3)]',
      },
      {
        key: 'surpresa',
        emoji: '🎭',
        texto: 'Cheio de surpresas',
        sub: 'Não sei o que esperar',
        bg: 'bg-mint',
        hover: 'hover:bg-mint hover:border-mint',
        text: 'text-mint',
        glow: 'hover:shadow-[0_0_24px_rgba(0,222,182,0.3)]',
      },
    ],
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [animState, setAnimState] = useState('in')
  const [selected, setSelected] = useState(null)

  const current = QUESTIONS[step]

  const handleSelect = (key) => {
    if (selected) return
    setSelected(key)
    setTimeout(() => {
      setAnimState('out')
      setTimeout(() => {
        const newAnswers = [...answers, key]
        setAnswers(newAnswers)
        setSelected(null)
        if (step < QUESTIONS.length - 1) {
          setStep(s => s + 1)
          setAnimState('in')
        } else {
          sessionStorage.setItem('tf_answers', JSON.stringify(newAnswers))
          navigate('/result')
        }
      }, 280)
    }, 180)
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Barra de progresso */}
      <div className="h-1.5 w-full bg-surface2">
        <div
          className="h-full bg-pink transition-all duration-600 ease-out"
          style={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 md:px-10">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 group">
          <span className="text-pink font-display font-bold text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </button>

        {/* Step bubbles */}
        <div className="flex items-center gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-400 ${
              i < step  ? 'w-5 h-2 bg-pink' :
              i === step ? 'w-7 h-2 bg-pink' :
              'w-2 h-2 bg-surface2'}`} />
          ))}
          <span className="ml-2 font-body text-white/25 text-xs">{step + 1}/{QUESTIONS.length}</span>
        </div>
      </header>

      {/* Conteúdo da pergunta */}
      <main className="flex-1 flex flex-col justify-center px-5 pb-8 pt-4 md:px-10">
        <div
          key={step}
          className={`w-full max-w-lg mx-auto ${animState === 'in' ? 'animate-slide-in' : 'animate-slide-out'}`}
        >
          {/* Pergunta */}
          <div className="mb-8">
            <p className="font-body text-white/30 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="text-yellow">✦</span> {current.hint}
            </p>
            <h2 className="font-display font-bold text-white text-2xl md:text-3xl leading-tight">
              {current.pergunta}
            </h2>
          </div>

          {/* Cards de opção */}
          <div className={`grid gap-3 ${current.options.length === 3 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {current.options.map((opt, i) => {
              const isSelected = selected === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  disabled={!!selected}
                  className={`
                    relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl
                    border border-border text-left transition-all duration-200
                    ${opt.hover} ${opt.glow}
                    ${isSelected
                      ? `${opt.bg} border-transparent scale-[0.97]`
                      : 'bg-surface hover:scale-[1.02] active:scale-[0.97] hover:border-transparent'}
                    ${selected && !isSelected ? 'opacity-40' : ''}
                  `}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Emoji em círculo colorido */}
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl
                    transition-all duration-200
                    ${isSelected ? 'bg-white/20' : `bg-surface2 ${opt.text} group-hover:bg-white/10`}`}>
                    {opt.emoji}
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-display font-semibold text-sm leading-tight transition-colors
                      ${isSelected ? 'text-white' : 'text-white/80'}`}>
                      {opt.texto}
                    </p>
                    <p className={`font-body text-xs mt-0.5 transition-colors
                      ${isSelected ? 'text-white/70' : 'text-white/30'}`}>
                      {opt.sub}
                    </p>
                  </div>

                  {/* Check mark */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}

                  {/* Shine decorativo no hover */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>
    </div>
  )
}
