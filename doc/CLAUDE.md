# CLAUDE.md — Contexto de Sessão: Top Filme

> Arquivo de persistência de contexto para o agente Claude Code.
> Ler integralmente ao iniciar nova sessão neste projeto.
> Atualizado em: 2026-06-18 (Sessão 2 — entrega FIAP concluída)

---

## Projeto

**Top Filme** — plataforma web de recomendação de filmes por estado emocional.
O usuário responde 5 perguntas visuais e recebe 3 indicações de filmes em carrossel.

**Reframing central (pitch FIAP):** o negócio real é B2B — dados psicográficos gerados
pelas interações, vendidos para produtoras, agências e plataformas de streaming.
O app é o instrumento de coleta.

---

## Status atual

**Passo 1 entregue.** Frontend mockado, sem backend, hospedado no Railway.

- [x] Landing page
- [x] Tela Cadastro/Login (simulada, sem auth real)
- [x] Página Principal (Home — histórico mockado, CTA mint, paginação)
- [x] Fluxo de Perguntas (Quiz 5 steps com animações)
- [x] Página de Resultado (carrossel 3 filmes + chips de atributos)
- [x] 52 filmes no catálogo com posters TMDB verificados
- [x] Algoritmo cosine similarity + MMR
- [x] Deploy Railway ativo (auto-deploy no push para master)
- [ ] **Tornar repositório público** no GitHub (`MateusC033/startup_one`)

---

## Stack

| Item | Tecnologia |
|---|---|
| Build | Vite 8 |
| Framework | React 19 |
| Estilização | Tailwind CSS 3 (não v4) |
| Roteamento | React Router DOM 7 |
| Dados | JSON hardcoded (`data/movies.js`) |
| Estado transiente | `sessionStorage` (`tf_answers`, `tf_user`, `tf_quick_mood`) |
| Deploy | Railway — branch `master`, auto-deploy |
| Repositório | `https://github.com/MateusC033/startup_one.git` |

---

## Estrutura de diretórios

```
startup_one/
├── doc/
│   ├── briefing_prototipo.md
│   ├── CLAUDE.md          ← este arquivo
│   └── log.md             ← log de trabalho cronológico
└── top-filme/
    ├── src/
    │   ├── index.css      — design system, variáveis CSS, utilitários Tailwind
    │   ├── main.jsx       — entry point React
    │   ├── App.jsx        — roteamento (/, /auth, /home, /quiz, /result)
    │   ├── data/
    │   │   └── movies.js  — 52 filmes com vetores e metadados
    │   ├── utils/
    │   │   └── recommend.js — algoritmo cosine similarity + MMR
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Auth.jsx
    │       ├── Home.jsx
    │       ├── Quiz.jsx
    │       └── Result.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Design System

**Paleta "Cinema Kawaii"** — fundo escuro, acentos vibrantes, sem gradientes complexos.

| Token | Cor | Hex |
|---|---|---|
| `bg` | Fundo principal | `#0C0C0C` |
| `surface` | Cards, painéis | `#141414` |
| `surface2` | Inputs, badges | `#1C1C1C` |
| `border` | Bordas sutis | `#2A2A2A` |
| `pink` | Destaque principal | `#FF2D78` |
| `yellow` | Acento alegre | `#FFE566` |
| `mint` | Acento fresco | `#00DEB6` |
| `lavender` | Acento suave | `#B490FF` |
| `orange` | Acento vibrante | `#FF6B35` |

**Tipografia:**
- `font-display` → Space Grotesk (títulos, labels, números)
- `font-body` → Plus Jakarta Sans (textos corridos, subtítulos)

**Decoração recorrente:** estrela `✦` em `text-pink` nos cabeçalhos e CTAs.

**Barra de cores:** faixa `h-1.5` com os 5 acentos em sequência (pink → yellow → mint → lavender → orange) no topo e rodapé de cada página.

---

## Padrão crítico de contraste — texto em fundo vibrante

Sempre que um elemento tiver fundo em cor vibrante (mint, yellow, pink, orange, lavender),
usar **texto escuro** em vez de branco:

```jsx
// Fundo vibrante → texto dark (bg = #0C0C0C)
text-bg          // texto principal
text-bg/60       // texto secundário
bg-bg/15         // fundo de ícone/badge
border-bg/20     // borda sutil
```

Aplicado em:
- **Quiz:** hover nos cards de opção → `group` no `<button>` + `group-hover:text-bg`
- **Home:** card CTA "Iniciar jornada" (bg-mint) → todos os internos em `text-bg`

---

## Algoritmo de Recomendação (`utils/recommend.js`)

### Dimensões (6)

`humor`, `emocional`, `acao`, `reflexivo`, `social`, `atencao`

### Fluxo

1. **`buildUserVector(answers)`** — soma vetores das respostas com pesos por pergunta,
   normaliza dividindo pelo componente máximo
2. **`cosineSim(a, b)`** — similaridade de cosseno entre dois vetores de 6 dimensões
3. **`getRecommendations(answers)`** — ranking por cosine sim, depois MMR com λ=0.35
   para selecionar top-3 diversificados

### Pesos por pergunta

```js
const WEIGHTS = [1.5, 0.8, 1.0, 1.5, 1.2]
// Q1 estado emocional (peso alto — sinal primário)
// Q2 companhia (peso baixo — contexto secundário)
// Q3 atenção (peso médio)
// Q4 destino emocional (peso alto — sinal primário)
// Q5 tipo de mundo (peso médio-alto)
```

### Por que cosine + MMR?

Dot product simples recompensava filmes com muitos valores altos (ex: Cavaleiro das Trevas,
Vingadores) que dominavam todos os cenários. Cosine similarity normaliza a magnitude.
MMR garante que os 3 resultados não sejam variações do mesmo filme.

---

## Catálogo de filmes (`data/movies.js`)

52 filmes. Cada entrada tem:

```js
{
  id, titulo, tagline, porQueAgora,    // metadados textuais
  poster,                              // URL completa TMDB w500
  humor, emocional, acao, reflexivo, social, atencao  // scores 0–1
}
```

**URL base dos posters:** `https://image.tmdb.org/t/p/w500/{poster_path}`

**Atenção ao verificar posters:** alguns paths encontrados em buscas genéricas são 404.
Sempre verificar com `curl -I <url>` antes de adicionar ao catálogo.

---

## Páginas — notas técnicas

### Landing.jsx
- Headline: "O filme **certo**" (`text-mint`) + "**para agora.**" (`text-lavender`)
- Emojis flutuantes animados como decoração de fundo
- Stats: `{ n: '5', label: 'cliques', color: 'text-mint' }` etc.
- Botões CTA em `btn-primary` (pink)

### Auth.jsx
- Login/cadastro simulado; salva nickname em `sessionStorage.setItem('tf_user', nome)`
- Redireciona para `/home` após submit

### Home.jsx
- Lê `tf_user` do sessionStorage para exibir nome
- CTA card: `bg-mint`, todos elementos internos em `text-bg` (contraste dark)
- Mood chips rápidos: salvam `tf_quick_mood` em sessionStorage e vão para `/quiz`
- Histórico: 6 entradas mock, PAGE_SIZE=3, paginação com dots em `bg-lavender`

### Quiz.jsx
- 5 perguntas (`QUESTIONS` array), animação slide-in/slide-out entre steps
- Click no card → avança automaticamente (sem botão "próximo")
- Salva array de respostas: `sessionStorage.setItem('tf_answers', JSON.stringify(answers))`
- Padrão `group` no button + `group-hover:text-bg` nos textos para legibilidade no hover

### Result.jsx
- Lê `tf_answers` do sessionStorage → `getRecommendations(answers)` → 3 filmes
- Carrossel: card central (flex-1) + 2 laterais (`w-[29%]`), `items-center` no container
- Fade + rotate com `locked` ref para evitar cliques duplos rápidos
- Componente `<Poster>` reseta erro via `useEffect([src])` ao trocar de filme

---

## Deploy

**Railway** — conectado ao GitHub `MateusC033/startup_one`, branch `master`.

Para publicar uma alteração:
```bash
npm run build        # em top-filme/
git add <arquivos>
git commit -m "mensagem"
git push origin master   # Railway deploya automaticamente
```

Build atual: ~287kb JS, 26kb CSS (gzip: 89kb / 5.6kb).

---

## Pendências futuras

### Curto prazo (próxima sessão)
- Tornar repositório público: Settings → Danger Zone → Make public no GitHub

### Passo 2 (pós-FIAP)
- Backend real: Django + MySQL (ou FastAPI + PostgreSQL)
- Autenticação real (JWT ou session-based)
- Integração com TMDB API (remover mock, buscar filmes em tempo real)
- Salvar histórico do usuário no banco

### Passo 3 (opcional)
- Dashboard analítico B2B (dados psicográficos agregados)
