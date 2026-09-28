import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  kpis, estadoEmocional, destinoEmocional, companhia,
  horariosPico, topFilmes, insight,
} from '../data/dashboardData'

/* ═══ Utilidades ═══════════════════════════════════════════════ */

function formatDuracao(seg) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${m}'${s.toString().padStart(2, '0')}"`
}

/* ═══ Componentes ══════════════════════════════════════════════ */

function KPICard({ label, valor, sub }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-5">
      <p className="font-body text-xs text-gray-500 tracking-wide">{label}</p>
      <p className="font-display font-bold text-gray-900 text-3xl mt-2 leading-none">
        {valor}
      </p>
      {sub && <p className="font-body text-xs text-gray-400 mt-2">{sub}</p>}
    </div>
  )
}

function BarraHorizontal({ label, valor, destaque }) {
  const largura = Math.max(valor, 2)
  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-body text-sm text-gray-700">{label}</span>
        <span className={`font-display font-semibold text-sm tabular-nums ${
          destaque ? 'text-[#FF2D78]' : 'text-gray-900'
        }`}>
          {valor}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            destaque ? 'bg-[#FF2D78]' : 'bg-gray-800'
          }`}
          style={{ width: `${largura}%` }}
        />
      </div>
    </div>
  )
}

function Donut({ dados }) {
  const total = dados.reduce((sum, d) => sum + d.valor, 0)
  const tons = ['#111827', '#4B5563', '#9CA3AF', '#D1D5DB']

  let acumulado = 0
  const gradient = dados.map((d, i) => {
    const inicio = (acumulado / total) * 100
    acumulado += d.valor
    const fim = (acumulado / total) * 100
    return `${tons[i]} ${inicio}% ${fim}%`
  }).join(', ')

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative w-32 h-32 rounded-full flex-shrink-0"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-3 rounded-full bg-[#FFFFFF] flex flex-col items-center justify-center">
          <span className="font-display font-bold text-gray-900 text-xl leading-none">
            {dados[0].valor}%
          </span>
          <span className="font-body text-[10px] text-gray-500 mt-0.5">
            {dados[0].label.toLowerCase()}
          </span>
        </div>
      </div>
      <ul className="flex-1 space-y-2 min-w-0">
        {dados.map((d, i) => (
          <li key={d.key} className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: tons[i] }}
            />
            <span className="font-body text-sm text-gray-700 truncate flex-1">
              {d.label}
            </span>
            <span className="font-display font-semibold text-sm text-gray-900 tabular-nums">
              {d.valor}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HorariosPico({ dados }) {
  const max = Math.max(...dados)
  const picoHora = dados.indexOf(max)
  const marcos = [0, 6, 12, 18]

  return (
    <div>
      <div className="flex items-end gap-[3px] h-24">
        {dados.map((v, i) => {
          const altura = (v / max) * 100
          const ehPico = i === picoHora
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-500 ${
                ehPico ? 'bg-[#FF2D78]' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={{ height: `${Math.max(altura, 4)}%` }}
              title={`${i}h — ${v} análises`}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        {marcos.map(h => (
          <span key={h} className="font-body text-[10px] text-gray-400 tabular-nums">
            {h.toString().padStart(2, '0')}h
          </span>
        ))}
        <span className="font-body text-[10px] text-gray-400 tabular-nums">23h</span>
      </div>
      <p className="font-body text-xs text-gray-500 mt-3">
        Pico às <span className="text-[#FF2D78] font-semibold">{picoHora}h</span> — janela nobre para conteúdo emocionalmente carregado.
      </p>
    </div>
  )
}

function TopFilmes({ filmes }) {
  const max = filmes[0].frequencia

  return (
    <ol className="space-y-3">
      {filmes.map((f, i) => {
        const largura = (f.frequencia / max) * 100
        return (
          <li key={f.titulo} className="flex items-center gap-3">
            <span className="font-display font-semibold text-xs text-gray-400 w-4 tabular-nums">
              {(i + 1).toString().padStart(2, '0')}
            </span>
            <PosterMini src={f.poster} alt={f.titulo} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-gray-900 truncate mb-1">{f.titulo}</p>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gray-700 transition-all duration-700"
                  style={{ width: `${largura}%` }}
                />
              </div>
            </div>
            <span className="font-display font-semibold text-sm text-gray-900 tabular-nums w-8 text-right">
              {f.frequencia}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function PosterMini({ src, alt }) {
  const [erro, setErro] = useState(false)
  if (erro) {
    return (
      <div className="w-8 h-11 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center">
        <span className="text-xs">🎬</span>
      </div>
    )
  }
  return (
    <img
      src={src} alt={alt}
      className="w-8 h-11 rounded object-cover flex-shrink-0"
      onError={() => setErro(true)}
    />
  )
}

function InsightCard({ dados }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D78]" />
        <span className="font-body text-xs uppercase tracking-widest text-gray-500">
          {dados.categoria}
        </span>
      </div>
      <div className="flex items-start gap-6 md:gap-8">
        <span className="font-display font-bold text-[#FF2D78] text-5xl md:text-6xl leading-none flex-shrink-0">
          {dados.numero}
        </span>
        <p className="font-body text-gray-700 text-base md:text-lg leading-relaxed pt-1">
          {dados.frase}
        </p>
      </div>
    </div>
  )
}

/* ═══ Página ═══════════════════════════════════════════════════ */

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <span className="text-[#FF2D78] font-display font-bold text-xl">✦</span>
            <span className="font-display font-bold text-gray-900 text-base tracking-tight">
              Top Filme
            </span>
            <span className="font-body text-xs text-gray-400 border-l border-gray-200 pl-2 ml-1">
              Painel de Inteligência
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-body text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Prévia B2B
            </span>
            <button
              onClick={() => navigate('/home')}
              className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Voltar ao app →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10 space-y-8">

        {/* Título + período */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-1">
            <h1 className="font-display font-bold text-gray-900 text-2xl md:text-3xl">
              Inteligência psicográfica
            </h1>
            <span className="font-body text-sm text-gray-500 tabular-nums">
              30 dias · 28 ago – 27 set 2026
            </span>
          </div>
          <p className="font-body text-gray-500 text-sm max-w-2xl">
            Padrões de estado emocional e desejo de conteúdo, capturados no momento
            exato da decisão de assistir.
          </p>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            label="Análises coletadas"
            valor={kpis.totalAnalises.toLocaleString('pt-BR')}
            sub="+ 214 vs. mês anterior"
          />
          <KPICard
            label="Usuários únicos"
            valor={kpis.usuariosUnicos.toLocaleString('pt-BR')}
            sub="2,7 análises por usuário"
          />
          <KPICard
            label="Tempo médio de sessão"
            valor={formatDuracao(kpis.tempoMedioSeg)}
            sub="do quiz ao resultado"
          />
          <KPICard
            label="Retorno em 7 dias"
            valor={`${Math.round(kpis.retorno7d * 100)}%`}
            sub="usuários com 2ª análise"
          />
        </section>

        {/* Grid 2 colunas — distribuição + companhia */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Estado emocional na chegada
              </h2>
              <span className="font-body text-xs text-gray-400">Q1</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              O que o usuário está sentindo ao abrir o app.
            </p>
            <div className="space-y-4">
              {estadoEmocional.map((d, i) => (
                <BarraHorizontal
                  key={d.key}
                  label={d.label}
                  valor={d.valor}
                  destaque={i === 0}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Contexto de consumo
              </h2>
              <span className="font-body text-xs text-gray-400">Q2</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              Com quem o usuário planeja assistir.
            </p>
            <Donut dados={companhia} />
          </div>

        </section>

        {/* Grid 2 colunas — destino emocional + horários */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Destino emocional desejado
              </h2>
              <span className="font-body text-xs text-gray-400">Q4</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              Como o usuário quer se sentir ao terminar de assistir.
            </p>
            <div className="space-y-4">
              {destinoEmocional.map((d, i) => (
                <BarraHorizontal
                  key={d.key}
                  label={d.label}
                  valor={d.valor}
                  destaque={i === 0}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Distribuição por hora do dia
              </h2>
              <span className="font-body text-xs text-gray-400">24h</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              Volume relativo de análises ao longo do dia.
            </p>
            <HorariosPico dados={horariosPico} />
          </div>

        </section>

        {/* Top filmes */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Top filmes recomendados
              </h2>
              <span className="font-body text-xs text-gray-400">Volume · 30d</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              Quais títulos o motor mais entregou para os estados emocionais capturados.
            </p>
            <TopFilmes filmes={topFilmes} />
          </div>
        </section>

        {/* Insight */}
        <section>
          <p className="font-body text-xs uppercase tracking-widest text-gray-400 mb-3">
            Insight do período
          </p>
          <InsightCard dados={insight} />
        </section>

        {/* Rodapé */}
        <footer className="pt-4 pb-2 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <p className="font-body text-xs text-gray-400">
            Dados agregados e anonimizados. Amostra ilustrativa para pitch.
          </p>
          <p className="font-body text-xs text-gray-400 tabular-nums">
            Atualizado em 27 set 2026 · 18h
          </p>
        </footer>

      </main>
    </div>
  )
}
