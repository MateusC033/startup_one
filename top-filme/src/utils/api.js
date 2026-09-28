// Cliente da API do backend Django local.
// Base URL: http://localhost:8000/api. Se precisar mudar, defina VITE_API_URL.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/* ─── Storage helpers ────────────────────────────────────────────── */

export const auth = {
  getToken:      () => sessionStorage.getItem('tf_token'),
  setToken:      (t) => sessionStorage.setItem('tf_token', t),
  clearToken:    () => sessionStorage.removeItem('tf_token'),
  getUser:       () => {
    const raw = sessionStorage.getItem('tf_user_data')
    return raw ? JSON.parse(raw) : null
  },
  setUser:       (u) => sessionStorage.setItem('tf_user_data', JSON.stringify(u)),
  clearUser:     () => sessionStorage.removeItem('tf_user_data'),
  isLogged:      () => !!sessionStorage.getItem('tf_token'),

  getEmpresaToken:   () => sessionStorage.getItem('tf_empresa_token'),
  setEmpresaToken:   (t) => sessionStorage.setItem('tf_empresa_token', t),
  clearEmpresaToken: () => sessionStorage.removeItem('tf_empresa_token'),
  getEmpresa:        () => {
    const raw = sessionStorage.getItem('tf_empresa')
    return raw ? JSON.parse(raw) : null
  },
  setEmpresa:        (e) => sessionStorage.setItem('tf_empresa', JSON.stringify(e)),
  clearEmpresa:      () => sessionStorage.removeItem('tf_empresa'),

  fullLogout: () => {
    sessionStorage.removeItem('tf_token')
    sessionStorage.removeItem('tf_user_data')
    sessionStorage.removeItem('tf_user')
    sessionStorage.removeItem('tf_answers')
    sessionStorage.removeItem('tf_quick_mood')
  },
}

/* ─── Fetch wrapper ──────────────────────────────────────────────── */

async function request(path, { method = 'GET', body, useToken, useEmpresaToken } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (useToken) {
    const t = auth.getToken()
    if (t) headers['Authorization'] = `Token ${t}`
  }
  if (useEmpresaToken) {
    const t = auth.getEmpresaToken()
    if (t) headers['X-Empresa-Token'] = t
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    const err = new Error(data.detail || 'Erro na requisição')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

/* ─── B2C ────────────────────────────────────────────────────────── */

export const api = {
  register: (payload)   => request('/register', { method: 'POST', body: payload }),
  login:    (payload)   => request('/login',    { method: 'POST', body: payload }),
  logout:   ()          => request('/logout',   { method: 'POST', useToken: true }).catch(() => {}),
  me:       ()          => request('/me',       { useToken: true }),

  salvarAnalise: (respostas, recomendacoes, quick_mood) =>
    request('/analises', {
      method: 'POST',
      body: { respostas, recomendacoes, quick_mood: quick_mood || null },
      useToken: true,
    }),

  minhasAnalises: ()    => request('/analises/me', { useToken: true }),
  meuPerfil:      ()    => request('/perfil/me',   { useToken: true }),

  /* B2B */
  empresaRegister: (payload) => request('/empresa/register', { method: 'POST', body: payload }),
  empresaLogin:    (payload) => request('/empresa/login',    { method: 'POST', body: payload }),
  empresaLogout:   ()        => request('/empresa/logout',   { method: 'POST', useEmpresaToken: true }).catch(() => {}),
  empresaMe:       ()        => request('/empresa/me',       { useEmpresaToken: true }),
  dashboard:       ()        => request('/dashboard',        { useEmpresaToken: true }),
}
