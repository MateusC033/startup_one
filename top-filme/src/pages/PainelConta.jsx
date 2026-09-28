import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../utils/api'

const SERVICOS_ADICIONAIS = [
  {
    id: 'relatorio',
    nome: 'Relatório Psicográfico',
    preco: '4.500',
    unidade: 'por relatório',
    modelo: 'Sob demanda',
    resumo: 'Análise fechada de um nicho emocional. Entrega em 5 dias úteis por email.',
    features: [
      'Recorte de nicho emocional específico',
      'Segmentação por faixa etária e horário',
      'Cruzamento emoção × contexto',
      'Recomendações acionáveis',
    ],
    assunto: 'Relat%C3%B3rio%20Psicogr%C3%A1fico',
  },
  {
    id: 'teste',
    nome: 'Teste de Hipótese',
    preco: '12.000',
    unidade: 'por projeto',
    modelo: 'Comissionado',
    resumo: 'Colocamos sua pergunta na base, coletamos e analisamos. Entrega em 3–4 semanas.',
    features: [
      'Formulação em co-autoria',
      'Execução com controle demográfico',
      'Análise estatística cruzada',
      'Relatório executivo + apresentação',
    ],
    assunto: 'Teste%20de%20Hip%C3%B3tese',
  },
]

const FEATURES_PAINEL = [
  'Painel online 24/7 com dados atualizados',
  'Todos os cruzamentos (emoção × hora × idade × contexto)',
  'Heatmap comportamental por segmento',
  'Até 3 usuários por conta',
  'Exportação em CSV e API de leitura',
  'Suporte prioritário e onboarding',
]

function formatarData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

function proximaCobranca(inicioIso, mesAtual) {
  if (!inicioIso) return '—'
  const inicio = new Date(inicioIso)
  const prox = new Date(inicio)
  prox.setMonth(prox.getMonth() + mesAtual)
  return prox.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function CardServicoAdicional({ servico }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-5 md:p-6
                    hover:border-gray-300 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-start">
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
            Solicitar por email
          </a>
          <p className="font-body text-[10px] text-gray-400 mt-1.5 leading-tight md:text-right">
            Envio por email
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PainelConta() {
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!auth.getEmpresaToken()) {
      navigate('/empresas/login')
      return
    }
    api.empresaMe()
      .then(setEmpresa)
      .catch(() => navigate('/empresas/login'))
      .finally(() => setCarregando(false))
  }, [navigate])

  const handleSair = async () => {
    await api.empresaLogout()
    auth.clearEmpresaToken()
    auth.clearEmpresa()
    navigate('/para-empresas')
  }

  if (carregando) return <div className="min-h-dvh bg-[#F8F9FA]" />
  if (!empresa) return null

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900">

      {/* Barra empresa */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-body text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/60">Conta empresa:</span>
              <span className="font-semibold">{empresa.nome}</span>
            </span>
            <span className="hidden sm:inline text-white/20">·</span>
            <span className="inline-flex items-center gap-1.5 font-body text-xs">
              <span className="text-white/60">Plano ativo:</span>
              <span className="font-semibold text-[#FF2D78]">{empresa.plano_ativo}</span>
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
              Painel · Minha conta
            </span>
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="font-body text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              Painel
            </button>
            <button
              className="font-body text-sm font-semibold text-gray-900
                         px-3 py-1.5 rounded-lg bg-gray-100 transition-all"
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

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-12 space-y-8">

        {/* Título */}
        <section>
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-2">
            Área da conta
          </p>
          <h1 className="font-display font-bold text-gray-900 text-3xl md:text-4xl leading-tight">
            Olá, <span className="text-[#FF2D78]">{empresa.nome}</span>.
          </h1>
          <p className="font-body text-gray-600 text-base mt-2">
            Sua assinatura está ativa. Aqui você acompanha os detalhes e contrata
            serviços adicionais.
          </p>
        </section>

        {/* Dados da empresa */}
        <section className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900 text-base">
              Dados da conta
            </h2>
            <span className="font-body text-xs text-gray-400">só administradores veem</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Empresa" valor={empresa.nome} />
            <Campo label="Email corporativo" valor={empresa.email_corp} />
            <Campo label="CNPJ" valor={empresa.cnpj || '—'} />
            <Campo label="Conta desde" valor={formatarData(empresa.criado_em)} />
          </div>
        </section>

        {/* Assinatura ativa */}
        <section>
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3">
            Assinatura ativa
          </p>
          <div className="rounded-2xl border-2 border-[#FF2D78] bg-[#FFFFFF] p-6 md:p-7
                          shadow-[0_10px_40px_-15px_rgba(255,45,120,0.25)] relative">
            <span className="absolute -top-3 left-6 bg-[#FF2D78] text-white
                             font-body text-[11px] font-semibold uppercase tracking-widest
                             px-3 py-1 rounded-full">
              Ativo · {empresa.mes_atual}º mês
            </span>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
              <div>
                <div className="flex items-baseline gap-3 flex-wrap mb-2">
                  <h3 className="font-display font-bold text-gray-900 text-xl">
                    {empresa.plano_ativo}
                  </h3>
                  <span className="font-body text-xs uppercase tracking-widest text-gray-500">
                    Plano recorrente
                  </span>
                </div>
                <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">
                  Painel online com dados vivos, cruzamentos e exportação. Acesso completo
                  ao motor de inteligência psicográfica.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {FEATURES_PAINEL.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-[#FF2D78]" />
                      <span className="font-body text-xs text-gray-600 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:min-w-[220px] md:border-l md:border-gray-100 md:pl-6 space-y-3">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Valor mensal
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-xs text-gray-500">R$</span>
                    <span className="font-display font-bold text-2xl text-gray-900 tabular-nums leading-none">
                      2.900
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="font-body text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Próxima cobrança
                  </p>
                  <p className="font-body text-sm text-gray-900 font-medium">
                    {proximaCobranca(empresa.inicio_assinatura, empresa.mes_atual)}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full font-body text-sm font-semibold rounded-xl py-2.5
                             bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all"
                >
                  Abrir painel
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços adicionais */}
        <section>
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <p className="font-body text-xs uppercase tracking-widest text-gray-500">
              Solicitar serviços adicionais
            </p>
            <span className="font-body text-xs text-gray-400">
              contratação por email
            </span>
          </div>
          <div className="space-y-3">
            {SERVICOS_ADICIONAIS.map(s => (
              <CardServicoAdicional key={s.id} servico={s} />
            ))}
          </div>
        </section>

        {/* Suporte */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-1">
                Precisa de ajuda com a conta?
              </h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">
                Nosso time comercial responde em até 1 dia útil para dúvidas de cobrança,
                usuários adicionais ou serviços customizados.
              </p>
            </div>
            <a
              href="mailto:vendas@topfilme.com.br?subject=Suporte%20da%20conta"
              className="flex-shrink-0 font-body text-sm font-semibold rounded-xl px-6 py-3
                         bg-gray-900 text-white hover:bg-gray-800 transition-all"
            >
              Falar com o time
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

function Campo({ label, valor }) {
  return (
    <div>
      <p className="font-body text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="font-body text-sm text-gray-900">{valor || '—'}</p>
    </div>
  )
}
