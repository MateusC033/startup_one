import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../utils/api'

/* Mapeia domínio → nome de empresa para simular reconhecimento corporativo */
const DOMINIOS_CONHECIDOS = {
  'netflix.com':      'Netflix Brasil',
  'globo.com':        'Globo Filmes',
  'primevideo.com':   'Prime Video LatAm',
  'disney.com':       'Disney+ Brasil',
  'sonypictures.com': 'Sony Pictures BR',
  'warnerbros.com':   'Warner Bros. Discovery',
  'paramount.com':    'Paramount+ Brasil',
  'o2filmes.com':     'O2 Filmes',
  'gullane.com':      'Gullane Filmes',
  'conspiração.com':  'Conspiração',
  'netflix.demo.topfilme.local': 'Netflix Brasil',
  'globo.demo.topfilme.local':   'Globo Filmes',
  'prime.demo.topfilme.local':   'Prime Video LatAm',
}

function inferirEmpresa(email) {
  if (!email || !email.includes('@')) return null
  const dominio = email.split('@')[1]?.toLowerCase().trim()
  return DOMINIOS_CONHECIDOS[dominio] || null
}

/* ═══ Componentes ══════════════════════════════════════════════════ */

function Campo({ label, type = 'text', value, onChange, placeholder, required, hint, hintColor }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs uppercase tracking-wider text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bg-[#FFFFFF] border border-gray-300 rounded-xl px-4 py-3 font-body text-gray-900 text-sm
                   placeholder:text-gray-400 focus:outline-none focus:border-[#FF2D78] focus:ring-2 focus:ring-[#FF2D78]/10 transition-all"
      />
      {hint && (
        <p className={`font-body text-xs ${hintColor || 'text-gray-500'} mt-0.5`}>{hint}</p>
      )}
    </div>
  )
}

/* ═══ Página ═══════════════════════════════════════════════════════ */

export default function EmpresaLogin() {
  const navigate = useNavigate()
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ email: '', senha: '', cnpj: '', empresa: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const empresaInferida = inferirEmpresa(form.email)
  const isCadastro = modo === 'cadastro'

  // Ao mudar o email, auto-preenche o nome da empresa (se reconhecido e campo ainda vazio)
  const handleEmailChange = (novoEmail) => {
    setForm(f => {
      const nomeAtual = f.empresa
      const dominioAntigo = f.email?.split('@')[1]?.toLowerCase()
      const dominioNovo = novoEmail?.split('@')[1]?.toLowerCase()
      const nomeInferidoAntigo = DOMINIOS_CONHECIDOS[dominioAntigo]
      const nomeInferidoNovo = DOMINIOS_CONHECIDOS[dominioNovo]
      // Só sobrescreve se o usuário não digitou algo diferente do inferido anterior
      const podeAtualizar = !nomeAtual || nomeAtual === nomeInferidoAntigo
      return {
        ...f,
        email: novoEmail,
        empresa: podeAtualizar && nomeInferidoNovo ? nomeInferidoNovo : nomeAtual,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const nomeEmpresa = form.empresa || empresaInferida || `Empresa · ${form.email.split('@')[0]}`
      const resp = isCadastro
        ? await api.empresaRegister({
            nome: nomeEmpresa,
            email_corp: form.email,
            password: form.senha,
            cnpj: form.cnpj || '',
            plano: 'painel',
          })
        : await api.empresaLogin({ email_corp: form.email, password: form.senha })

      auth.setEmpresaToken(resp.token)
      auth.setEmpresa({
        nome: resp.empresa.nome,
        email: resp.empresa.email_corp,
        cnpj: resp.empresa.cnpj,
        plano: resp.empresa.plano_ativo || 'Painel de Inteligência',
        ativo: resp.empresa.assinatura_ativa,
      })
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.data?.detail
        || (err?.data && typeof err.data === 'object' ? Object.values(err.data).flat().join(' ') : '')
        || 'Erro ao autenticar. Verifique se o backend está rodando.'
      setErro(msg)
    } finally {
      setCarregando(false)
    }
  }

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
            <span className="font-display font-bold text-gray-900 text-base tracking-tight">
              Top Filme
            </span>
            <span className="font-body text-xs text-gray-400 border-l border-gray-200 pl-2 ml-1">
              Empresas
            </span>
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => navigate('/planos')}
              className="hidden sm:inline-block font-body text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              Planos
            </button>
            <button
              onClick={() => navigate('/para-empresas')}
              className="font-body text-sm text-gray-600 hover:text-gray-900
                         px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
            >
              <span>←</span> Voltar
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 md:px-8 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-[#FFFFFF] p-6 md:p-8">

            <div className="mb-6">
              <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-2">
                {isCadastro ? 'Criar conta empresa' : 'Acesso corporativo'}
              </p>
              <h1 className="font-display font-bold text-gray-900 text-2xl md:text-3xl leading-tight">
                {isCadastro ? 'Cadastre sua empresa.' : 'Entre na sua conta empresa.'}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Campo
                label="Email corporativo"
                type="email"
                placeholder="nome@empresa.com.br"
                value={form.email}
                onChange={handleEmailChange}
                required
                hint={empresaInferida ? `Reconhecemos ${empresaInferida}` : undefined}
                hintColor={empresaInferida ? 'text-[#FF2D78] font-semibold' : undefined}
              />

              {isCadastro && (
                <Campo
                  label="Nome da empresa"
                  type="text"
                  placeholder={empresaInferida || 'Sua empresa'}
                  value={form.empresa}
                  onChange={v => setForm(f => ({ ...f, empresa: v }))}
                  required={isCadastro}
                />
              )}

              <Campo
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={form.senha}
                onChange={v => setForm(f => ({ ...f, senha: v }))}
                required
              />

              {isCadastro && (
                <Campo
                  label="CNPJ"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={v => setForm(f => ({ ...f, cnpj: v }))}
                  hint="Opcional agora. Solicitado na primeira nota fiscal."
                />
              )}

              {erro && (
                <div className="rounded-xl border border-[#FF2D78]/40 bg-[#FF2D78]/5 px-3 py-2">
                  <p className="font-body text-[#FF2D78] text-xs">{erro}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full font-body text-sm font-semibold rounded-xl py-3
                           bg-[#FF2D78] text-white hover:bg-[#E5236A] transition-all mt-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? 'Aguarde…' : (isCadastro ? 'Criar conta empresa' : 'Entrar')}
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center font-body text-sm text-gray-500 mt-6">
              {isCadastro ? 'Já tem conta empresa?' : 'Ainda não tem conta empresa?'}{' '}
              <button
                type="button"
                onClick={() => setModo(isCadastro ? 'login' : 'cadastro')}
                className="text-[#FF2D78] hover:text-[#E5236A] font-semibold transition-colors"
              >
                {isCadastro ? 'Entrar' : 'Cadastrar'}
              </button>
            </p>
          </div>

          {/* Links auxiliares */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <button
              onClick={() => navigate('/planos')}
              className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Ver planos e preços
            </button>
            <span className="hidden sm:inline text-gray-300">·</span>
            <button
              onClick={() => navigate('/auth')}
              className="font-body text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sou pessoa física — ir ao app
            </button>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-gray-200 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 text-center">
          <p className="font-body text-xs text-gray-400">
            Ambiente de demonstração. Dados agregados e anonimizados.
          </p>
        </div>
      </footer>

    </div>
  )
}
