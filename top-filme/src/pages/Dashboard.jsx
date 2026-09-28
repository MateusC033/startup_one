import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../utils/api'
import {
  kpis as kpisMock, estadoEmocional as estadoMock, destinoEmocional as destinoMock,
  companhia as companhiaMock, horariosPico as horariosMock, topFilmes as topMock,
  insight, insightSecundario, heatmapEmoHora, demografia,
} from '../data/dashboardData'

/* ═══ Utilidades ═══════════════════════════════════════════════ */

function formatDuracao(seg) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${m}min ${s.toString().padStart(2, '0')}s`
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

function InsightCard({ dados, variante = 'primario' }) {
  const ehPrimario = variante === 'primario'
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-1.5 h-1.5 rounded-full ${ehPrimario ? 'bg-[#FF2D78]' : 'bg-gray-700'}`} />
        <span className="font-body text-xs uppercase tracking-widest text-gray-500">
          {dados.categoria}
        </span>
      </div>
      <div className="flex items-start gap-5">
        <span className={`font-display font-bold leading-none flex-shrink-0 ${
          ehPrimario ? 'text-[#FF2D78] text-5xl md:text-6xl' : 'text-gray-900 text-4xl md:text-5xl'
        }`}>
          {dados.numero}
        </span>
        <p className="font-body text-gray-700 text-sm md:text-base leading-relaxed pt-1">
          {dados.frase}
        </p>
      </div>
    </div>
  )
}

function HeatmapEmoHora({ dados }) {
  const linhas = [
    { chave: 'sentir', label: 'Sentir algo' },
    { chave: 'rir',    label: 'Levinho'     },
    { chave: 'pensar', label: 'Curioso'     },
    { chave: 'acao',   label: 'Ação'        },
  ]

  // Encontra célula de pico global
  let picoValor = 0, picoLinha = 0, picoCol = 0
  linhas.forEach((l, i) => {
    dados[l.chave].forEach((v, j) => {
      if (v > picoValor) { picoValor = v; picoLinha = i; picoCol = j }
    })
  })

  const marcos = [0, 6, 12, 18, 23]

  return (
    <div>
      <div className="flex gap-1">
        {/* Rótulos das linhas */}
        <div className="flex flex-col gap-1 pr-2 pt-0.5">
          {linhas.map(l => (
            <div key={l.chave} className="h-6 md:h-7 flex items-center">
              <span className="font-body text-xs text-gray-600 whitespace-nowrap">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Grade */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            {linhas.map((l, i) => (
              <div key={l.chave} className="flex gap-[3px]">
                {dados[l.chave].map((v, j) => {
                  const ehPico = i === picoLinha && j === picoCol
                  const opacidade = Math.max(v / 100, 0.04)
                  return (
                    <div
                      key={j}
                      className={`flex-1 h-6 md:h-7 rounded-sm transition-all hover:ring-2 hover:ring-gray-400 ${
                        ehPico ? 'ring-2 ring-[#FF2D78]' : ''
                      }`}
                      style={{
                        background: ehPico
                          ? '#FF2D78'
                          : `rgba(17, 24, 39, ${opacidade})`,
                      }}
                      title={`${l.label} · ${j}h — ${v}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Escala horizontal */}
          <div className="flex justify-between mt-2 px-0.5">
            {marcos.map(h => (
              <span key={h} className="font-body text-[10px] text-gray-400 tabular-nums">
                {h.toString().padStart(2, '0')}h
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="font-body text-xs text-gray-500 mt-4">
        Pico global: <span className="text-[#FF2D78] font-semibold">Sentir algo às {picoCol}h</span>.
        Legenda: mais escuro = mais volume.
      </p>
    </div>
  )
}

function Demografia({ dados }) {
  const emocoes = [
    { chave: 'sentir', label: 'Sentir algo', tom: '#111827' },
    { chave: 'rir',    label: 'Levinho',     tom: '#4B5563' },
    { chave: 'pensar', label: 'Curioso',     tom: '#9CA3AF' },
    { chave: 'acao',   label: 'Ação',        tom: '#D1D5DB' },
  ]

  return (
    <div>
      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mb-5">
        {emocoes.map(e => (
          <div key={e.chave} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: e.tom }} />
            <span className="font-body text-xs text-gray-600">{e.label}</span>
          </div>
        ))}
      </div>

      {/* Faixas */}
      <ul className="space-y-4">
        {dados.map(faixa => (
          <li key={faixa.faixa}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="font-display font-semibold text-sm text-gray-900">
                {faixa.faixa} anos
              </span>
              <span className="font-body text-xs text-gray-500 tabular-nums">
                {faixa.peso}% do total
              </span>
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
              {emocoes.map(e => (
                <div
                  key={e.chave}
                  style={{
                    width: `${faixa.humores[e.chave]}%`,
                    background: e.tom,
                  }}
                  title={`${e.label}: ${faixa.humores[e.chave]}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-1.5">
              {emocoes.map(e => (
                <span key={e.chave} className="font-body text-[11px] text-gray-500 tabular-nums">
                  {e.label} {faixa.humores[e.chave]}%
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ═══ Página ═══════════════════════════════════════════════════ */

/* ─── Tela de bloqueio (sem login empresa) ─────────────────────── */

function PainelBloqueado({ status, empresa, onSair }) {
  const navigate = useNavigate()
  const isSemLogin = status === 'sem-login'

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/para-empresas')}
            className="flex items-center gap-2 group"
          >
            <span className="text-[#FF2D78] font-display font-bold text-xl">✦</span>
            <span className="font-display font-bold text-gray-900 text-base tracking-tight">Top Filme</span>
            <span className="font-body text-xs text-gray-400 border-l border-gray-200 pl-2 ml-1">
              Painel de Inteligência
            </span>
          </button>
          {empresa
            ? (
              <button onClick={onSair} className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Sair da conta empresa →
              </button>
            )
            : (
              <button onClick={() => navigate('/para-empresas')} className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
                ← Voltar para empresas
              </button>
            )
          }
        </div>
      </header>

      {/* Conteúdo bloqueado */}
      <main className="flex-1 flex items-center justify-center px-5 md:px-8 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FF2D78]/10 mb-5">
              <svg className="w-6 h-6 text-[#FF2D78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>

            <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3">
              {isSemLogin ? 'Acesso restrito' : 'Assinatura pendente'}
            </p>
            <h1 className="font-display font-bold text-gray-900 text-2xl mb-3 leading-tight">
              {isSemLogin
                ? 'Painel exclusivo para contas empresa.'
                : `Olá, ${empresa?.nome || 'empresa'}.`}
            </h1>
            <p className="font-body text-gray-600 text-sm leading-relaxed mb-8">
              {isSemLogin
                ? 'Para acessar o painel de inteligência psicográfica é preciso estar autenticado como empresa parceira, com assinatura ativa.'
                : 'Sua conta está em análise pelo nosso time comercial. Assim que a assinatura for ativada, o painel liberará automaticamente.'}
            </p>

            <div className="flex flex-col gap-2.5">
              {isSemLogin ? (
                <>
                  <button
                    onClick={() => navigate('/empresas/login')}
                    className="w-full font-body text-sm font-semibold rounded-xl py-3
                               bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all"
                  >
                    Entrar como empresa
                  </button>
                  <button
                    onClick={() => navigate('/servicos')}
                    className="w-full font-body text-sm rounded-xl py-3 border border-gray-300
                               text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all"
                  >
                    Conhecer os serviços
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="mailto:vendas@topfilme.com.br?subject=Ativa%C3%A7%C3%A3o%20de%20assinatura"
                    className="w-full font-body text-sm font-semibold rounded-xl py-3
                               bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all text-center"
                  >
                    Falar com vendas
                  </a>
                  <button
                    onClick={onSair}
                    className="w-full font-body text-sm rounded-xl py-3 border border-gray-300
                               text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all"
                  >
                    Sair da conta
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-center font-body text-xs text-gray-400 mt-5">
            É pessoa física?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
            >
              Ir para o app
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

/* ─── Dashboard ────────────────────────────────────────────────── */

export default function Dashboard() {
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState(null)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.dashboard()
      .then(d => {
        setDados(d)
        setEmpresa(d.empresa || null)
      })
      .catch(() => setDados(null))
      .finally(() => setCarregando(false))
  }, [])

  const handleSair = async () => {
    await api.empresaLogout()
    auth.clearEmpresaToken()
    auth.clearEmpresa()
    setEmpresa(null)
    navigate('/para-empresas')
  }

  if (carregando) return <div className="min-h-dvh bg-[#F8F9FA]" />

  // Gate: sem login ou sem assinatura ativa → tela bloqueada
  if (!empresa) return <PainelBloqueado status="sem-login" empresa={null} onSair={handleSair} />
  if (!dados?.acesso_completo) return <PainelBloqueado status="pendente" empresa={empresa} onSair={handleSair} />


  // Fallback para mocks se o backend não responder ou vier vazio.
  const kpis        = dados?.kpis            ? {
    totalAnalises: dados.kpis.total_analises,
    usuariosUnicos: dados.kpis.usuarios_unicos,
    tempoMedioSeg: kpisMock.tempoMedioSeg,
    retorno7d: kpisMock.retorno7d,
  } : kpisMock
  const estadoEmocional  = (dados?.estado_emocional?.length ? dados.estado_emocional : estadoMock)
  const destinoEmocional = (dados?.destino_emocional?.length ? dados.destino_emocional : destinoMock)
  const companhia        = (dados?.companhia?.length ? dados.companhia : companhiaMock)
  const horariosPico     = (dados?.horarios?.length === 24 ? dados.horarios : horariosMock)
  const topFilmes        = (dados?.top_filmes?.length ? dados.top_filmes : topMock)

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900">

      {/* Barra empresa (só se logada) */}
      {empresa && (
        <div className="bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-body text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${dados?.acesso_completo ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-white/60">Conta empresa:</span>
                <span className="font-semibold">{empresa.nome}</span>
              </span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span className="inline-flex items-center gap-1.5 font-body text-xs">
                <span className="text-white/60">Plano:</span>
                <span className="font-semibold text-[#FF2D78]">
                  {empresa.plano_ativo || empresa.plano || 'Sem assinatura ativa'}
                </span>
              </span>
            </div>
            <button
              onClick={handleSair}
              className="font-body text-xs text-white/60 hover:text-white transition-colors"
            >
              Sair da conta empresa →
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
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
          <nav className="flex items-center gap-1">
            <button
              className="font-body text-sm font-semibold text-gray-900
                         px-3 py-1.5 rounded-lg bg-gray-100 transition-all"
            >
              Painel
            </button>
            <button
              onClick={() => navigate('/painel/conta')}
              className="font-body text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              Minha conta
            </button>
            <button
              onClick={() => navigate('/servicos')}
              className="font-body text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              Serviços
            </button>
          </nav>
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
            label="Sinais psicográficos"
            valor={kpis.totalAnalises.toLocaleString('pt-BR')}
            sub={dados?.kpis?.analises_30d != null ? `${dados.kpis.analises_30d} nos últimos 30 dias` : 'coletados até hoje'}
          />
          <KPICard
            label="Perfis emocionais únicos"
            valor={kpis.usuariosUnicos.toLocaleString('pt-BR')}
            sub={kpis.usuariosUnicos ? `${(kpis.totalAnalises / kpis.usuariosUnicos).toFixed(1)} sinais por perfil` : ''}
          />
          <KPICard
            label="Tempo médio de decisão"
            valor={formatDuracao(kpis.tempoMedioSeg)}
            sub="do quiz ao resultado"
          />
          <KPICard
            label="Recorrência semanal"
            valor={`${Math.round(kpis.retorno7d * 100)}%`}
            sub="perfis com 2ª análise em 7d"
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

        {/* Heatmap emoção × hora */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Cruzamento emoção × hora do dia
              </h2>
              <span className="font-body text-xs text-gray-400">Q1 × 24h</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              Onde cada estado emocional se concentra ao longo do dia — a base para segmentar janelas comerciais.
            </p>
            <HeatmapEmoHora dados={heatmapEmoHora} />
          </div>
        </section>

        {/* Segmentação demográfica */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display font-semibold text-gray-900 text-base">
                Perfil por faixa etária
              </h2>
              <span className="font-body text-xs text-gray-400">Estado emocional × idade</span>
            </div>
            <p className="font-body text-xs text-gray-500 mb-5">
              Distribuição dos estados emocionais por segmento etário — direciona ativação de campanhas B2B.
            </p>
            <Demografia dados={demografia} />
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

        {/* Insights */}
        <section>
          <p className="font-body text-xs uppercase tracking-widest text-gray-400 mb-3">
            Insights do período
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard dados={insight} variante="primario" />
            <InsightCard dados={insightSecundario} variante="secundario" />
          </div>
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
