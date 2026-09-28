import { useNavigate } from 'react-router-dom'

/* ═══ Componentes ═════════════════════════════════════════════════ */

function Stat({ valor, label }) {
  return (
    <div>
      <p className="font-display font-bold text-gray-900 text-3xl md:text-4xl leading-none tabular-nums">
        {valor}
      </p>
      <p className="font-body text-xs text-gray-500 mt-2 leading-tight">{label}</p>
    </div>
  )
}

function Passo({ n, titulo, texto }) {
  return (
    <div className="relative">
      <span className="font-display font-bold text-gray-200 text-6xl md:text-7xl leading-none block mb-2 tabular-nums">
        {n}
      </span>
      <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{titulo}</h3>
      <p className="font-body text-sm text-gray-600 leading-relaxed">{texto}</p>
    </div>
  )
}

function Persona({ tag, titulo, descricao }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6">
      <p className="font-body text-xs uppercase tracking-widest text-[#FF2D78] mb-3">{tag}</p>
      <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{titulo}</h3>
      <p className="font-body text-sm text-gray-600 leading-relaxed">{descricao}</p>
    </div>
  )
}

function Diferencial({ contra, favor }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <p className="font-body text-xs uppercase tracking-widest text-gray-400 mb-1.5">
          O que outros oferecem
        </p>
        <p className="font-body text-sm text-gray-500 leading-relaxed line-through">{contra}</p>
      </div>
      <span className="text-gray-300 mt-6">→</span>
      <div className="flex-1">
        <p className="font-body text-xs uppercase tracking-widest text-[#FF2D78] mb-1.5">
          Top Filme
        </p>
        <p className="font-body text-sm text-gray-900 leading-relaxed font-medium">{favor}</p>
      </div>
    </div>
  )
}

/* ═══ Página ═══════════════════════════════════════════════════════ */

export default function ParaEmpresas() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#F8F9FA] text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-[#FFFFFF] sticky top-0 z-20">
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
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate('/planos')}
              className="hidden sm:inline-block font-body text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Planos
            </button>
            <button
              onClick={() => navigate('/empresas/login')}
              className="font-body text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/')}
              className="hidden md:inline-block font-body text-xs text-gray-500 hover:text-gray-900
                         border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-300 transition-all"
            >
              App do usuário →
            </button>
          </div>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-5">
            Inteligência de consumo audiovisual
          </p>
          <h1 className="font-display font-bold text-gray-900 leading-[1.05] tracking-tight mb-6
                         text-4xl md:text-6xl lg:text-7xl">
            A emoção que o<br />
            <span className="text-[#FF2D78]">algoritmo não vê.</span>
          </h1>
          <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Dados psicográficos capturados no momento exato da decisão de assistir.
            Não histórico, não gênero, não declaração. O que o público quer sentir agora
            — e ninguém está vendendo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              onClick={() => navigate('/planos')}
              className="font-body text-sm font-semibold rounded-xl px-8 py-3.5
                         bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all"
            >
              Ver planos
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="font-body text-sm font-semibold rounded-xl px-6 py-3.5
                         border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all"
            >
              Ver o painel ao vivo →
            </button>
          </div>
        </section>

        {/* Números — prova quantitativa */}
        <section className="border-y border-gray-200 bg-[#FFFFFF]">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              <Stat valor="847" label="sinais psicográficos capturados nos últimos 30 dias" />
              <Stat valor="312" label="perfis emocionais únicos ativos" />
              <Stat valor="3,1×" label="a demanda por 'sentir algo' vs. comédia às 21h" />
              <Stat valor="47%" label="do consumo emocional noturno vem do cluster 25–34" />
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="font-body text-xs text-gray-500 hover:text-[#FF2D78] transition-colors
                           inline-flex items-center gap-1.5"
              >
                Explorar o painel completo
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3">
              Como funciona
            </p>
            <h2 className="font-display font-bold text-gray-900 text-3xl md:text-4xl leading-tight">
              Três passos entre o desejo e o dado.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <Passo
              n="1"
              titulo="Usuário responde"
              texto="Cinco perguntas rápidas e visuais sobre estado emocional, contexto de consumo e intenção. O quiz é o instrumento — o usuário só quer o filme certo para agora."
            />
            <Passo
              n="2"
              titulo="Sinal é capturado"
              texto="Cada resposta gera um vetor em seis dimensões emocionais, cruzado com horário, dispositivo e sequência de escolhas. Anonimizado e agregado desde a origem."
            />
            <Passo
              n="3"
              titulo="Você acessa"
              texto="Relatório sob demanda, painel de assinatura ou teste de hipótese comissionado. Três formas de tirar decisão de conteúdo, mídia e catálogo baseada em desejo real."
            />
          </div>
        </section>

        {/* Para quem */}
        <section className="bg-[#FFFFFF] border-y border-gray-200">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-20">
            <div className="text-center mb-10">
              <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3">
                Feito para
              </p>
              <h2 className="font-display font-bold text-gray-900 text-3xl md:text-4xl leading-tight">
                Quem decide o que o público vai sentir.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Persona
                tag="Produtoras"
                titulo="Antes de green-light."
                descricao="Descubra se a emoção que o roteiro promete tem demanda no público — e em que janela do dia ela pico. Reduz o risco antes de comprometer o orçamento."
              />
              <Persona
                tag="Agências"
                titulo="Ative com precisão emocional."
                descricao="Direcione compra de mídia por estado emocional, não só por demografia. Sabe quando seu público-alvo está buscando o tipo de conteúdo que sua campanha reforça."
              />
              <Persona
                tag="Streaming"
                titulo="Nichos que o algoritmo perde."
                descricao="Seu algoritmo aprende com quem já assistiu. O nosso captura desejo autêntico no momento da decisão — inclusive dos que fecham o app sem escolher."
              />
            </div>
          </div>
        </section>

        {/* Diferenciação */}
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3">
              O que muda
            </p>
            <h2 className="font-display font-bold text-gray-900 text-3xl md:text-4xl leading-tight">
              Não é mais uma pesquisa.
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6 md:p-8">
            <Diferencial
              contra="Histórico do que já foi assistido"
              favor="Desejo capturado no momento da decisão"
            />
            <Diferencial
              contra="Painel declarativo (o que dizem que gostam)"
              favor="Sinal comportamental (o que buscam quando ninguém vê)"
            />
            <Diferencial
              contra="Segmentação por gênero de conteúdo"
              favor="Segmentação por emoção × contexto × horário"
            />
            <Diferencial
              contra="Amostra recrutada, resposta enviesada"
              favor="Base viva, resposta espontânea, agregação LGPD-compliant"
            />
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#FFFFFF] border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
            <h2 className="font-display font-bold text-gray-900 text-3xl md:text-4xl leading-tight mb-4">
              Pronto para ver o<br className="hidden sm:block" /> que os catálogos <span className="text-[#FF2D78]">não veem</span>?
            </h2>
            <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
              Comece pelo painel de demonstração ou fale com o time de vendas para
              um diagnóstico do seu contexto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                onClick={() => navigate('/planos')}
                className="font-body text-sm font-semibold rounded-xl px-8 py-3.5
                           bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all"
              >
                Ver planos e preços
              </button>
              <a
                href="mailto:vendas@topfilme.com.br?subject=Contato%20B2B"
                className="font-body text-sm font-semibold rounded-xl px-6 py-3.5
                           border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                Falar com vendas
              </a>
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#FF2D78] font-display font-bold text-lg">✦</span>
              <span className="font-display font-bold text-gray-900 text-sm">Top Filme</span>
              <span className="font-body text-xs text-gray-400">· Inteligência de consumo audiovisual</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a href="mailto:vendas@topfilme.com.br"
                 className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
                vendas@topfilme.com.br
              </a>
              <button onClick={() => navigate('/dashboard')}
                      className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Painel
              </button>
              <button onClick={() => navigate('/planos')}
                      className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Planos
              </button>
              <button onClick={() => navigate('/')}
                      className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
                App do usuário
              </button>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
