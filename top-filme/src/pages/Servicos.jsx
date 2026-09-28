import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../utils/api'

/* ═══ Dados ═══════════════════════════════════════════════════════ */

const PLANO = {
  id: 'painel',
  nome: 'Painel de Inteligência',
  preco: '2.900',
  unidade: 'por mês',
  modelo: 'Plano recorrente',
  resumo: 'Para times que decidem semanalmente. Painel online, dados vivos, exportação.',
  features: [
    'Painel online 24/7 com dados atualizados',
    'Todos os cruzamentos (emoção × hora × idade × contexto)',
    'Heatmap comportamental por segmento',
    'Até 3 usuários por conta',
    'Exportação em CSV e API de leitura',
    'Suporte prioritário e onboarding',
  ],
  assunto: 'Painel%20de%20Intelig%C3%AAncia',
}

const SERVICOS = [
  {
    id: 'relatorio',
    nome: 'Relatório Psicográfico',
    preco: '4.500',
    unidade: 'por relatório',
    modelo: 'Serviço sob demanda',
    resumo: 'Antes de dar green-light. Antes de comprar direito. Antes de comissionar.',
    features: [
      'Recorte de nicho emocional específico',
      'Volume dos últimos 90 dias',
      'Segmentação por faixa etária e horário',
      'Entrega em 5 dias úteis · envio por email',
    ],
    assunto: 'Relat%C3%B3rio%20Psicogr%C3%A1fico',
  },
  {
    id: 'teste',
    nome: 'Teste de Hipótese',
    preco: '12.000',
    unidade: 'por projeto',
    modelo: 'Serviço comissionado',
    resumo: 'Grande decisão, incerteza alta. Formulamos, executamos com a base e entregamos análise.',
    features: [
      'Formulação da hipótese em co-autoria',
      'Execução do teste na base de usuários',
      'Análise cruzada + relatório executivo',
      'Entrega em 3 a 4 semanas · envio por email',
    ],
    assunto: 'Teste%20de%20Hip%C3%B3tese',
  },
]

/* ═══ Componentes ═════════════════════════════════════════════════ */

function CardPlano({ empresa }) {
  const assinado = empresa?.assinatura_ativa && empresa?.plano_ativo === PLANO.nome
  const mesAtual = empresa?.mes_atual

  return (
    <div className="relative rounded-2xl border-2 border-[#FF2D78] bg-[#FFFFFF] p-6 md:p-8
                    shadow-[0_10px_40px_-15px_rgba(255,45,120,0.35)] max-w-lg mx-auto">

      {/* Tag topo */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF2D78] text-white
                       font-body text-[11px] font-semibold uppercase tracking-widest
                       px-3 py-1 rounded-full">
        {assinado ? `Assinado · ${mesAtual}º mês` : 'Plano · recorrente'}
      </span>

      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-2">
          {PLANO.modelo}
        </p>
        <h3 className="font-display font-bold text-gray-900 text-2xl mb-3">{PLANO.nome}</h3>
        <p className="font-body text-sm text-gray-600 leading-relaxed">{PLANO.resumo}</p>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-sm text-gray-500">R$</span>
          <span className="font-display font-bold text-4xl md:text-5xl leading-none tabular-nums text-[#FF2D78]">
            {PLANO.preco}
          </span>
        </div>
        <p className="font-body text-xs text-gray-500 mt-1.5">{PLANO.unidade}</p>
      </div>

      <ul className="space-y-2.5 mb-6">
        {PLANO.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0 bg-[#FF2D78]" />
            <span className="font-body text-sm text-gray-700 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      {assinado
        ? (
          <div className="w-full text-center rounded-xl py-3 bg-emerald-50 border border-emerald-200">
            <p className="font-body text-sm font-semibold text-emerald-700">
              ✓ Ativo — próxima cobrança em {mesAtual === 1 ? '30' : '30'} dias
            </p>
          </div>
        )
        : (
          <a
            href={`mailto:vendas@topfilme.com.br?subject=${PLANO.assunto}`}
            className="w-full block text-center font-body text-sm font-semibold rounded-xl py-3
                       bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all"
          >
            Falar com vendas
          </a>
        )
      }
      <p className="font-body text-[11px] text-gray-400 text-center mt-2">
        {assinado ? 'Gerenciamento via time comercial' : 'Contratação via time comercial · sem checkout online'}
      </p>
    </div>
  )
}

function CardServico({ servico, logado }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-5 md:p-6
                    hover:border-gray-300 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-start">

        {/* Info */}
        <div>
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <h3 className="font-display font-bold text-gray-900 text-lg">{servico.nome}</h3>
            <span className="font-body text-xs uppercase tracking-widest text-gray-500">
              {servico.modelo}
            </span>
          </div>
          <p className="font-body text-sm text-gray-600 leading-relaxed mb-3">
            {servico.resumo}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {servico.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-gray-400" />
                <span className="font-body text-xs text-gray-600 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preço + CTA */}
        <div className="md:min-w-[180px] md:border-l md:border-gray-100 md:pl-6 md:text-right">
          <div className="mb-3">
            <div className="flex items-baseline gap-1 md:justify-end">
              <span className="font-display text-xs text-gray-500">R$</span>
              <span className="font-display font-bold text-3xl text-gray-900 tabular-nums leading-none">
                {servico.preco}
              </span>
            </div>
            <p className="font-body text-xs text-gray-500 mt-1">{servico.unidade}</p>
          </div>
          <a
            href={`mailto:vendas@topfilme.com.br?subject=${servico.assunto}`}
            className="inline-block w-full text-center font-body text-sm font-semibold rounded-xl py-2.5 px-4
                       bg-gray-900 text-white hover:bg-gray-800 transition-all whitespace-nowrap"
          >
            {logado ? 'Solicitar por email' : 'Falar com vendas'}
          </a>
          <p className="font-body text-[10px] text-gray-400 mt-1.5 leading-tight md:text-right">
            Envio por email
          </p>
        </div>
      </div>
    </div>
  )
}

/* ═══ Página ═══════════════════════════════════════════════════════ */

export default function Servicos() {
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState(null)
  const logado = !!auth.getEmpresaToken()

  useEffect(() => {
    if (logado) {
      api.empresaMe().then(setEmpresa).catch(() => {})
    }
  }, [logado])

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(logado ? '/dashboard' : '/para-empresas')}
            className="flex items-center gap-2 group"
          >
            <span className="text-[#FF2D78] font-display font-bold text-xl">✦</span>
            <span className="font-display font-bold text-gray-900 text-base tracking-tight">
              Top Filme
            </span>
            <span className="font-body text-xs text-gray-400 border-l border-gray-200 pl-2 ml-1">
              {logado ? 'Painel · Serviços' : 'Empresas'}
            </span>
          </button>
          <nav className="flex items-center gap-1">
            {logado ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="font-body text-sm text-gray-600 hover:text-gray-900
                             px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
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
                  className="font-body text-sm font-semibold text-gray-900
                             px-3 py-1.5 rounded-lg bg-gray-100 transition-all"
                >
                  Serviços
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/para-empresas')}
                  className="hidden sm:inline-block font-body text-sm text-gray-600 hover:text-gray-900
                             px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Início
                </button>
                <button
                  onClick={() => navigate('/empresas/login')}
                  className="font-body text-sm font-semibold text-gray-900
                             px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Entrar
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">

        {/* Título */}
        <section className="text-center mb-12 max-w-3xl mx-auto">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-4">
            Nossos serviços
          </p>
          <h1 className="font-display font-bold text-gray-900 text-3xl md:text-5xl leading-tight mb-4">
            Um <span className="text-[#FF2D78]">plano</span> recorrente,
            <br className="hidden sm:block" /> mais serviços sob demanda.
          </h1>
          <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed">
            Assine o painel de inteligência para acompanhar os dados em tempo real,
            ou contrate serviços pontuais para decisões específicas.
          </p>
        </section>

        {/* Plano recorrente — destaque */}
        <section className="mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-5 text-center">
            {empresa?.assinatura_ativa ? 'Seu plano' : 'Plano recorrente'}
          </p>
          <CardPlano empresa={empresa} />
        </section>

        {/* Serviços sob demanda */}
        <section className="mb-12">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-5">
            {logado ? 'Outros serviços disponíveis' : 'Serviços sob demanda'}
          </p>
          <div className="space-y-3">
            {SERVICOS.map(s => (
              <CardServico key={s.id} servico={s} logado={logado} />
            ))}
          </div>
        </section>

        {/* Callout secundário */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-1">
                Não sabe qual escolher?
              </h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">
                Nossa equipe faz um diagnóstico rápido do seu contexto e recomenda
                o produto certo — sem compromisso.
              </p>
            </div>
            <a
              href="mailto:vendas@topfilme.com.br?subject=Diagn%C3%B3stico%20de%20servi%C3%A7o"
              className="flex-shrink-0 font-body text-sm font-semibold rounded-xl px-6 py-3
                         bg-gray-900 text-white hover:bg-gray-800 transition-all"
            >
              Falar com vendas
            </a>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="pt-8 mt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <p className="font-body text-xs text-gray-400">
            Preços em Reais, sem impostos. Contratação e cobrança via time comercial.
          </p>
          <a href="mailto:vendas@topfilme.com.br"
             className="font-body text-xs text-gray-400 hover:text-gray-700 transition-colors">
            vendas@topfilme.com.br
          </a>
        </footer>

      </main>
    </div>
  )
}
