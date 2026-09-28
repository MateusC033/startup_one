import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../utils/recommend'
import { api, auth } from '../utils/api'
import { metaDoFilme } from '../data/filmesMeta'

/* ─── Textos das respostas ────────────────────────────────────────── */

const TEXTOS = {
  q1: {
    rir: 'está com vontade de rir',
    sentir: 'está com vontade de sentir algo',
    acao: 'está agitado, querendo ação',
    pensar: 'está curioso, querendo pensar',
  },
  q2: {
    sozinho: 'vai assistir sozinho',
    especial: 'vai assistir com alguém especial',
    amigos: 'vai assistir com amigos',
    familia: 'vai assistir com a família',
  },
  q3: {
    relaxar: 'quer só relaxar',
    medio: 'topa se envolver sem muito esforço',
    intenso: 'topa concentração total',
  },
  q4: {
    inspirado: 'quer terminar inspirado',
    aliviado: 'quer terminar leve e aliviado',
    pensativo: 'quer terminar pensativo',
    animado: 'quer terminar animado e bem-humorado',
  },
  q5: {
    real: 'num mundo real e humano',
    epico: 'num mundo épico e grandioso',
    intimo: 'num mundo íntimo e delicado',
    surpresa: 'num mundo cheio de surpresas',
  },
}

function narrarEscolha(respostas) {
  const [q1, q2, q3, q4, q5] = respostas
  const partes = [
    TEXTOS.q1[q1], TEXTOS.q2[q2], TEXTOS.q3[q3], TEXTOS.q4[q4], TEXTOS.q5[q5],
  ].filter(Boolean)
  return partes.join(', ') + '.'
}

/* ─── Chips ───────────────────────────────────────────────────────── */

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

/* ─── Poster ──────────────────────────────────────────────────────── */

function Poster({ src, alt, className, style }) {
  const [erro, setErro] = useState(false)
  useEffect(() => setErro(false), [src])
  if (erro) {
    return (
      <div className={`${className} bg-surface2 flex flex-col items-center justify-center gap-2`} style={style}>
        <span className="text-5xl">🎬</span>
        <span className="font-display font-bold text-white/20 text-xs text-center px-2">{alt}</span>
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setErro(true)} />
}

/* ─── Alternativa (card lateral) ─────────────────────────────────── */

function CardAlternativa({ film, onEscolher, accent }) {
  const meta = metaDoFilme(film.id)
  return (
    <button
      onClick={onEscolher}
      className="group text-left rounded-2xl overflow-hidden border border-border bg-surface
                 hover:border-white/30 transition-all"
    >
      <div className="flex gap-3 p-3">
        <Poster
          src={film.poster} alt={film.titulo}
          className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
          style={{ objectPosition: 'top' }}
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-white/30 mb-1">Alternativa</p>
            <p className="font-display font-semibold text-white text-sm leading-tight line-clamp-2">
              {film.titulo}
            </p>
            {meta.ano && (
              <p className="font-body text-white/40 text-[11px] mt-1">{meta.ano}</p>
            )}
          </div>
          <span className={`inline-flex items-center gap-1 mt-2 font-body text-[11px] ${accent}`}>
            Ver detalhes <span>→</span>
          </span>
        </div>
      </div>
    </button>
  )
}

/* ─── Ações ───────────────────────────────────────────────────────── */

function BotaoAcao({ icone, label, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3
                  border transition-all font-body text-sm
                  ${ativo
                    ? 'border-mint/50 bg-mint/10 text-mint'
                    : 'border-border bg-surface2 text-white/70 hover:border-white/30 hover:text-white'}`}
    >
      <span>{icone}</span>
      <span>{label}</span>
    </button>
  )
}

/* ─── Página ───────────────────────────────────────────────────────── */

export default function Result() {
  const navigate = useNavigate()
  const [films, setFilms] = useState(null)
  const [respostas, setRespostas] = useState([])
  const [centerIdx, setCenterIdx] = useState(0)
  const [acoes, setAcoes] = useState({ salvou: false, jaVi: false, naoGostou: false })
  const locked = useRef(false)
  const analiseEnviada = useRef(false)  // guard contra StrictMode em dev

  useEffect(() => {
    const raw = sessionStorage.getItem('tf_answers')
    if (!raw) { navigate('/quiz'); return }
    const answers = JSON.parse(raw)
    const recs = getRecommendations(answers)
    setRespostas(answers)
    setFilms(recs)

    if (auth.isLogged() && !analiseEnviada.current) {
      analiseEnviada.current = true
      const respostasObj = {
        q1: answers[0], q2: answers[1], q3: answers[2],
        q4: answers[3], q5: answers[4],
      }
      const recomendacoes = recs.map(f => ({ id: f.id, titulo: f.titulo, poster: f.poster }))
      const quick = sessionStorage.getItem('tf_quick_mood') || null
      api.salvarAnalise(respostasObj, recomendacoes, quick)
        .then(() => {
          sessionStorage.removeItem('tf_quick_mood')
          sessionStorage.removeItem('tf_answers')  // evita reenvio se recarregar a página
        })
        .catch(() => { analiseEnviada.current = false })  // permite retry se falhou
    }
  }, [navigate])

  if (!films) return null

  const principal = films[centerIdx]
  const alternativas = films.filter((_, i) => i !== centerIdx)
  const meta = metaDoFilme(principal.id)
  const narrativa = narrarEscolha(respostas)

  const trocarPrincipal = (novoFilm) => {
    if (locked.current) return
    locked.current = true
    const novoIdx = films.findIndex(f => f.id === novoFilm.id)
    if (novoIdx >= 0) setCenterIdx(novoIdx)
    setAcoes({ salvou: false, jaVi: false, naoGostou: false })
    setTimeout(() => { locked.current = false }, 300)
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Top color bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-pink" /><div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" /><div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 md:px-10 border-b border-border">
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 md:px-10 py-8 md:py-10 space-y-8">

        {/* Cabeçalho da recomendação */}
        <div className="animate-fade-in">
          <p className="font-body text-white/40 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="text-pink">✦</span> Para o seu momento
          </p>
          <h1 className="font-display font-bold text-white text-2xl md:text-3xl leading-tight">
            Você <span className="text-lavender">{respostas[0] ? TEXTOS.q1[respostas[0]] : ''}</span>.<br className="hidden sm:block" />
            {' '}Escolhemos este.
          </h1>
        </div>

        {/* Bloco principal */}
        <article
          key={principal.id}
          className="rounded-3xl bg-surface border border-pink/25 overflow-hidden
                     animate-fade-in"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards',
                   boxShadow: '0 20px 60px -30px rgba(255,45,120,0.25)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,240px)_1fr] gap-0">

            {/* Poster */}
            <div className="relative">
              <Poster
                src={principal.poster} alt={principal.titulo}
                className="w-full h-full object-cover md:min-h-[380px]"
                style={{ objectPosition: 'top', minHeight: 240 }}
              />
              <div className="absolute top-3 left-3 bg-pink rounded-full px-3 py-1 shadow-lg">
                <span className="text-white font-display font-bold text-xs">✦ Principal</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 md:p-7 flex flex-col gap-5">

              {/* Metadados topo */}
              <div className="flex items-center gap-2 flex-wrap font-body text-xs text-white/40">
                {meta.ano   && <span>{meta.ano}</span>}
                {meta.duracao && <><span className="w-1 h-1 rounded-full bg-white/20" /><span>{meta.duracao} min</span></>}
                {meta.diretor && <><span className="w-1 h-1 rounded-full bg-white/20" /><span>{meta.diretor}</span></>}
              </div>

              {/* Título */}
              <div>
                <h2 className="font-display font-bold text-white text-3xl md:text-4xl leading-[1.05] mb-2">
                  {principal.titulo}
                </h2>
                <p className="font-body italic text-white/50 text-sm">"{principal.tagline}"</p>
              </div>

              {/* Por que este filme */}
              <div className="rounded-2xl bg-black/30 border border-border p-4">
                <p className="font-body text-xs uppercase tracking-widest text-pink mb-2 flex items-center gap-1.5">
                  <span>✦</span> Por que este filme, agora
                </p>
                <p className="font-body text-white/80 text-sm leading-relaxed">
                  Você {narrativa}
                </p>
                <p className="font-body text-white/60 text-sm leading-relaxed mt-2">
                  {principal.porQueAgora}
                </p>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2">
                <Chips movie={principal} />
              </div>

              {/* Plataformas */}
              {meta.plataformas?.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-body text-xs uppercase tracking-widest text-white/40">
                    Assistir em
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {meta.plataformas.map(p => (
                      <span key={p} className="font-body text-xs bg-surface2 border border-border rounded-lg px-2.5 py-1 text-white/70">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                <BotaoAcao icone="✓" label="Salvar" ativo={acoes.salvou}
                           onClick={() => setAcoes(a => ({ ...a, salvou: !a.salvou }))} />
                <BotaoAcao icone="👁" label="Já vi" ativo={acoes.jaVi}
                           onClick={() => setAcoes(a => ({ ...a, jaVi: !a.jaVi }))} />
                <BotaoAcao icone="↷" label="Não gostei" ativo={acoes.naoGostou}
                           onClick={() => setAcoes(a => ({ ...a, naoGostou: !a.naoGostou }))} />
              </div>
            </div>
          </div>
        </article>

        {/* Alternativas */}
        <section className="animate-fade-in"
                 style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-body text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="text-yellow">✦</span> Ou explore alternativas
            </p>
            <span className="font-body text-white/30 text-xs">clique para trocar a principal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alternativas.map((film, i) => (
              <CardAlternativa
                key={film.id}
                film={film}
                onEscolher={() => trocarPrincipal(film)}
                accent={i === 0 ? 'text-lavender' : 'text-yellow'}
              />
            ))}
          </div>
        </section>

        {/* CTAs finais */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full pt-4">
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

      {/* Bottom color bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-pink" /><div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" /><div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>
    </div>
  )
}
