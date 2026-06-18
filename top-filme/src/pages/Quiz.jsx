import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    id: 'q1',
    pergunta: 'Como você está se sentindo agora?',
    options: [
      { key: 'rir',    emoji: '😄', texto: 'Levinho, quero rir',         cor: 'hover:bg-yellow/10 hover:border-yellow/50', accent: 'text-yellow' },
      { key: 'sentir', emoji: '😢', texto: 'Com vontade de sentir algo',  cor: 'hover:bg-lavender/10 hover:border-lavender/50', accent: 'text-lavender' },
      { key: 'acao',   emoji: '⚡', texto: 'Agitado, quero ação',         cor: 'hover:bg-orange/10 hover:border-orange/50', accent: 'text-orange' },
      { key: 'pensar', emoji: '🤔', texto: 'Curioso, quero pensar',       cor: 'hover:bg-mint/10 hover:border-mint/50', accent: 'text-mint' },
    ],
  },
  {
    id: 'q2',
    pergunta: 'Vai assistir com quem?',
    options: [
      { key: 'sozinho',  emoji: '👤', texto: 'Sozinho',               cor: 'hover:bg-lavender/10 hover:border-lavender/50', accent: 'text-lavender' },
      { key: 'especial', emoji: '💑', texto: 'Com alguém especial',   cor: 'hover:bg-pink/10 hover:border-pink/50', accent: 'text-pink' },
      { key: 'amigos',   emoji: '👥', texto: 'Com amigos',            cor: 'hover:bg-yellow/10 hover:border-yellow/50', accent: 'text-yellow' },
      { key: 'familia',  emoji: '👨‍👩‍👧', texto: 'Com a família',       cor: 'hover:bg-mint/10 hover:border-mint/50', accent: 'text-mint' },
    ],
  },
  {
    id: 'q3',
    pergunta: 'Quanto você consegue se concentrar hoje?',
    options: [
      { key: 'relaxar', emoji: '🛋️', texto: 'Pouco — só quero relaxar',       cor: 'hover:bg-mint/10 hover:border-mint/50', accent: 'text-mint' },
      { key: 'medio',   emoji: '😊', texto: 'Médio — me envolvo sem esforço', cor: 'hover:bg-yellow/10 hover:border-yellow/50', accent: 'text-yellow' },
      { key: 'intenso', emoji: '🎯', texto: 'Total — pode ser intenso',       cor: 'hover:bg-pink/10 hover:border-pink/50', accent: 'text-pink' },
    ],
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [animState, setAnimState] = useState('in') // 'in' | 'out'

  const current = QUESTIONS[step]

  const handleSelect = (key) => {
    setAnimState('out')
    setTimeout(() => {
      const newAnswers = [...answers, key]
      setAnswers(newAnswers)
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1)
        setAnimState('in')
      } else {
        sessionStorage.setItem('tf_answers', JSON.stringify(newAnswers))
        navigate('/result')
      }
    }, 280)
  }

  const progress = ((step) / QUESTIONS.length) * 100

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Progress bar */}
      <div className="h-1 w-full bg-surface2">
        <div
          className="h-full bg-pink transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 md:px-12">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 group">
          <span className="text-pink font-display font-bold text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </button>
        <span className="font-body text-white/30 text-sm">
          {step + 1} <span className="text-white/20">de</span> {QUESTIONS.length}
        </span>
      </header>

      {/* Quiz content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 md:px-12">
        <div
          className={`w-full max-w-lg ${animState === 'in' ? 'animate-slide-in' : 'animate-slide-out'}`}
          key={step}
        >
          {/* Step indicator chips */}
          <div className="flex gap-2 mb-8 justify-center">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i < step ? 'w-6 h-2 bg-pink' :
                  i === step ? 'w-8 h-2 bg-pink' :
                  'w-2 h-2 bg-surface2'
                }`}
              />
            ))}
          </div>

          {/* Question */}
          <h2 className="font-display font-bold text-white text-2xl md:text-3xl text-center mb-10 leading-tight">
            {current.pergunta}
          </h2>

          {/* Options */}
          <div className={`grid gap-3 ${current.options.length === 3 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {current.options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className={`card-surface flex items-center gap-4 p-5 text-left
                            transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                            cursor-pointer ${opt.cor}`}
              >
                <span className="text-3xl flex-shrink-0">{opt.emoji}</span>
                <span className={`font-body font-medium text-white/80 text-base ${opt.accent}`}>
                  {opt.texto}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom deco bar */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>
    </div>
  )
}
