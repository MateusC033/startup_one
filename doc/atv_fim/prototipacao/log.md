# Log de Trabalho — Top Filme

---

## 2026-06-18

### 16:30 — Sessão iniciada

- Usuário apresentou o projeto Top Filme com prazo de entrega para hoje (18/06/2026)
- Briefing lido na íntegra (`doc/briefing_prototipo.md`)
- Criados arquivos `CLAUDE.md` e `log.md` em `/doc`
- Estratégia de desenvolvimento alinhada com o usuário
- Git inicializado, repositório remoto configurado em GitHub
- Permissões do projeto configuradas (`bypassPermissions`)

### 17:30 — Passo 1 construído (build ✓)

Stack utilizada: Vite + React 19 + Tailwind CSS 3 + React Router DOM 7

**Design:** "Cinema Kawaii" — fundo escuro (#0C0C0C), sem gradientes, cores sólidas vibrantes
(pink #FF2D78, yellow #FFE566, mint #00DEB6, lavender #B490FF, orange #FF6B35),
tipografia Space Grotesk (display) + Plus Jakarta Sans (body), estrelas decorativas ✦.

**Arquivos criados em `top-filme/src/`:**
- `index.css` — design system, variáveis, componentes utilitários
- `main.jsx` — entry point React
- `App.jsx` — roteamento com React Router
- `data/movies.js` — 12 filmes com vetores de atributos e metadados
- `utils/recommend.js` — algoritmo de recomendação (dot product por dimensão)
- `pages/Landing.jsx` — landing page com hero, badge, stats e barra de cores
- `pages/Auth.jsx` — cadastro/login simulado (sem auth real), toggle entre modos
- `pages/Home.jsx` — página logada, histórico mockado (3 entradas), CTA destacado
- `pages/Quiz.jsx` — 3 perguntas multi-step, animação slide entre steps, barra de progresso
- `pages/Result.jsx` — 2 indicações (principal + alternativa), chips de atributos

**Build:** `vite build` ✓ (31 módulos, 260kb JS, 16kb CSS)

**Próximos passos:**
- Deploy no Railway
- Refinamento de designer (quando o usuário voltar)
- Passo 2: backend real (Django + MySQL), autenticação, integração TMDB API

---

## 2026-06-18 — Sessão 2 (refinamento e entrega final)

### Catálogo expandido: 12 → 52 filmes

- Adicionados 40 filmes ao `data/movies.js`, todos com vetores de 6 dimensões calibrados
- Todos os posters verificados via TMDB — URLs: `https://image.tmdb.org/t/p/w500/{path}`
- Dois filmes tinham paths quebrados (404):
  - *O Auto da Compadecida*: path corrigido para `/imcOp1kJsCsAFCoOtY5OnPrFbAf.jpg`
  - *Se Beber, Não Case!*: path corrigido para `/m0tQyMdp3fy5ooUOQkJMd1fQKBJ.jpg`
- Scores inflados corrigidos: O Cavaleiro das Trevas (`reflexivo 0.8→0.6`) e Vingadores Ultimato (`emocional 0.8→0.65`)

### Quiz expandido: 3 → 5 perguntas

- Q1: estado emocional (rir / sentir / ação / pensar)
- Q2: companhia (sozinho / especial / amigos / família)
- Q3: nível de atenção (relaxar / médio / intenso)
- Q4: como quer se sentir no final (inspirado / aliviado / pensativo / animado)
- Q5: tipo de mundo (real / épico / íntimo / surpresas)

### Algoritmo de recomendação reformulado

**Problema:** filmes com vetores grandes em muitas dimensões (Cavaleiro das Trevas, Vingadores)
dominavam os resultados via produto escalar, mesmo em contextos inadequados.

**Solução em `utils/recommend.js`:**
1. **Cosine similarity** — normaliza magnitude dos vetores, penaliza filmes "genéricos"
2. **MMR (Maximal Marginal Relevance)** com λ=0.35 — top-3 diversificados
3. **Pesos por pergunta:** `[1.5, 0.8, 1.0, 1.5, 1.2]` — Q1 e Q4 têm peso mais alto
4. **Normalização do vetor do usuário** — divide pelo componente máximo (escala 0–1)

Testes A/B em 8 cenários: todos com recomendações contextualmente adequadas.

### Deploy no Railway

- Repositório GitHub (`MateusC033/startup_one`) conectado ao Railway
- Auto-deploy configurado no branch `master`
- Fluxo: `npm run build` → `git push origin master` → Railway deploya automaticamente
- App em produção servindo `top-filme/dist`

### Refinamentos visuais — Landing

- Headline: "certo" em `text-mint`, "para agora." em `text-lavender`
- Removido sublinhado decorativo (gradient underline)
- Stats: "5 cliques" com cor `text-mint`

### Refinamentos visuais — Home

- Saudação: "o seu filme." em `text-lavender`
- Card CTA "Iniciar jornada": `bg-mint` (era pink)
- Fix de contraste: elementos internos do card mint → `text-bg` / `bg-bg/XX` / `border-bg`
  (padrão "texto escuro sobre fundo vibrante", igual ao Quiz hover)
- Cards de histórico: poster `w-16 h-24`, fallback emoji se imagem quebrar
- Paginação: PAGE_SIZE=3, 6 filmes mock, dots em `bg-lavender`
- Botões paginação: `bg-surface border border-border text-white/70` (era cinza invisível)

### Refinamentos visuais — Quiz

- Padrão hover legível: `group` no `<button>` + `group-hover:text-bg` nos textos
- Estado selecionado: `text-bg` e `bg-black/15`

### Refinamentos visuais — Result

- Cards laterais: `w-[29%]`, container com `items-center`

### Estado do repositório ao encerrar

```
branch: master | último commit: b871a52
fix: improve contrast on mint CTA card in Home
```

### Pendência para próxima sessão

- Tornar o repositório público no GitHub (`MateusC033/startup_one`)

---
