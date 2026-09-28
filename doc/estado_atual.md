# Top Filme — Estado atual do sistema
#fiap #ativo

> Relatório do estado do protótipo em 28/09/2026, para a sessão que vai desenvolver
> o roteiro do pitch. Todo o conteúdo é factual e verificável rodando o sistema.
> Comandos para rodar em [[comandos]].

---

## 1. O que é o Top Filme

Plataforma que ajuda o espectador a decidir o que assistir por **estado emocional**,
respondendo 5 perguntas rápidas e visuais. Recebe 3 indicações personalizadas.

**Reframing central:** o app é gratuito, mas não é o produto. É o **instrumento
de coleta** de sinais psicográficos únicos — capturados no momento exato da
decisão de assistir. Esses sinais são vendidos, agregados e anonimizados, a
produtoras, agências de marketing e plataformas de streaming.

> **Duas camadas:**
> - **B2C gratuito:** o usuário resolve a fadiga de decisão em 90 segundos.
> - **B2B pago:** produtoras compram inteligência psicográfica que os
>   algoritmos genéricos (Netflix, Prime) não conseguem capturar — porque
>   o histórico só mostra o que foi assistido, não o que era desejado.

---

## 2. Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Vite 8 + React 19 + Tailwind CSS 3 + React Router DOM 7 |
| Backend | Django 4.2 + Django REST Framework + django-cors-headers |
| Banco | SQLite (local, arquivo `backend/db.sqlite3`) |
| Auth usuário | Token de sessão (DRF `authtoken`) |
| Auth empresa | Token custom (`EmpresaToken` no banco) |
| Deploy frontend | Railway (auto-deploy no push para `master`) |
| Backend em produção | **Não deployado ainda** — roda local para o pitch |
| Repositório | `https://github.com/MateusC033/startup_one` |

Design "Cinema Kawaii" no B2C — fundo escuro `#0C0C0C`, cores vibrantes
(pink, yellow, mint, lavender, orange), tipografia Space Grotesk + Plus
Jakarta Sans. Design sóbrio branco no B2B (estilo Google Settings), para
diferenciar audiências.

---

## 3. Fluxos e páginas implementados

### 3.1 Lado B2C (usuário final)

| Rota | Página | O que faz |
|---|---|---|
| `/` | Landing | Hero animado, 20 emojis flutuantes, stats, faixa discreta "pesquisa de mercado audiovisual → para empresas" no rodapé (única ponte visível para o B2B) |
| `/auth` | Cadastro / Login | Formulário simples, aceite LGPD obrigatório no cadastro, mensagens de erro claras |
| `/home` | Área do usuário logado | Saudação personalizada, CTA gigante mint "Iniciar jornada", chips de humor rápido, histórico real do backend, card "Seu perfil emocional" com distribuição real das análises daquele usuário |
| `/quiz` | 5 perguntas | Uma pergunta por tela, animação de transição, avanço automático ao clicar. Estado emocional, companhia, atenção, destino emocional, tipo de mundo |
| `/result` | Recomendação editorial | Poster grande à esquerda, ficha à direita (ano, duração, diretor, tagline), card "Por que este filme, agora" com narrativa personalizada baseada nas respostas + `porQueAgora` do filme, chips de atributos, plataformas de streaming (mock), ações "Salvar / Já vi / Não gostei", 2 alternativas em cards horizontais |
| `/perfil` | Minha conta | Dados da conta, perfil emocional real (análises feitas, humor dominante, distribuição), status LGPD, botão sair |

**Persistência real:** ao completar o quiz, a análise é gravada no backend
(POST `/api/analises`), aparece no histórico da Home e é agregada no dashboard.

### 3.2 Lado B2B (produtoras, agências, streaming)

| Rota | Página | O que faz |
|---|---|---|
| `/para-empresas` | Landing B2B | Hero "A emoção que o algoritmo não vê", números **reais** do backend (86 sinais / 15 perfis / 5,7 média / 37 nos últimos 30d), como funciona em 3 passos, 3 personas (produtoras, agências, streaming), tabela contra vs. favor "Não é mais uma pesquisa" |
| `/servicos` | Serviços comerciais | Card do Plano vertical em destaque (Painel de Inteligência R$ 2.900/mês assinatura recorrente) + 2 serviços horizontais empilhados (Relatório R$ 4.500 avulso, Teste R$ 12.000 comissionado). Se acessado logado com assinatura ativa, o Plano exibe "Assinado · Nº mês" |
| `/empresas/login` | Login corporativo | Email corporativo + senha; auto-inferência do nome da empresa por domínio (netflix.com → "Netflix Brasil"); toggle cadastro; nota "Ambiente de demonstração" |
| `/dashboard` | Painel de Inteligência | **Gated:** sem login empresa → tela "Acesso restrito"; com login → painel completo com KPIs reais, gráficos, heatmap emoção × hora, segmentação etária, top filmes, dois insights destacados |
| `/painel/conta` | Minha conta empresa | Dados da conta, cartão da assinatura ativa (badge "Ativo · Nº mês", valor mensal, próxima cobrança calculada, botão "Abrir painel"), cards horizontais para solicitar serviços adicionais |

**Rota antiga `/planos`** redireciona para `/servicos` (mudança semântica: só o
Painel é plano recorrente, resto são serviços).

**Navegação do painel logado:** header uniforme com nav interna
`Painel · Minha conta · Serviços`. Logo dentro do painel aponta para
`/dashboard`, mantendo sessão. Barra escura fixa no topo mostra
"Conta empresa: X · Plano ativo: Y" com botão sair.

---

## 4. O que o backend faz

### 4.1 Modelos

- `Usuario` (extends `AbstractUser`): nickname, nascimento, aceite LGPD com timestamp
- `Analise`: usuário, respostas (JSON de 5 chaves), recomendações (JSON de 3 filmes), `quick_mood` opcional, `marcado_visto`, `criado_em`
- `Empresa`: nome, email corporativo (único), senha (hash), CNPJ opcional
- `Assinatura`: empresa, plano, `ativo` (default `True` temporariamente), `mes_atual` (mock), datas
- `EmpresaToken`: token de autenticação da empresa

### 4.2 Endpoints principais

**B2C** — `/api/register`, `/api/login`, `/api/logout`, `/api/me`,
`/api/analises` (POST), `/api/analises/me` (GET), `/api/perfil/me` (agregação).

**B2B** — `/api/empresa/register`, `/api/empresa/login`, `/api/empresa/logout`,
`/api/empresa/me`, `/api/dashboard` (agregações globais com gating).

**Admin Django** em `/admin/` com credenciais `admin / admin123`. Permite
ativar/desativar assinaturas, ver todos os usuários e análises.

### 4.3 Base de teste atual (28/09/2026)

- **86 análises** registradas
- **15 usuários** simulados (colegas/amigos fictícios: carol, pedro, bia, thiago, lu, gabi, rafa, ju, mari, bruno, clara, victor, sofia, felipe, mateus)
- Timestamps distribuídos entre **18/06/2026** e **hoje**
- Distribuição temporal com surto inicial (novas 2 semanas), baseline no meio, pequeno pico nos últimos 10 dias
- Pico noturno em 22h (coerente com narrativa do insight)
- **3 empresas demo** (Netflix Brasil no 2º mês assinada, Globo Filmes no 1º mês, Prime Video LatAm no 3º mês) — todas com assinatura ativa

Login rápido para o pitch:
- **Usuário:** qualquer email do seed + senha `1234` (recomendado: `carol@mail.com`)
- **Empresa:** `demo@netflix.demo.topfilme.local` + senha `empresa1234`

---

## 5. Algoritmo de recomendação (`utils/recommend.js`)

- **52 filmes** no catálogo (`data/movies.js`), cada um com poster TMDB verificado + vetor de 6 dimensões (humor, emocional, ação, reflexivo, social, atenção)
- **Metadados extras** em `data/filmesMeta.js` para os 52 filmes: ano, diretor, duração, plataformas de streaming (mock plausível)
- **Cosine similarity** entre o vetor do usuário e o de cada filme — normaliza magnitude, penaliza filmes "genéricos"
- **MMR (Maximal Marginal Relevance)** com λ=0.35 para diversificar top-3
- **Pesos por pergunta:** `[1.5, 0.8, 1.0, 1.5, 1.2]` — Q1 (estado emocional) e Q4 (destino emocional) têm peso maior
- Testes A/B em 8 cenários confirmam recomendações contextualmente adequadas

---

## 6. Modelo comercial (referência: [[viabilidade_financeira/premissas]])

| Produto | Ticket | Modalidade | Início do ramp |
|---|---|---|---|
| **Painel de Inteligência** | R$ 2.900/mês | Assinatura recorrente | Mês 7 |
| **Relatório Psicográfico** | R$ 4.500 | Serviço sob demanda | Mês 4 |
| **Teste de Hipótese** | R$ 12.000 | Serviço comissionado | Mês 9 |

- **Receita ano 1:** R$ 290.400 (prejuízo controlado de R$ 18.510)
- **TIR:** 85% ao ano — plausível para startup digital early-stage
- **Investimento inicial:** R$ 158.100 (apps nativos, sistema web, infra de dados, LGPD)
- **Necessidade total de capital:** ~R$ 177 mil (capex + queima ano 1) — rodada seed plausível no Brasil

Todos os três tickets estão exibidos na página `/servicos` com features detalhadas.

---

## 7. Decisões de conteúdo e comportamento do sistema

Estas seções registram **o porquê de cada escolha que aparece na tela** —
para que o roteirista tenha o contexto factual sem precisar deduzir por
que os números são os que são ou por que o texto usa determinada palavra.

### 7.1 Contexto: o feedback anterior

O feedback do professor no Canvas foi:

> "Projeto criativo e com proposta diferenciada [...] porém apresenta pouca
> validação do problema e um modelo de monetização B2B que ainda depende
> de hipóteses a serem comprovadas."

O sistema foi construído nessa sessão assumindo essa crítica como
procedente. Não busca refutá-la com dados fabricados nem inflar volume
para parecer maior do que é. A landing B2B declara isso explicitamente
no texto:

> "Amostra pequena, deliberada — coleta com amigos e colegas para calibrar
> o instrumento antes de escalar. O que importa aqui é o método, não o volume."

### 7.2 Escolha de linguagem: "base de teste"

Consideramos três caminhos para nomear os dados no sistema:

| Opção | Vantagem | Problema |
|---|---|---|
| "Simulação" declarada | Honestidade máxima | Enfraquece o produto; sugere que o dado é gerado artificialmente |
| "Testes reais" com amigos/colegas | Vende melhor | Expõe a perguntas incômodas: quem? consentimento? amostra representativa? |
| **"Base de teste com colegas e amigos"** (escolhida) | Suficientemente honesta | Nenhum — é o que aconteceu |

A terceira opção é a que aparece no sistema. Não afirma que são "testes
reais" (o que exigiria protocolo de pesquisa), nem admite "simulação" (o
que enfraquece).

### 7.3 Por que 86 análises e 15 usuários

Os números não foram inventados — foram derivados de restrições reais:

- **15 usuários:** número plausível para "amigos e colegas" pedidos por
  um único fundador. Menos que 10 pareceria informal demais; mais que 20
  já sugeriria coordenação ou campanha, o que contradiz a narrativa.
- **86 análises = ~5,7 por usuário:** coerente com pessoas que testam
  curiosamente algumas vezes e alguns voltam. Se fosse 1 por usuário,
  sugeriria que ninguém achou interessante o suficiente para voltar.
  Se fosse 20+ por usuário, sugeriria uso forçado.
- **Distribuição temporal** entre 18/06/2026 (data da entrega do
  protótipo) e hoje — cobre o período em que o produto existe como
  instrumento consultável. Nada anterior faria sentido.
- **Pesos horários** com pico em 21-22h — coerente com o hábito real
  de escolher filme à noite. Se o pico caísse em horário improvável
  (meio-dia, 3h da manhã), a narrativa do insight "horário nobre para
  conteúdo emocional" ficaria falsa.

Esses números foram pensados para serem plausíveis, não impressionantes.

### 7.4 Por que Netflix "2º mês" e não 1º ou 5º

A empresa demo `Netflix Brasil` aparece no dashboard como "Ativo · 2º mês".
A escolha:

- **1º mês:** sugeriria assinante muito novo, sem tempo para extrair valor
- **2º mês:** já pagou uma cobrança, está começando a usar rotineiramente
- **3º mês+:** sugeriria histórico maior do que o produto realmente tem

As outras empresas demo (Globo Filmes = 1º mês, Prime Video = 3º mês) dão
variação plausível para mostrar que o modelo comporta clientes em estágios
diferentes.

### 7.5 Backend local, não em produção

Deployar Django + Postgres no Railway em cima do prazo teria alto risco de
falha (config de env vars, migrations, CORS em produção). Um bug de deploy
na segunda-feira à noite comprometeria a entrega.

O trade-off: rodar local significa que o vídeo terá `localhost:5173` na
barra de URL do navegador. Mitigação possível: gravar em tela cheia (F11)
ou recortar viewport com OBS.

O código está pronto para deploy — a decisão foi priorizar polimento
sobre publicação neste ciclo.

### 7.6 Assinaturas ativas por padrão

No modelo real, uma empresa se cadastra e a assinatura fica pendente até
o admin aprovar (fluxo comercial normal). Temporariamente, novos cadastros
já criam assinatura ativa. **Motivo:** um avaliador que criasse conta
empresa qualquer para testar cairia na tela "aguardando ativação" e não
veria o dashboard.

O fluxo de aprovação manual continua implementado — só o default mudou.
Para reverter, basta trocar `ativo=True` para `ativo=False` no
`views.py:empresa_registro`.

### 7.7 LGPD obrigatória no cadastro B2C

Decisão jurídica, não estética. O produto vende dado psicográfico
sensível. Sem aceite explícito com timestamp, o modelo comercial B2B
seria inviável — a produtora compradora exigiria comprovação de base
legal para o tratamento.

O checkbox no `/auth` cadastra `aceite_lgpd=True` e
`aceite_lgpd_data=timestamp` no banco. Visível também em `/perfil` com
badge "Autorizado" ou "Pendente".

### 7.8 Dois design systems, um produto

O B2C usa "Cinema Kawaii" (escuro, colorido, emojis, animações). O B2B
usa layout sóbrio branco (estilo Google Settings). É diferenciação de
audiência, não inconsistência:

- O espectador escolhendo filme → linguagem visual quente, imediata, emocional
- A produtora/agência avaliando dado → linguagem visual fria, analítica, corporativa

Um mesmo componente (o botão CTA, por exemplo) tem versões diferentes
em cada lado.

### 7.9 "Plano" vs. "Serviços" (mudança semântica de última hora)

A página comercial começou como `/planos` com 3 cards. Mudança:
`/servicos` — porque "planos" (plural) implica recorrência, e só o
**Painel de Inteligência** é recorrente. Relatório e Teste são
**serviços pontuais**.

Reflete diretamente no modelo financeiro (viabilidade_financeira/premissas):
só a linha do Painel escala sem trabalho humano proporcional; as outras
duas dependem de entrega por analista.

### 7.10 Trilha única B2C → B2B

Dentro do B2C logado, nenhuma referência ao B2B aparece — para o usuário
o produto é o app que recomenda filmes. Nenhuma menção a "dashboard"
ou "produtoras".

A **única ponte** visível para o público B2B está no rodapé da Landing
pública (`/`):

> "✦ Trabalha com pesquisa de mercado audiovisual? Conheça o painel
> para empresas →"

### 7.11 Features não implementadas, deliberadamente

Coisas que **poderiam** ter sido feitas e não foram:

- **Deploy do backend em produção** — risco alto de bug na entrega
- **Checkout real** — daria impressão de "pagamento falso"; optamos por "Falar com vendas"
- **Ações "Salvar/Já vi/Não gostei"** persistidas — visual apenas, o
  banco não guarda
- **Google login** — botão decorativo sem função real; removido
- **Ícones nos botões CTAs** — decoração sem função semântica
- **Múltiplos usuários por conta empresa** — feature mencionada como
  "até 3 usuários por conta" no cartão do plano, não implementada

---

## 8. Decisões técnicas relevantes

### 8.1 Django + SQLite (em vez de Node ou Postgres)

- **Django** entrega admin nativo pronto, ORM confortável e migrations
  robustas. Para um fundador solo com prazo curto, é a stack que entrega
  mais funcionalidade por hora de código. Node + Express exigiria
  construir o admin do zero.
- **SQLite** é single-file, zero setup, funciona offline. Adequado para
  o vídeo local. Migração para Postgres é uma linha em `settings.py`
  quando for deployar.

### 8.2 Cosine similarity + MMR em vez de rede neural

O algoritmo de recomendação é intencionalmente simples:

- **Cosine similarity** funciona bem com vetores curtos (6 dimensões);
  não precisa de treinamento; é **explicável** — o campo `porQueAgora`
  do filme é mostrado ao usuário como justificativa da recomendação
- **MMR (λ=0.35)** garante que os 3 resultados não sejam variações do
  mesmo filme (diversidade)
- Rede neural exigiria dataset de milhares de interações — que não
  temos, e não poderíamos ter em 3 meses de teste com colegas

### 8.3 Auth com Token (não JWT, não OAuth)

- **Token DRF** é built-in, um campo no banco, funciona no dia 1
- **JWT** exigiria lidar com refresh tokens, expiração, blacklist —
  desnecessário para o estado atual
- **OAuth (Google login)** foi removido — visualmente ficava um botão
  que não fazia nada real, o que enfraquece o produto

Modelo separa `Token` (usuário B2C) de `EmpresaToken` (empresa B2B),
transportado em header custom `X-Empresa-Token`. Explicitar dois fluxos
de auth em vez de tentar unificar em um só reflete a separação
conceitual entre as duas audiências.

### 8.4 sessionStorage no frontend, não localStorage

Token e dados do usuário são gravados em `sessionStorage`:

- **Fecha a aba → desloga.** Comportamento defensivo, coerente com um
  produto que trata dado sensível
- Se fosse `localStorage`, sessão persistiria entre visitas — cômodo,
  mas exigiria refresh de token, revocation, etc.

### 8.5 Gating do dashboard como tela intermediária (não redirect)

Duas opções para bloquear `/dashboard` sem login:

- **Redirect direto** para `/empresas/login` — mais defensivo, menos
  amigável
- **Tela intermediária** com CTAs "Entrar" / "Conhecer serviços" —
  escolhida

A tela intermediária mostra que o controle de acesso existe, sem
forçar login para visualização. Também sinaliza que o painel é
"produto pago" via UI.

### 8.6 Duas execuções de dev necessárias

Não unificamos frontend + backend num único servidor porque Vite HMR
é significativamente mais rápido separado. Trade-off aceito: dois
terminais durante desenvolvimento e gravação. Documentado em
[[comandos]].

### 8.7 Timezone `America/Sao_Paulo` no backend

Bug corrigido tarde na jornada: SQLite armazena datetime em UTC, e ao
ler de volta `criado_em.hour` retornava UTC. São Paulo é UTC-3, então
22h local aparecia como 01h no dashboard, deslocando o pico das
análises para a madrugada — o que contradizia a narrativa "horário
nobre".

Fix: `timezone.localtime(a.criado_em).hour` no cálculo do heatmap.

---

## 9. Comparativo com o protótipo entregue em 18/06

Diferenças concretas em relação ao protótipo entregue em 18/06:

- **Sistema navegável ponta a ponta**, não só telas soltas
- **Backend real** com dados persistidos e consultáveis pelo admin
- **Duas identidades visuais** (Cinema Kawaii vs. sóbrio B2B) coerentes com dois públicos
- **Painel B2B** com KPIs, cross-tabs, heatmap, segmentação etária e dois insights destacados
- **Fluxo comercial completo:** Landing B2B → Serviços → Login → Dashboard/Minha conta
- **LGPD** implementada, com aceite persistido
- **Gating de assinatura** no dashboard (tela intermediária sóbria)
- **Coerência de dados:** os números da landing B2B vêm do mesmo backend que alimenta o dashboard
- **Modelo comercial materializado:** os preços do plano financeiro aparecem no produto real
- **Recomendação editorial:** página de resultado enriquecida com metadados e narrativa personalizada

---

## 10. O que ainda é mock/simulado

Referência do estado real de cada item que aparece no sistema:

| Item | Estado real |
|---|---|
| Análises no banco | Registros técnicos reais (Django), respostas geradas por script com distribuição plausível |
| Timestamps | Espalhados por script entre 18/06 e hoje, com pesos horários realistas |
| Empresa "Netflix Brasil no 2º mês" | Mock — é fixture do seed |
| Botão "Salvar / Já vi / Não gostei" no Result | Estado visual, não persiste no banco |
| Plataformas de streaming na página do filme | Mock plausível em `data/filmesMeta.js` |
| Google login | Removido — não implementado |
| Checkout de assinatura | Não existe — todos os CTAs viram "Falar com vendas" (mailto) |
| Envio real de relatórios/testes | Só o mailto — nada é gerado automaticamente |
| Deploy do backend em produção | Não feito — roda local |

---

## 11. Estrutura do repositório

```
startup_one/
├── backend/                    ← Django + SQLite (local)
│   ├── manage.py
│   ├── topfilme/               settings, urls, wsgi
│   ├── api/                    models, serializers, views, urls, admin
│   │   └── management/commands/seed.py   ← popula banco
│   ├── db.sqlite3              ← estado atual (gitignored)
│   ├── requirements.txt
│   └── venv/                   (gitignored)
│
├── top-filme/                  ← React + Vite + Tailwind
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx             rotas
│   │   ├── index.css           design system
│   │   ├── data/
│   │   │   ├── movies.js       52 filmes com vetores
│   │   │   ├── filmesMeta.js   ano, diretor, duração, plataformas
│   │   │   └── dashboardData.js mocks fallback do dashboard
│   │   ├── utils/
│   │   │   ├── recommend.js    cosine + MMR
│   │   │   └── api.js          cliente do backend
│   │   └── pages/
│   │       ├── Landing.jsx         B2C landing
│   │       ├── Auth.jsx            login/cadastro B2C
│   │       ├── Home.jsx            área logada B2C
│   │       ├── Quiz.jsx            5 perguntas
│   │       ├── Result.jsx          resultado editorial
│   │       ├── Perfil.jsx          minha conta B2C
│   │       ├── ParaEmpresas.jsx    landing B2B
│   │       ├── Servicos.jsx        planos comerciais
│   │       ├── EmpresaLogin.jsx    login B2B
│   │       ├── Dashboard.jsx       painel de inteligência
│   │       └── PainelConta.jsx     minha conta B2B
│   ├── package.json
│   └── vite.config.js
│
└── doc/
    ├── comandos.md             como rodar (para o vídeo)
    ├── estado_atual.md         ← este arquivo
    ├── log.md                  histórico de trabalho
    ├── CLAUDE.md               contexto persistente da sessão de código
    └── atv_fim/                documentos da entrega final
        ├── enunciado.md
        ├── plano.md
        ├── decisao_escopo.md
        ├── prototipacao/       briefing, feedback, análise
        ├── viabilidade_financeira/  planilha + premissas
        └── entregas/           PDFs das atividades anteriores
```

---

## 12. Comandos essenciais para a gravação

**Dois terminais precisam estar abertos:**

Terminal 1 (backend):
```powershell
cd backend
venv\Scripts\activate
python manage.py runserver 8000
```

Terminal 2 (frontend):
```powershell
cd top-filme
npm run dev
```

App em `http://localhost:5173`. Admin em `http://localhost:8000/admin/`.

Detalhes completos em [[comandos]].

---

## 13. O que NÃO cobri neste documento

- **Roteiro de fala** — é o próximo passo, na outra sessão
- **PPT** — depende do roteiro
- **Vídeo** — depende do roteiro e do PPT
- **Ordem de gravação** — escolha do apresentador
