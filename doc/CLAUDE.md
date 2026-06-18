# CLAUDE.md — Contexto de Sessão: Top Filme

> Arquivo de persistência de contexto para o agente Claude Code.
> Ler integralmente ao iniciar nova sessão neste projeto.
> Atualizado em: 2026-06-18

---

## Projeto

**Top Filme** — plataforma web de recomendação de filmes por estado emocional.
O usuário responde 3 perguntas visuais e recebe 2 indicações de filmes.

**Reframing central:** o negócio real é B2B — dados psicográficos gerados pelas interações,
vendidos para produtoras, agências e plataformas de streaming. O app é o instrumento de coleta.

---

## Prazo e entregas

- **Entrega Passo 1:** 18/06/2026 (hoje) — interface completa MOCKADA
- **Passo 2 (pós-entrega):** backend real, autenticação, integração TMDB
- **Passo 3 (opcional):** dashboard analítico

---

## Stack — Passo 1

| Item | Tecnologia |
|---|---|
| Framework | Vite + React 18 |
| Estilização | Tailwind CSS |
| Lógica | JavaScript puro (frontend) |
| Dados | JSON hardcoded |
| Deploy | Railway (estático) |

---

## Telas a construir

- [ ] **Landing page** — logo, frase de posicionamento, botão de acesso
- [ ] **Cadastro/Login** — formulário simples, sem auth real (simular fluxo)
- [ ] **Página principal** — histórico mockado + botão "Iniciar nova análise"
- [ ] **Fluxo de perguntas** — 3 perguntas, multi-step, transição suave, sem reload
- [ ] **Resultado** — 1 indicação principal + 1 alternativa + botão nova análise

---

## Algoritmo de recomendação

Cada filme tem um vetor de 6 dimensões (valores 0–1):
`humor`, `emocional`, `acao`, `reflexivo`, `social`, `atencao`

As respostas do usuário geram um vetor equivalente. Similaridade por produto escalar ponderado.

### Mapeamento de respostas → vetor

**Pergunta 1 — estado emocional:**
- "Levinho, quero rir" → `{ humor:0.9, emocional:0.1, acao:0.2, reflexivo:0.1 }`
- "Com vontade de sentir algo" → `{ humor:0.1, emocional:0.9, acao:0.2, reflexivo:0.5 }`
- "Agitado, quero ação" → `{ humor:0.2, emocional:0.3, acao:0.9, reflexivo:0.2 }`
- "Curioso, quero pensar" → `{ humor:0.2, emocional:0.5, acao:0.2, reflexivo:0.9 }`

**Pergunta 2 — contexto social (dimensão `social`):**
- "Sozinho" → 0.1
- "Com alguém especial" → 0.4
- "Com amigos" → 0.7
- "Com a família" → 1.0

**Pergunta 3 — atenção (dimensão `atencao`):**
- "Pouco — só quero relaxar" → 0.1
- "Médio — me envolvo sem esforço" → 0.5
- "Total — pode ser intenso" → 0.9

---

## Filmes do mock (12 filmes)

| Filme | humor | emocional | acao | reflexivo | social | atencao |
|---|---|---|---|---|---|---|
| Interestelar | 0.1 | 0.8 | 0.4 | 0.9 | 0.3 | 0.9 |
| O Auto da Compadecida | 0.9 | 0.6 | 0.4 | 0.4 | 0.8 | 0.4 |
| Divertida Mente | 0.7 | 0.8 | 0.2 | 0.6 | 0.9 | 0.3 |
| Nada de Novo no Front | 0.0 | 0.9 | 0.7 | 0.9 | 0.1 | 0.8 |
| Mad Max: Estrada da Fúria | 0.1 | 0.4 | 0.9 | 0.4 | 0.4 | 0.6 |
| Parasita | 0.3 | 0.8 | 0.5 | 0.9 | 0.3 | 0.9 |
| A Vida é Bela | 0.6 | 0.9 | 0.1 | 0.6 | 0.6 | 0.5 |
| Se Beber Não Case | 0.9 | 0.3 | 0.3 | 0.1 | 0.8 | 0.2 |
| Clube da Luta | 0.2 | 0.7 | 0.6 | 0.9 | 0.1 | 0.9 |
| O Rei Leão (1994) | 0.6 | 0.8 | 0.3 | 0.5 | 1.0 | 0.3 |
| John Wick | 0.2 | 0.3 | 0.9 | 0.2 | 0.4 | 0.5 |
| Comer, Rezar, Amar | 0.4 | 0.7 | 0.1 | 0.7 | 0.4 | 0.4 |

---

## Design

- Minimalista, moderno, fluido
- Tema escuro com acentos vibrantes (tom cinema)
- Tipografia limpa, espaçamento generoso
- Transição suave entre perguntas (sem reload entre steps)
- Click no card = avança automaticamente (sem botão "próximo")
- Barra de progresso discreta no topo do fluxo

---

## Entrega FIAP (template)

1. **Descrição** — protótipo como primeiro instrumento de validação; fluxo empático; reframing B2B
2. **Prints** — cada tela principal
3. **Link** — deploy no Railway

---

## Estrutura de diretórios do projeto

```
startup_one/
├── doc/
│   ├── briefing_prototipo.md
│   ├── CLAUDE.md          ← este arquivo
│   └── log.md             ← log de trabalho
└── (app — a criar)
```

---

## Estado atual

- [x] Briefing lido e analisado
- [x] CLAUDE.md criado
- [x] log.md criado
- [x] Projeto React inicializado (`top-filme/`)
- [x] Design system configurado (Tailwind, fontes, paleta "Cinema Kawaii")
- [x] Dados dos filmes e algoritmo de recomendação
- [x] Landing Page
- [x] Tela Cadastro/Login
- [x] Página Principal (Home com histórico mockado)
- [x] Fluxo de Perguntas (Quiz multi-step com animações)
- [x] Página de Resultado (2 indicações + chips de atributos)
- [x] Build verificado (`npm run build` ✓)
- [ ] Deploy no Railway
- [ ] Refinamento de design (pós-corrida)
- [ ] Passo 2: backend, autenticação real, TMDB API
