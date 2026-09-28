import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../utils/api'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    email: '', senha: '', nickname: '', nascimento: '', aceite: false,
  })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (isRegister && !form.aceite) {
      setErro('É preciso aceitar os termos de uso de dados.')
      return
    }

    setCarregando(true)
    try {
      const resp = isRegister
        ? await api.register({
            email: form.email,
            nickname: form.nickname,
            nascimento: form.nascimento || null,
            password: form.senha,
            aceite_lgpd: form.aceite,
          })
        : await api.login({ identificador: form.email, password: form.senha })

      auth.setToken(resp.token)
      auth.setUser(resp.user)
      sessionStorage.setItem('tf_user', resp.user.nickname || resp.user.email.split('@')[0])
      navigate('/home')
    } catch (err) {
      const msg = err?.data?.detail
        || (err?.data && typeof err.data === 'object'
            ? Object.values(err.data).flat().join(' ')
            : '')
        || 'Erro ao autenticar. Verifique se o backend está no ar.'
      setErro(msg)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="relative min-h-dvh bg-bg flex flex-col overflow-hidden">

      {/* Blobs de cor animados — mais discretos que a Landing */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-animate-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-pink blur-[130px]"
             style={{ opacity: 0.04 }} />
        <div className="blob-animate-2 absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-lavender blur-[110px]"
             style={{ opacity: 0.04 }} />
        <div className="blob-animate-3 absolute -bottom-32 left-1/4 w-[400px] h-[400px] rounded-full bg-mint blur-[120px]"
             style={{ opacity: 0.03 }} />
      </div>

      {/* Top color bar */}
      <div className="relative z-10 flex h-1 w-full">
        <div className="flex-1 bg-pink" />
        <div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" />
        <div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <span className="text-pink font-display font-bold text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">Top Filme</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="font-body text-white/40 text-sm hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>←</span> Voltar
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">

          {/* Card */}
          <div className="card-surface p-8">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow text-sm">✦</span>
                <span className="font-body text-white/40 text-xs uppercase tracking-widest">
                  {isRegister ? 'Criar conta' : 'Bem-vindo de volta'}
                </span>
              </div>
              <h1 className="font-display font-bold text-white text-3xl">
                {isRegister ? 'Crie sua conta.' : 'Entre na sua conta.'}
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {isRegister && (
                <>
                  <Field
                    label="Nickname"
                    type="text"
                    placeholder="Como quer ser chamado?"
                    value={form.nickname}
                    onChange={v => setForm(f => ({ ...f, nickname: v }))}
                    required={isRegister}
                  />
                  <Field
                    label="Data de nascimento"
                    type="date"
                    value={form.nascimento}
                    onChange={v => setForm(f => ({ ...f, nascimento: v }))}
                    required={isRegister}
                  />
                </>
              )}

              <Field
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={v => setForm(f => ({ ...f, email: v }))}
                required
              />

              <Field
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={v => setForm(f => ({ ...f, senha: v }))}
                required
              />

              {isRegister && (
                <label className="flex items-start gap-2.5 text-left cursor-pointer group pt-1">
                  <input
                    type="checkbox"
                    checked={form.aceite}
                    onChange={e => setForm(f => ({ ...f, aceite: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded border-border bg-surface2 text-pink
                               focus:ring-pink/30 cursor-pointer accent-pink"
                    required
                  />
                  <span className="font-body text-white/60 text-xs leading-relaxed">
                    Aceito que meus dados anonimizados de uso (respostas do quiz, horário,
                    dispositivo) sejam usados para gerar inteligência de mercado agregada.
                    Posso revogar a qualquer momento em <span className="text-white/80">Perfil</span>.
                  </span>
                </label>
              )}

              {erro && (
                <div className="rounded-xl border border-pink/40 bg-pink/10 px-3 py-2">
                  <p className="font-body text-pink text-xs">{erro}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="btn-primary w-full text-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Aguarde…' : (isRegister ? 'Criar conta ✦' : 'Entrar ✦')}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="font-body text-white/30 text-xs">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Toggle */}
            <p className="text-center font-body text-white/40 text-sm mt-6">
              {isRegister ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
              <button
                type="button"
                onClick={() => setMode(isRegister ? 'login' : 'register')}
                className="text-pink hover:text-pink/80 font-medium transition-colors"
              >
                {isRegister ? 'Entrar' : 'Criar conta'}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom color bar */}
      <div className="relative z-10 flex h-1.5 w-full">
        <div className="flex-1 bg-pink" /><div className="flex-1 bg-yellow" />
        <div className="flex-1 bg-mint" /><div className="flex-1 bg-lavender" />
        <div className="flex-1 bg-orange" />
      </div>
    </div>
  )
}

function Field({ label, type, placeholder, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-white/50 text-xs uppercase tracking-wider">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="bg-surface2 border border-border rounded-xl px-4 py-3 font-body text-white text-sm
                   placeholder:text-muted focus:outline-none focus:border-pink/60 transition-colors"
      />
    </div>
  )
}
