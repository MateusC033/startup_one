# Análise — Protótipo Top Filme

> Documento vivo. Atualizado na sessão 17 (18/06) — pós-entrega.

---

## Status

✅ **Entregue em 18/06/2026.** Frontend hospedado no Railway em produção.
Repositório: `MateusC033/startup_one` (branch `master`) — **pendência: tornar público.**

---

## O que foi construído

### Stack

Vite + React 19 + Tailwind CSS 3 + React Router DOM 7. Deploy estático no Railway (auto-deploy via push no `master`).

### Design — "Cinema Kawaii"

Fundo escuro `#0C0C0C`, sem gradientes, cores sólidas vibrantes:
- pink `#FF2D78`, yellow `#FFE566`, mint `#00DEB6`, lavender `#B490FF`, orange `#FF6B35`
- Tipografia: Space Grotesk (display) + Plus Jakarta Sans (body)
- Elemento decorativo: estrelas `✦`

### Telas implementadas

| Arquivo | Tela |
|---|---|
| `Landing.jsx` | Landing page — hero, badge, stats, barra de cores |
| `Auth.jsx` | Cadastro/login simulado — toggle entre modos, sem auth real |
| `Home.jsx` | Página logada — histórico mockado (6 filmes, paginação de 3), CTA "Iniciar jornada" |
| `Quiz.jsx` | 5 perguntas multi-step — animação slide, barra de progresso, avanço automático ao clicar |
| `Result.jsx` | 2 indicações (principal + alternativa) — poster, título, chips de atributos |

### Catálogo

52 filmes com vetores de 6 dimensões calibrados. Posters via TMDB (`https://image.tmdb.org/t/p/w500/{path}`). Dois paths corrigidos durante a sessão (Auto da Compadecida, Se Beber Não Case).

### As 5 perguntas

- **Q1:** Como você está se sentindo agora? (rir / sentir / ação / pensar) — peso 1.5
- **Q2:** Vai assistir com quem? (sozinho / especial / amigos / família) — peso 0.8
- **Q3:** Quanto você consegue se concentrar hoje? (relaxar / médio / intenso) — peso 1.0
- **Q4:** Como quer se sentir no final? (inspirado / aliviado / pensativo / animado) — peso 1.5
- **Q5:** Que tipo de mundo você quer entrar? (real / épico / íntimo / surpresas) — peso 1.2

### Algoritmo de recomendação (`utils/recommend.js`)

1. **Cosine similarity** — normaliza magnitude, penaliza filmes "genéricos" que dominavam via produto escalar
2. **MMR (Maximal Marginal Relevance)** com λ=0.35 — retorna top-3 diversificados
3. **Pesos por pergunta** — Q1 e Q4 com maior peso (estado emocional + sentimento final)
4. **Normalização do vetor do usuário** — divide pelo componente máximo

Testado em 8 cenários A/B — todos com recomendações contextualmente adequadas.

---

## Próximo passo

- Tornar repositório público no GitHub
- Passo 2 (iteração futura): autenticação real, backend Django + MySQL, integração TMDB API
- Passo 3 (opcional): dashboard de dados coletados
