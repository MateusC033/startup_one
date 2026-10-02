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

## 2026-09-27 — Sessão 3 (retomada para entrega final FIAP)

Projeto retomado após 3 meses, com prazo da entrega final em 28/09 23h59
(pitch em vídeo de 5 minutos). Usuário trouxe documentos novos em
`doc/atv_fim/` (enunciado, plano de ação, decisão de escopo, premissas
financeiras, feedback do canvas).

### Contextualização e decisão de escopo

Lidos todos os documentos novos. Decisão alinhada com o usuário sobre o
caminho de maior retorno dadas as ~15h úteis até o cut-off:

- O enunciado FIAP pede **PPT + vídeo de 5 min**. Não há critério sobre
  sistema funcionando — quem corrige vê o vídeo
- O **slide de Validações** (crítica anterior do professor: "pouca
  validação") é o ponto mais frágil
- O **dashboard B2B** é o ativo que materializa o modelo de monetização
  no vídeo

Opção escolhida: construir **dashboard B2B mockado em frontend puro**
antes de qualquer backend, com dados coerentes com o pitch.

### Dashboard B2B — primeira versão

Nova página `/dashboard` (`Dashboard.jsx` + `data/dashboardData.js`).

Design **sóbrio branco** (estilo Google Settings) — contraste deliberado
com o "Cinema Kawaii" do B2C para diferenciar audiência:
- Fundo `#F8F9FA`, cards `#FFFFFF` com borda `gray-200`
- Texto `gray-900` / `gray-500` / `gray-400`
- Pink `#FF2D78` como único destaque (regra 60-30-10)

Pesquisa prévia sobre boas práticas (fork em paralelo):
- Hierarquia F-pattern: KPIs no topo → cross-tabs → insights
- Barras horizontais para ranking, donut só com dominante clara, nunca pizza
- Chartjunk zero (sem 3D, sombras, gradientes decorativos)
- Regra 60-30-10 de cores
- Insight em texto é o que vende

Componentes montados: KPICard, BarraHorizontal, Donut (via
conic-gradient), HorariosPico (barras verticais), TopFilmes (lista
rankeada), InsightCard. Zero biblioteca de gráficos — tudo em
Tailwind puro, sem adicionar peso ao bundle.

Mocks iniciais: 847 análises, 312 perfis únicos, 3,1× insight principal.

Bugs corrigidos nessa iteração:
- `bg-white` do Tailwind puxava `#F5F0FF` do config dark; trocado por
  `bg-[#FFFFFF]` em todo dashboard
- Barras do gráfico de horas invisíveis — `h-[X%]` em flex child sem
  altura pai; reestruturado para flex direto

### Polimento das 5 telas B2C

Lista priorizada por impacto no vídeo:

1. **Posters quebrados no catálogo** — auditoria via curl em paralelo:
   Interestelar, Nada de Novo no Front, John Wick e Comer Rezar Amar
   todos 404. URLs corretas obtidas via WebFetch no TMDB
2. **Carrossel do Result desalinhado** — `items-center` fazia cards
   laterais ficarem no meio da altura do centro. Trocado para
   `items-start`, poster central reduzido (320→260px), paddings
   reduzidos para CTAs voltarem para o fold
3. **Home desperdiçando espaço em desktop** — `max-w-2xl` → `max-w-5xl`
   com grid 2/3 (histórico) + 1/3 (novo card "Seu perfil emocional"
   com total, humor dominante e distribuição em barras)
4. **Auth sem contexto visual** — adicionados blobs sutis (pink/
   lavender/mint com `opacity 0.03-0.04`), botão "← Voltar" explícito,
   barra de cores no rodapé
5. **Links para dashboard** — badge "● Painel" no header da Home +
   botão "Ver painel completo" no card de perfil
6. **Quiz em desktop** — pergunta em `lg:text-5xl`, cards com padding
   maior, emojis em `md:text-3xl`

### Melhorias no dashboard (segunda rodada)

Decisão de alinhamento com usuário: ir com **dados ambiciosos marcados
como projeção**, não reduzidos. Para o pitch, visual impressiona mais.

4 melhorias:
1. **Heatmap emoção × hora do dia** (24h × 4 emoções) com célula de
   pico global destacada em pink
2. **Segmentação por faixa etária** com barras horizontais empilhadas
   por idade (16-24, 25-34, 35-44, 45+)
3. **Segundo insight destacado** em grid 2 colunas com o principal
   (47% do consumo noturno vem do cluster 25-34)
4. **Copies vendáveis nos KPIs** ("Sinais psicográficos capturados",
   "Perfis emocionais únicos", "Tempo médio de decisão",
   "Recorrência semanal")

### Páginas B2B comerciais

Criadas 4 novas rotas:

- **`/para-empresas`** (ParaEmpresas.jsx) — landing B2B sóbria com
  hero "A emoção que o algoritmo não vê", números de prova, como
  funciona em 3 passos, 3 personas (produtoras, agências, streaming),
  diferenciação vs. pesquisa tradicional
- **`/planos`** (Planos.jsx) — 3 cards verticais com Relatório
  R$ 4.500, Painel R$ 2.900/mês (destaque "Mais escolhido") e Teste
  R$ 12.000
- **`/empresas/login`** (EmpresaLogin.jsx) — acesso corporativo com
  inferência de empresa por domínio (netflix.com → "Netflix Brasil")
- **Dashboard com wrapper de empresa** — barra escura no topo mostra
  "Conta: X · Plano: Y"

Fluxo completo: Landing → "Para empresas" → ParaEmpresas → Planos →
Login → Dashboard.

### Separação B2C ↔ B2B

Ajuste narrativo pedido pelo usuário:
- Dentro do B2C logado, **zero referências ao B2B** (removidos badge
  "Painel", avatar circular, links para dashboard)
- Nome do usuário vira o clique para `/perfil` (padrão intuitivo)
- Única ponte B2C→B2B: faixa discreta no rodapé da Landing pública
  — "Trabalha com pesquisa de mercado audiovisual? Conheça o painel
  para empresas"
- Removido link "Ver painel geral" do Perfil B2C

### Encerramento do dia

Repositório ao final: push para `master`, Railway redeployando.
Pendências para segunda-feira: backend real, análise mais minuciosa.

---

## 2026-09-28 — Sessão 4 (segunda, dia de entrega)

Dia longo de trabalho — reestruturação arquitetural grande, backend
construído do zero, múltiplos refinamentos.

### Decisão sobre backend + dados

Usuário escolheu **Modelo A** (dados reduzidos + backend real) em vez
de dados ambiciosos sem backend. Narrativa adotada: "testes com
colegas e amigos para calibrar o instrumento antes de escalar". Não
afirmamos "testes reais"; não admitimos "simulação".

Também concordamos: dashboard precisa ser **gated por autenticação**
de empresa — não pode ser acessado sem login.

### Backend Django + SQLite

Nova pasta `backend/` com stack completa:

**Setup:**
- Django 4.2 LTS + Django REST Framework + django-cors-headers
- SQLite single-file (`db.sqlite3`)
- Python 3.9 com venv isolado

**Models (`api/models.py`):**
- `Usuario` extends `AbstractUser` — nickname, nascimento, aceite_lgpd
  com timestamp
- `Analise` — usuario, respostas (JSON), recomendacoes (JSON),
  quick_mood, criado_em (sem auto_now para permitir seed histórico)
- `Empresa` — nome, email_corp (unique), password hash, cnpj opcional
- `Assinatura` — empresa, plano, ativo, mes_atual
- `EmpresaToken` — token custom (paralelo ao Token DRF do usuário)

**Endpoints (`api/views.py` + `api/urls.py`):**
- B2C: `/api/register`, `/login`, `/logout`, `/me`, `/analises` (POST),
  `/analises/me` (GET), `/perfil/me` (agregação)
- B2B: `/api/empresa/register`, `/empresa/login`, `/empresa/logout`,
  `/empresa/me`, `/dashboard` (agregações globais com gating)
- Auth: Token DRF para usuário, `X-Empresa-Token` header custom para
  empresa

**Admin Django** nativo com actions `ativar_assinaturas` e
`desativar_assinaturas`. Superuser: `admin / admin123`.

**Comando `seed`** (`api/management/commands/seed.py`):
- 15 usuários simulados (carol, pedro, bia, thiago, lu, gabi, rafa,
  ju, mari, bruno, clara, victor, sofia, felipe, mateus)
- ~86 análises com timestamps distribuídos entre 18/06/2026 e hoje,
  pesos horários com pico noturno (21h-22h), distribuição temporal
  com surto inicial + baseline + pequeno pico atual
- 3 empresas demo (Netflix, Globo, Prime)
- Random seed fixo (42) para reprodutibilidade

### Integração frontend ↔ backend

Novo arquivo `src/utils/api.js`:
- Storage helpers para token de usuário (`tf_token`) e empresa
  (`tf_empresa_token`)
- Wrapper `request()` com `useToken` / `useEmpresaToken` opções
- Métodos tipados: `api.register`, `api.login`, `api.salvarAnalise`,
  `api.meuPerfil`, `api.empresaLogin`, `api.dashboard`, etc.

**Adaptações nas páginas:**
- **Auth.jsx**: checkbox LGPD obrigatório no cadastro, mensagens de
  erro, chama `api.register` ou `api.login`, salva token
- **Home.jsx**: carrega histórico via `api.minhasAnalises()` e perfil
  via `api.meuPerfil()`, botão Sair que chama `api.logout`
- **Result.jsx**: após calcular recomendações, chama
  `api.salvarAnalise(respostas, recomendacoes)` — guard de useRef
  para evitar duplicação por StrictMode (bug detectado depois)
- **Dashboard.jsx**: carrega dados reais via `api.dashboard()`, mantém
  mock como fallback
- **EmpresaLogin.jsx**: integrado ao backend, mantém inferência de
  empresa por domínio

Bug CORS: header custom `X-Empresa-Token` não estava na allowlist do
django-cors-headers. Adicionado em `CORS_ALLOW_HEADERS`.

### Nova página /perfil (B2C)

`Perfil.jsx`:
- Card "Dados da conta" (nickname, email, nascimento, data cadastro)
- Card "Seu perfil emocional" com dados reais do backend (análises
  feitas, humor dominante, distribuição em barras)
- Card "Uso dos seus dados" com badge "Autorizado" / "Pendente" do
  aceite LGPD
- Botão sair funcional

Botão avatar da Home passa a levar para `/perfil` (intuitivo).

### Result editorial

Redesign completo em formato "review":
- Layout 2 colunas: poster grande à esquerda + ficha à direita
- Metadados no topo: ano · duração · diretor (de `filmesMeta.js`,
  arquivo novo com 52 filmes)
- Título gigante, tagline em itálico
- Card "Por que este filme, agora" com narrativa personalizada das
  respostas + `porQueAgora` do filme
- Chips de atributos destacados
- Plataformas de streaming (mock plausível)
- Ações: Salvar, Já vi, Não gostei (estado visual)
- Alternativas em cards horizontais abaixo (não mais carrossel)

### Polimento B2B

**Gating do dashboard:**
- Sem login empresa → tela sóbria "Acesso restrito · Painel exclusivo
  para contas empresa" com CTAs "Entrar como empresa" e "Conhecer os
  planos"
- Com login mas sem assinatura ativa → "Assinatura pendente" com
  "Falar com vendas"
- Só exibe dashboard completo se autenticado + assinatura ativa

**Landing B2B realinhada:**
- Números do backend (86 sinais / 15 perfis / 5,7 média / 37 em 30d)
  em vez de mocks (847/312/3,1×/47%)
- Nota explícita: "Amostra pequena, deliberada — coleta com amigos e
  colegas para calibrar o instrumento antes de escalar. O que importa
  aqui é o método, não o volume."
- Removido "Ver o painel ao vivo" (bateria no gating)

**Planos reformados:**
- CTAs "Falar com vendas" (mailto) em todos os cards
- Nota "Contratação via time comercial · sem checkout online"

**Cadastro empresa:**
- Auto-preenchimento do campo "Nome" quando domínio é reconhecido

**Headers B2B uniformizados** nas 3 páginas (ParaEmpresas, Planos,
EmpresaLogin): nav interna com links de texto + "Entrar" com fundo
cinza + link discreto "App do usuário" separado por border-left.

**Bug timezone no backend:**
- Pico das análises aparecia às 1h da manhã no dashboard
- Causa: SQLite armazena UTC; `criado_em.hour` retornava UTC;
  São Paulo é UTC-3 → 22h local = 01h UTC
- Fix: `timezone.localtime(a.criado_em).hour` no cálculo do heatmap
- Após fix: pico corretamente em 22h, coerente com narrativa

### Reestruturação Plano vs. Serviços

Mudança semântica solicitada pelo usuário: "Planos" (plural) implica
recorrência; só o Painel é recorrente. Relatório e Teste são
**serviços pontuais**.

- **`/planos` renomeada para `/servicos`** (redirect preservado via
  `<Navigate to="/servicos" replace />`)
- **Novo layout dos cards:**
  - Painel vertical em destaque (borda pink, tag "PLANO ·
    RECORRENTE")
  - Relatório + Teste como cards **horizontais** empilhados (preço à
    direita, features em grid 2 colunas, nota "Envio por email")

**Backend:** campo `mes_atual` em Assinatura; serializer
`EmpresaSerializer` expõe `mes_atual` e `inicio_assinatura`.
Assinaturas ativas por padrão temporariamente (default `ativo=True`)
— avaliador pode criar conta sem cair em "aguardando ativação".

**Nova página `/painel/conta`** (PainelConta.jsx):
- Barra escura com conta e plano ativo
- Nav interna: Painel · Minha conta · Serviços
- Card "Dados da conta"
- Card "Assinatura ativa" em destaque com badge "Ativo · Nº mês",
  valor mensal, próxima cobrança calculada, botão "Abrir painel"
- Cards horizontais para solicitar serviços adicionais

**Nav do painel logado corrigida:**
- Logo dentro do painel aponta para `/dashboard` (antes ia para
  `/para-empresas`, quebrando sessão)
- Mesma nav interna em Dashboard, PainelConta e Servicos (quando
  logado)
- Removido link "← Página de empresas"

### Limpezas finais

- Removido "Base de teste · 18 jun – hoje" da seção de números
- `formatDuracao` retorna "1min 38s" em vez de "1'38"" (unidade
  clara)
- Rodapé do dashboard: removido "Amostra ilustrativa para pitch" e
  timestamp fixo; adicionado "Sistema com finalidade acadêmica ·
  disciplina Startup One · FIAP"

### Bug grave de última hora — tela branca

Após o commit da reestruturação Plano→Serviços, Vite renderizava
página em branco em todas as rotas.

**Diagnóstico:**
- `curl` em `localhost:5173` respondia 200 → servidor não caiu
- Console sem erros clássicos
- Chave: `document.getElementById('root').innerHTML` retornou vazio
  → React nem chegou a inserir
- Fetch do `App.jsx` servido pelo Vite via curl revelou linha
  `import Planos from "/src/pages/Planos.jsx?t=..."`

**Causa:** Planos.jsx foi deletado via `git rm` mas o `import` no
`App.jsx` ficou órfão. Vite falhava silenciosamente ao resolver o
módulo.

**Fix:** removida linha de import obsoleta.

### Documentação

Criados dois documentos novos em `doc/`:

- **`comandos.md`** — como rodar backend + frontend em dois terminais,
  credenciais do seed (usuário, empresa, admin), comandos úteis
- **`estado_atual.md`** — relatório descritivo de 500+ linhas
  cobrindo visão do produto, stack técnica, todas as páginas,
  backend, algoritmo, modelo comercial, decisões de conteúdo
  (racional de 86 análises, 15 usuários, Netflix 2º mês, LGPD),
  decisões técnicas (Django, cosine, Token, timezone), comparativo
  com protótipo de 18/06, tabela de mocks, estrutura do repo

Documento `estado_atual.md` escrito para servir à próxima sessão
(roteiro do pitch) — descritivo puro, sem prescrever narrativa.

### Estado do repositório ao encerrar

```
branch: master | último commit: f2bdbc8
chore(dashboard): ajusta rodapé com aviso acadêmico FIAP
```

Últimos commits principais:
- `f2bdbc8` chore(dashboard): ajusta rodapé com aviso acadêmico FIAP
- `064fb8b` docs: adiciona documentação da atividade final
- `024294f` docs: relatório do estado atual do sistema
- `119c6be` fix(app): remove import de Planos deletado
- `aaed0c6` feat(b2b): plano vs serviços, minha conta, nav interna
- `5b4f06d` feat(b2b): gating, números reais, polimento
- `eada03b` feat(b2b): landing empresas, planos comerciais, login
- `bc3214b` feat: página /perfil + Result editorial + metadados
- `313c777` feat: backend Django local com Auth/Análises/Dashboard
- `1ed2c4b` fix: separação B2C ↔ B2B e correção de duplicação
- `bff81d6` feat(dashboard): heatmap, segmentação, insight secundário
- `e151233` feat: painel B2B sóbrio e polimento das telas

### Pendências pós-entrega

- Deploy do backend em produção (Postgres + Railway ou alternativa)
- Checkout real + integração com gateway de pagamento
- Persistir ações "Salvar / Já vi / Não gostei" no banco
- Apps nativos iOS/Android (previstos no capex do modelo financeiro)
- Google login real
- Múltiplos usuários por conta empresa

---
