# Briefing — Protótipo Top Filme

> Documento de briefing completo para construção do protótipo.
> Destinado ao agente de IA no VS Code. Ler integralmente antes de começar.
> Última atualização: 18/06/2026.

---

## 1. O que é o Top Filme

**Top Filme** é uma plataforma web de recomendação de filmes por estado emocional — não por gênero, título ou histórico de visualizações.

O usuário responde 3 perguntas rápidas e visuais sobre como está se sentindo no momento. O sistema cruza as respostas com um perfil de atributos dos filmes e entrega 2 indicações: uma principal e uma alternativa (caso já tenha visto a principal).

O produto tem duas camadas de valor:
- **B2C (gratuito):** o usuário resolve a fadiga de decisão em segundos
- **B2B (pago):** os dados gerados pelas interações — estado emocional, contexto, horário, escolha — formam uma base de inteligência psicográfica sem precedentes, vendida para produtoras, agências de marketing e plataformas de streaming

O negócio real é B2B. O app é o instrumento de coleta. Essa inversão de hierarquia é o reframing central do projeto.

---

## 2. Contexto — entregas anteriores

O projeto foi desenvolvido ao longo do semestre em três atividades encadeadas. O protótipo é a quarta e última entrega.

### Atividade 1 — Identificando Oportunidade

Área: MediaTech + Inteligência de Dados.

Problema identificado: o espectador de streaming é bombardeado pelo Paradoxo da Escolha. Vencido pela fadiga de decisão, vira um "revisor de catálogo" — rola a tela até escolher algo por exaustão, não por desejo. A plataforma registra esse clique como preferência real, gerando métricas de "falso engajamento" que distorcem toda a cadeia: algoritmos → produtoras → marketing.

Solução proposta: um buscador estruturado em árvore de decisão empática, semelhante a um teste vocacional. O usuário não busca por título ou gênero, mas pela emoção que quer sentir. O sistema gera dados psicográficos inéditos sobre o desejo autêntico do público.

### Atividade 2 — Validando o Problema

Validação via Desk Research (Nielsen + Accenture):

- **Nielsen:** usuário gasta entre 10,5 e 14 minutos por sessão apenas buscando o que assistir. ~20% fecham o app sem dar play por frustração.
- **Accenture:** 60% consideram as recomendações das páginas iniciais irrelevantes para o que desejam no momento. 80%+ gostariam de uma plataforma unificada que facilitasse a descoberta.

Mercado (TAM/SAM/SOM):
- **TAM:** mercado global de Predictive Analytics e Inteligência de Consumo para entretenimento
- **SAM:** mercado ocidental de distribuição, publicidade e pesquisa audiovisual
- **SOM:** agências de marketing, distribuidoras médias e produtoras independentes — primeiros clientes a pagar pelos dados

Aprendizado crítico para o protótipo: **o MVP não pode ser pesado nem um questionário longo.** O fluxo precisa ser rápido, visual e sem atrito.

### Atividade 3 — Canvas

Business Canvas completo. Pontos-chave:

- B2C gratuito: o usuário "paga" com dados comportamentais autênticos
- B2B: venda de relatórios preditivos e comissionamento de testes de hipóteses comportamentais que as grandes plataformas não têm liberdade para fazer
- Concorrentes indiretos: algoritmos nativos (Netflix, Prime) e empresas tradicionais de pesquisa. Diferencial: testagem de hipóteses em tempo real, indexação pelo desejo genuíno
- Parceiro de catálogo previsto: TMDB (The Movie Database)

**Feedback do professor:** "Projeto criativo e com proposta diferenciada para o mercado audiovisual, demonstrando boa visão estratégica de longo prazo, porém apresenta pouca validação do problema e um modelo de monetização B2B que ainda depende de hipóteses a serem comprovadas."

**Como o protótipo endereça esse feedback:** o protótipo é exatamente o instrumento de validação que faltava. Uma interface funcionando que demonstra o fluxo empático é a primeira prova de hipótese da interface — e a coleta de dados reais, mesmo que pequena, inicia a validação do B2B. Isso deve ser nomeado no template da entrega.

---

## 3. Cadastro

Campos do cadastro simples:
- Data de nascimento
- Nickname (nome do perfil — usado na interface)
- Email (chave única do usuário)
- Senha

Login com Google é desejável se for simples de implementar — o email já funciona como identificador único.

**Obs.:** CPF pode ser adicionado em versão futura. Não entra agora.

---

## 4. As telas

### Tela 1 — Landing Page

Página de entrada do produto. Deve comunicar o que é o Top Filme de forma rápida e atrativa. Não é uma página de marketing longa — é uma porta de entrada limpa que convida o usuário a entrar.

Elementos esperados:
- Nome/logo do produto
- Frase de posicionamento (curta — o que resolve, para quem)
- Botão de acesso (entrar ou criar conta)

Design: moderno, minimalista. Sem texto longo. Deve transmitir a ideia de leveza e fluidez que o produto promete.

### Tela 2 — Cadastro e Login

Formulário simples. Cadastro com os campos definidos acima. Login com email e senha. Botão de login com Google (se implementado).

### Tela 3 — Página Principal (área logada)

Esta é a tela que o usuário vê após entrar. Deve ter:

- **Histórico de indicações:** lista das últimas análises feitas, com o filme recomendado e a data. Mockado no passo 1.
- **Botão de destaque:** "Iniciar nova análise" (ou título equivalente — algo que comunique o início do fluxo de perguntas de forma convidativa, não burocrática)

Design simples. O botão de nova análise é o elemento principal da tela.

### Tela 4 — Fluxo de Perguntas (multi-step form)

**Este é o coração do produto.**

São 3 perguntas, cada uma ocupando a tela inteira. A transição entre elas é suave (animação de entrada/saída — deslizar ou fade). A tela não recarrega entre perguntas.

Formato de cada pergunta:
- Título da pergunta (curto, direto)
- Cards clicáveis com emoji + texto curto (sem texto longo)
- Ao clicar em um card, avança automaticamente para a próxima pergunta (sem botão "próximo" — o clique já é a ação)
- Barra de progresso discreta no topo (ex: passo 1 de 3)

**As 3 perguntas:**

**Pergunta 1**
> "Como você está se sentindo agora?"
- 😄 Levinho, quero rir
- 😢 Com vontade de sentir algo
- ⚡ Agitado, quero ação
- 🤔 Curioso, quero pensar

**Pergunta 2**
> "Vai assistir com quem?"
- 👤 Sozinho
- 💑 Com alguém especial
- 👥 Com amigos
- 👨‍👩‍👧 Com a família

**Pergunta 3**
> "Quanto você consegue se concentrar hoje?"
- 🛋️ Pouco — só quero relaxar
- 😊 Médio — me envolvo sem esforço
- 🎯 Total — pode ser intenso

### Tela 5 — Resultado

Exibe as indicações após as 3 perguntas.

- **1 indicação principal** — destaque visual claro (poster, título, tagline, "por que esse filme agora")
- **1 indicação alternativa** — exibida abaixo ou ao lado, com menos destaque ("caso já tenha visto")

Não mais do que 2 indicações — o excesso reproduziria o problema que o produto veio resolver.

Botão para iniciar nova análise ao final.

---

## 5. Algoritmo de recomendação — sistema de pesos

Cada filme tem um vetor de atributos com valores de 0 a 1:

```
humor       → quanto o filme é leve/engraçado
emocional   → quanto o filme é intenso emocionalmente
acao        → quanto o filme tem adrenalina/tensão
reflexivo   → quanto o filme provoca pensamento
social      → adequação para assistir sozinho, a dois, em grupo, em família
atencao     → quanto de concentração o filme exige
```

As respostas do usuário geram um vetor equivalente. O algoritmo calcula a proximidade entre o vetor do usuário e o de cada filme — os 2 mais próximos são exibidos como resultado.

**Mapeamento das perguntas para o vetor:**

Pergunta 1 — estado emocional:
- "Levinho, quero rir" → { humor: 0.9, emocional: 0.1, acao: 0.2, reflexivo: 0.1 }
- "Com vontade de sentir algo" → { humor: 0.1, emocional: 0.9, acao: 0.2, reflexivo: 0.5 }
- "Agitado, quero ação" → { humor: 0.2, emocional: 0.3, acao: 0.9, reflexivo: 0.2 }
- "Curioso, quero pensar" → { humor: 0.2, emocional: 0.5, acao: 0.2, reflexivo: 0.9 }

Pergunta 2 — contexto social (valor para dimensão `social`):
- "Sozinho" → 0.1 (filmes mais densos/pessoais pontuam alto aqui)
- "Com alguém especial" → 0.4
- "Com amigos" → 0.7
- "Com a família" → 1.0 (filmes familiares pontuam alto aqui)

Pergunta 3 — atenção:
- "Pouco — só quero relaxar" → { atencao: 0.1 }
- "Médio — me envolvo sem esforço" → { atencao: 0.5 }
- "Total — pode ser intenso" → { atencao: 0.9 }

O vetor final do usuário é a combinação dessas três respostas. O algoritmo compara com cada filme e retorna os 2 de maior pontuação.

**Para o passo 1 (protótipo mockado):** toda essa lógica pode estar no frontend em JavaScript puro. Um JSON com os filmes e seus vetores, e uma função simples de cálculo de similaridade (soma dos produtos ponderados por dimensão).

---

## 6. Filmes sugeridos para o mock

Lista inicial de referência — pode ser ajustada. Cada filme precisa de: título, poster (URL), tagline, "por que esse filme agora" e vetor de atributos.

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

*Os posters podem ser buscados via TMDB ou usar imagens públicas temporárias no mock.*

---

## 7. Etapas de construção

### Passo 1 — Interface completa mockada (PRIORIDADE — entrega 18/06)

Construir todas as telas com dados estáticos. Nenhuma integração com backend ou API externa. A lógica do algoritmo de pesos roda no frontend em JavaScript.

Telas a construir:
- [ ] Landing page
- [ ] Tela de cadastro/login (sem autenticação real — simular o fluxo)
- [ ] Página principal com histórico mockado e botão de nova análise
- [ ] Fluxo de perguntas — 3 perguntas em multi-step com transição suave
- [ ] Página de resultado com 2 indicações

Stack do passo 1:
- Vite + React 18 + Tailwind CSS
- Lógica de pesos: JavaScript puro no frontend
- Dados dos filmes: JSON hardcoded
- Deploy: Railway (estático)

Design: minimalista, moderno, fluido. Prioridade absoluta para a experiência do fluxo de perguntas.

### Passo 2 — Lógica real e backend (após entrega)

- Implementar autenticação real (cadastro, login, Google OAuth)
- Criar backend (candidatos: Django + MySQL, hospedado no Railway)
- Integrar TMDB API para dados reais dos filmes (posters, sinopses)
- Persistir as respostas dos usuários no banco (dado valioso para o B2B)
- Vincular frontend ao backend via API

*Detalhes técnicos do backend a definir após o passo 1 revelar o que é necessário.*

### Passo 3 — Opcional

- Dashboard de dados coletados (análise psicográfica das respostas)
- Refinamento do algoritmo de recomendação com dados reais

---

## 8. Diretrizes de design

- **Minimalista:** sem elementos desnecessários. Cada tela tem um único foco.
- **Fluido:** transições suaves entre as perguntas. O usuário nunca sente que está preenchendo um formulário.
- **Visual:** as perguntas comunicam via emoji + texto curto. Nada de parágrafos ou instruções longas.
- **Moderno:** tipografia limpa, espaçamento generoso, paleta de cores coesa (a definir — sugestão: fundo escuro com acentos vibrantes, como o tom "cinema").
- **Sem atrito:** ao clicar no card de resposta, avança automaticamente. Sem botão "próximo". Progresso visível mas discreto.

O grande triunfo do protótipo é que o usuário tenha **prazer em usar a interface**. A UX é o argumento mais forte para a entrega.

---

## 9. O que entregar (template FIAP)

O template da atividade tem 3 campos a preencher:

1. **Descrição do protótipo** — nomear que o protótipo é o primeiro instrumento de validação da hipótese de interface; que o fluxo empático foi construído com base nos aprendizados da validação (MVP leve, rápido, visual); e usar o reframing: "empresa de inteligência de consumo audiovisual que usa o app como canal de coleta."

2. **Prints do protótipo** — capturas de tela de cada tela principal (landing, cadastro, página principal, fluxo de perguntas, resultado).

3. **Link para navegação** — link do deploy no Railway.

Exportar o template preenchido como PDF e fazer upload na plataforma FIAP.
