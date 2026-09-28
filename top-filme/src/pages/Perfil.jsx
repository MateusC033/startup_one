import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../utils/api'

const HUMOR_META = {
  sentir: { label: 'Sentir algo', cor: 'bg-lavender', text: 'text-lavender', border: 'border-lavender/30' },
  rir:    { label: 'Levinho',     cor: 'bg-yellow',   text: 'text-yellow',   border: 'border-yellow/30'   },
  pensar: { label: 'Curioso',     cor: 'bg-mint',     text: 'text-mint',     border: 'border-mint/30'     },
  acao:   { label: 'Ação',        cor: 'bg-orange',   text: 'text-orange',   border: 'border-orange/30'   },
}

function formatarData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

export default function Perfil() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(auth.getUser())
  const [perfil, setPerfil] = useState(null)
  const [total, setTotal] = useState(null)

  useEffect(() => {
    if (!auth.isLogged()) {
      navigate('/auth')
      return
    }
    api.me().then(u => { setUserData(u); auth.setUser(u) }).catch(() => {})
    api.meuPerfil().then(p => { setPerfil(p); setTotal(p.total) }).catch(() => {})
  }, [navigate])

  const handleSair = async () => {
    await api.logout()
    auth.fullLogout()
    navigate('/')
  }

  const dominante = perfil?.humor_dominante
  const meta = dominante ? HUMOR_META[dominante.key] : null

  return (
    <div className="min-h-dvh bg-bg flex flex-col">

      {/* Top color bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 md:px-10 border-b border-border">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 group">
          <span className="text-pink font-display font-bold text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
          <span className="font-body text-xs text-white/30 border-l border-border pl-2 ml-1">
            Perfil
          </span>
        </button>
        <button
          onClick={() => navigate('/home')}
          className="font-body text-white/50 text-sm hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>←</span> Voltar
        </button>
      </header>

      <main className="flex-1 px-5 py-8 md:px-10 max-w-3xl mx-auto w-full space-y-6">

        {/* Título */}
        <div className="animate-fade-in">
          <p className="font-body text-white/30 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="text-pink">✦</span> Minha conta
          </p>
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight">
            Olá, <span className="text-lavender">{userData?.nickname || 'você'}</span>.
          </h1>
        </div>

        {/* Card: dados da conta */}
        <div className="card-surface p-6 space-y-4 animate-fade-in"
             style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-semibold text-white text-base">Dados da conta</h2>
            <span className="font-body text-xs text-white/30">só você vê isso</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Nickname" valor={userData?.nickname} />
            <Campo label="Email" valor={userData?.email} />
            <Campo label="Nascimento" valor={userData?.nascimento ? formatarData(userData.nascimento) : '—'} />
            <Campo label="Conta desde" valor={formatarData(userData?.criado_em)} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-border">
            <button className="btn-ghost text-sm flex-1 opacity-60 cursor-not-allowed" disabled>
              Editar dados (em breve)
            </button>
            <button
              onClick={handleSair}
              className="font-body text-sm border border-pink/30 text-pink hover:bg-pink/10
                         rounded-xl px-6 py-3 transition-all"
            >
              Sair da conta
            </button>
          </div>
        </div>

        {/* Card: perfil emocional */}
        <div className="card-surface p-6 space-y-5 animate-fade-in"
             style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-white text-base">Seu perfil emocional</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="font-body text-xs text-lavender hover:text-white transition-colors"
            >
              Ver painel geral →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-body text-white/40 text-[10px] uppercase tracking-widest mb-1">Análises feitas</p>
              <p className="font-display font-bold text-white text-4xl leading-none tabular-nums">
                {total ?? '—'}
              </p>
            </div>
            <div>
              <p className="font-body text-white/40 text-[10px] uppercase tracking-widest mb-2">Humor dominante</p>
              {meta ? (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1
                                  bg-black/20 border ${meta.border}`}>
                  <span className={meta.text}>✦</span>
                  <span className={`font-display font-semibold text-sm ${meta.text}`}>{meta.label}</span>
                </span>
              ) : (
                <span className="font-body text-white/40 text-sm">sem dados ainda</span>
              )}
            </div>
          </div>

          {perfil?.distribuicao && (
            <div className="space-y-2 pt-3 border-t border-border">
              <p className="font-body text-white/40 text-[10px] uppercase tracking-widest mb-2">
                Distribuição das suas análises
              </p>
              {perfil.distribuicao.map(d => {
                const cor = HUMOR_META[d.key]?.cor || 'bg-white/30'
                return (
                  <div key={d.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-white/60 text-xs">{d.label}</span>
                      <span className="font-display text-white/80 text-xs tabular-nums">{d.valor}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface2 overflow-hidden">
                      <div className={`h-full rounded-full ${cor} transition-all duration-700`}
                           style={{ width: `${d.valor}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Card: LGPD */}
        <div className="card-surface p-6 space-y-4 animate-fade-in"
             style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-white text-base">Uso dos seus dados</h2>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border
              ${userData?.aceite_lgpd
                ? 'bg-mint/10 border-mint/30 text-mint'
                : 'bg-orange/10 border-orange/30 text-orange'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="font-body text-xs font-medium">
                {userData?.aceite_lgpd ? 'Autorizado' : 'Pendente'}
              </span>
            </span>
          </div>

          <p className="font-body text-white/60 text-sm leading-relaxed">
            Suas análises são anonimizadas e agregadas em relatórios de inteligência
            de mercado vendidos a produtoras, agências e plataformas de streaming.
            Nenhum dado individual sai daqui.
          </p>

          {userData?.aceite_lgpd_data && (
            <p className="font-body text-white/40 text-xs">
              Aceite registrado em {formatarData(userData.aceite_lgpd_data)}.
            </p>
          )}

          <div className="pt-3 border-t border-border">
            <button className="btn-ghost text-sm w-full opacity-60 cursor-not-allowed" disabled>
              Revogar autorização (em breve)
            </button>
          </div>
        </div>

      </main>

      {/* Bottom color bar */}
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

function Campo({ label, valor }) {
  return (
    <div>
      <p className="font-body text-white/40 text-[10px] uppercase tracking-widest mb-1">{label}</p>
      <p className="font-body text-white text-sm">{valor || '—'}</p>
    </div>
  )
}
