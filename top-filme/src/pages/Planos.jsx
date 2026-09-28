import { useNavigate } from 'react-router-dom'

/* ═══ Dados dos planos ═══════════════════════════════════════════ */

const PLANOS = [
  {
    id: 'relatorio',
    nome: 'Relatório Psicográfico',
    preco: '4.500',
    unidade: 'por relatório',
    modelo: 'Sob demanda',
    resumo: 'Antes de dar green-light. Antes de comprar direito. Antes de comissionar.',
    features: [
      'Recorte de nicho emocional específico',
      'Volume dos últimos 90 dias',
      'Segmentação por faixa etária e horário',
      'Cruzamento emoção × contexto de consumo',
      'Recomendações acionáveis por produto',
      'Entrega em 5 dias úteis',
    ],
    ctaLabel: 'Falar com vendas',
    assunto: 'Relat%C3%B3rio%20Psicogr%C3%A1fico',
    destaque: false,
  },
  {
    id: 'painel',
    nome: 'Painel de Inteligência',
    preco: '2.900',
    unidade: 'por mês',
    modelo: 'Assinatura',
    resumo: 'Para times que decidem semanalmente. Painel online, dados vivos, exportação.',
    features: [
      'Painel online 24/7 com dados atualizados',
      'Todos os cruzamentos (emoção × hora × idade × contexto)',
      'Heatmap comportamental por segmento',
      'Até 3 usuários por conta',
      'Exportação em CSV e API de leitura',
      'Suporte prioritário e onboarding',
    ],
    ctaLabel: 'Falar com vendas',
    assunto: 'Painel%20de%20Intelig%C3%AAncia',
    destaque: true,
    tag: 'Mais escolhido',
  },
  {
    id: 'teste',
    nome: 'Teste de Hipótese',
    preco: '12.000',
    unidade: 'por projeto',
    modelo: 'Comissionado',
    resumo: 'Grande decisão, incerteza alta. Formulamos, executamos com a base e entregamos análise.',
    features: [
      'Formulação da hipótese em co-autoria',
      'Execução do teste na base de usuários',
      'Amostra estatística mínima garantida',
      'Análise cruzada com controle demográfico',
      'Relatório executivo + apresentação',
      'Entrega em 3 a 4 semanas',
    ],
    ctaLabel: 'Falar com vendas',
    assunto: 'Teste%20de%20Hip%C3%B3tese',
    destaque: false,
  },
]

/* ═══ Componentes ═════════════════════════════════════════════════ */

function CardPlano({ plano }) {
  const destaque = plano.destaque

  return (
    <div className={`relative rounded-2xl border p-6 md:p-7 flex flex-col h-full transition-all
      ${destaque
        ? 'border-[#FF2D78] bg-[#FFFFFF] shadow-[0_10px_40px_-15px_rgba(255,45,120,0.35)]'
        : 'border-gray-200 bg-[#FFFFFF] hover:border-gray-300'
      }`}>

      {plano.tag && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF2D78] text-white
                         font-body text-[11px] font-semibold uppercase tracking-widest
                         px-3 py-1 rounded-full">
          {plano.tag}
        </span>
      )}

      {/* Header do card */}
      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-2">
          {plano.modelo}
        </p>
        <h3 className="font-display font-bold text-gray-900 text-xl mb-3">{plano.nome}</h3>
        <p className="font-body text-sm text-gray-600 leading-relaxed">{plano.resumo}</p>
      </div>

      {/* Preço */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-sm text-gray-500">R$</span>
          <span className={`font-display font-bold text-4xl md:text-5xl leading-none tabular-nums
            ${destaque ? 'text-[#FF2D78]' : 'text-gray-900'}`}>
            {plano.preco}
          </span>
        </div>
        <p className="font-body text-xs text-gray-500 mt-1.5">{plano.unidade}</p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {plano.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0
              ${destaque ? 'bg-[#FF2D78]' : 'bg-gray-400'}`} />
            <span className="font-body text-sm text-gray-700 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={`mailto:vendas@topfilme.com.br?subject=${plano.assunto}`}
        className={`w-full font-body text-sm font-semibold rounded-xl py-3 transition-all text-center
          ${destaque
            ? 'bg-[#FF2D78] text-white hover:bg-[#E5236A]'
            : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
      >
        {plano.ctaLabel}
      </a>
      <p className="font-body text-[11px] text-gray-400 text-center mt-2">
        Contratação via time comercial · sem checkout online
      </p>
    </div>
  )
}

/* ═══ Página ═══════════════════════════════════════════════════════ */

export default function Planos() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/para-empresas')}
            className="flex items-center gap-2 group"
          >
            <span className="text-[#FF2D78] font-display font-bold text-xl">✦</span>
            <span className="font-display font-bold text-gray-900 text-base tracking-tight">
              Top Filme
            </span>
            <span className="font-body text-xs text-gray-400 border-l border-gray-200 pl-2 ml-1">
              Empresas
            </span>
          </button>
          <nav className="flex items-center gap-1">
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
            <button
              onClick={() => navigate('/')}
              className="hidden md:inline-block font-body text-xs text-gray-400 hover:text-gray-700
                         ml-2 pl-3 border-l border-gray-200 transition-colors"
            >
              App do usuário ↗
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">

        {/* Título */}
        <section className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-4">
            Planos comerciais
          </p>
          <h1 className="font-display font-bold text-gray-900 text-3xl md:text-5xl leading-tight mb-4">
            Três formas de <span className="text-[#FF2D78]">acessar</span> a inteligência.
          </h1>
          <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed">
            Do relatório pontual ao painel contínuo, três produtos desenhados para cada
            momento da sua decisão de conteúdo.
          </p>
        </section>

        {/* Grid de planos */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANOS.map(plano => (
            <CardPlano key={plano.id} plano={plano} />
          ))}
        </section>

        {/* Callout secundário */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-gray-200 p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-1">
                Não sabe qual escolher?
              </h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">
                Nossa equipe faz um diagnóstico rápido do seu contexto e recomenda
                o plano certo — sem compromisso.
              </p>
            </div>
            <a
              href="mailto:vendas@topfilme.com.br?subject=Diagn%C3%B3stico%20de%20plano"
              className="flex-shrink-0 font-body text-sm font-semibold rounded-xl px-6 py-3
                         bg-gray-900 text-white hover:bg-gray-800 transition-all"
            >
              Falar com vendas
            </a>
          </div>
        </section>

        {/* Comparativo curto */}
        <section className="mb-8">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-4 text-center">
            Como escolher
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-[#FFFFFF] p-5">
              <p className="font-display font-semibold text-gray-900 text-sm mb-1.5">
                Decisão pontual?
              </p>
              <p className="font-body text-xs text-gray-600 leading-relaxed">
                <span className="text-gray-900 font-semibold">Relatório.</span> Você recebe
                uma leitura fechada de um nicho emocional que interessa agora.
              </p>
            </div>
            <div className="rounded-xl border border-[#FF2D78]/30 bg-[#FFFFFF] p-5">
              <p className="font-display font-semibold text-gray-900 text-sm mb-1.5">
                Time que decide semanalmente?
              </p>
              <p className="font-body text-xs text-gray-600 leading-relaxed">
                <span className="text-[#FF2D78] font-semibold">Painel.</span> Dados vivos,
                cruzamentos infinitos, exportação para os seus times de conteúdo e mídia.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#FFFFFF] p-5">
              <p className="font-display font-semibold text-gray-900 text-sm mb-1.5">
                Grande aposta pela frente?
              </p>
              <p className="font-body text-xs text-gray-600 leading-relaxed">
                <span className="text-gray-900 font-semibold">Teste de hipótese.</span> A
                gente coloca sua pergunta na base, coleta e analisa.
              </p>
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <p className="font-body text-xs text-gray-400">
            Preços em Reais, sem impostos. Faturamento mensal ou por projeto.
          </p>
          <p className="font-body text-xs text-gray-400">
            <a href="mailto:vendas@topfilme.com.br" className="hover:text-gray-700 transition-colors">
              vendas@topfilme.com.br
            </a>
          </p>
        </footer>

      </main>
    </div>
  )
}
