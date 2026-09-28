# Viabilidade Financeira — Premissas do Modelo
#fiap #plano

> Por que cada número da planilha é o que é. A planilha sozinha não explica o raciocínio.
> Construído em 01/09/2026. Entrega: [[enunciado]] · Planilha: `viabilidade_financeira.xlsx`

---

## A decisão que organiza tudo: usuário ≠ pagador

O Top Filme é B2C gratuito + B2B pago. O app não gera receita nenhuma — ele é o instrumento de coleta de dados psicográficos. Quem paga é o cliente B2B.

**Consequência direta no modelo:** o app não entra como linha de produto. Ele entra inteiro do lado das saídas (hospedagem, marketing de aquisição). As três linhas de receita são todas B2B.

Isso responde os pontos 1, 3 e 4 do enunciado de uma vez só.

## Configuração da planilha

- **Atividade = 2 (Serviços)** → trava o imposto sobre receita em 5% na DRE. Comércio seria 18%. Para empresa de inteligência de dados, serviços é o enquadramento correto e o mais favorável.
- **Três linhas de receita.** Não é escolha estética: o template quebra a partir do produto 4 (ver "Limitação técnica" abaixo).
- Percentuais de crescimento, reajuste de despesas e reajuste de custos: **mantidos os defaults do template** (100%/65%/25%/5%, 30%/15%/5%/0%, 11% ao ano).

## Linhas de receita

| Linha | Ticket | Ramp no ano 1 | Receita ano 1 |
|---|---|---|---|
| Relatório Psicográfico (avulso) | R$ 4.500 | começa mês 4, chega a 7/mês | 35 un · R$ 157.500 |
| Painel de Inteligência (assinatura) | R$ 2.900/mês | começa mês 7, 6 assinantes no mês 12 | 21 mês-assinatura · R$ 60.900 |
| Teste de Hipótese Comissionado | R$ 12.000 | começa mês 9, 1-2/mês | 6 un · R$ 72.000 |

**Total ano 1: R$ 290.400.**

O ramp escalonado não é enfeite. Ele conta a história certa:
- O **relatório** só existe depois que há base de usuários gerando dado — por isso mês 4.
- O **teste de hipótese** só é vendável quando a base tem volume para amostra estatística — por isso mês 9.
- O **painel** é a linha recorrente, a única que escala sem custo proporcional.

Essa diferença entre as linhas responde o ponto 5 do enunciado ("atividades que roubam a escala"): relatório e teste de hipótese são intensivos em trabalho humano; a assinatura é o que escala.

## Custo unitário

Custo **variável direto de entrega**, apenas.

| Linha | Custo unitário |
|---|---|
| Relatório Psicográfico | R$ 600 |
| Painel (por mês de assinatura) | R$ 350 |
| Teste de Hipótese | R$ 2.800 |

**Armadilha evitada:** se "horas de análise" entrassem no custo unitário e o salário do cientista de dados também entrasse nas despesas operacionais, o mesmo custo seria contado duas vezes. Por isso o custo unitário cobre só compute, infra dedicada e terceiro pontual — nunca o time fixo.

**CMV ano 1: R$ 45.150.**

## Investimento pré-operacional (mês 0)

| Item | Valor |
|---|---|
| Documentação (CNPJ, contador, registro de marca) | R$ 3.500 |
| Máquinas e equipamentos | R$ 12.000 |
| Móveis e utensílios | R$ 4.000 |
| Advogado | R$ 6.000 |
| Desenvolvimento do site (MVP) | R$ 9.600 |
| Desenvolvimento App Android | R$ 35.000 |
| Desenvolvimento App iOS | R$ 35.000 |
| Sistema web (dashboard B2B + pipeline e banco de dados) | R$ 45.000 |
| Outros pré-operacionais (infra de dados inicial, licenças, setup) | R$ 8.000 |
| **Total** | **R$ 158.100** |

Cinco escolhas que precisam de justificativa:

- **Advogado R$ 6.000 não é gordura.** É LGPD e termos de uso. Num negócio que vende dado comportamental de usuário, isso é risco de existência, não formalidade.
- **MVP a R$ 9.600.** O protótipo foi construído pelo próprio fundador, sem desembolso. Mas mão de obra do fundador não é custo zero — está valorada a preço de mercado: **6 semanas (240 horas) × R$ 40/hora**, cobrindo o tempo total estimado de trabalho no projeto. Valores hipotéticos assumidos para o exercício.
- **Apps nativos Android e iOS a R$ 35.000 cada.** O ativo do negócio é a base de usuários gerando dado. Volume e recorrência de uso são o que sustentam a venda B2B, e app nativo entrega isso melhor que web. O template já previa essas linhas.
- **Sistema web a R$ 45.000.** Dashboard B2B mais o pipeline e o banco de dados. Diferente do MVP, nada disso existe ainda.
- **Outros pré-operacionais a R$ 8.000.** Infraestrutura de dados inicial, licenças e setup.

### Por que o capex foi revisado (01/09/2026)

A primeira versão do modelo fechava o investimento inicial em R$ 48.100, e a TIR saía em 175% ao ano — alta a ponto de soar irreal.

A tentação era inflar as horas do fundador para derrubar o indicador. Isso não funciona e seria maquiagem: passar de 1 para 6 semanas leva a TIR apenas de 175% para 161%, porque R$ 8 mil no ano 0 não competem com R$ 1,6 milhão de fluxo acumulado nos anos 2 a 5.

O problema real era outro: **o capex estava conceitualmente errado.** Faltava o que o negócio de fato exige:

1. **Massa crítica de usuários.** Não se vende relatório psicográfico com uma base pequena. O que sustenta o B2B é volume de uso — daí os apps nativos.
2. **Infraestrutura de dados de verdade.** O dado é o ativo; pipeline e banco não podiam ficar de fora.
3. **Mão de obra do fundador pelo tempo real do projeto**, não só do protótipo.

Corrigido isso, o investimento vai a R$ 158.100 e a **TIR cai para 89% ao ano** — alta, mas crível para startup digital early-stage (VC de estágio inicial busca 30-50%). Nessa etapa a DRE não mudou em nada: só o ano 0 e a TIR se moveram.

A lição vale além desta entrega: **o indicador melhorou porque o modelo ficou mais honesto, não porque o número foi esticado.**

### Revisão final: o parceiro (01/09/2026)

Uma revisão da entrega contra os sete pontos do enunciado encontrou uma lacuna: o item 6 ("buscar parceiros") não tinha nenhuma contrapartida na planilha. Nem custo, nem receita, nem menção — e o Canvas já previa o TMDB como parceiro de catálogo.

Correção: a linha "Despesas com serviços" passou de R$ 1.200 para R$ 2.000 mensais, absorvendo R$ 800 de licenciamento de catálogo. Fecha o item sem inventar linha nova no template.

Efeito: despesas do ano 1 vão a R$ 249.240, o prejuízo do ano 1 vai a R$ 18.510 e a **TIR fecha em 85% ao ano**.

## Despesas operacionais (mensais, ano 1)

| Item | Valor |
|---|---|
| Salários (1 cientista de dados, a partir do mês 4) | R$ 7.500 |
| Retirada dos sócios | R$ 4.000 |
| Comissões de venda | 8% da receita do mês |
| Marketing | R$ 3.000 (meses 1-3) → R$ 5.000 |
| Processadora de pagamento | 2% da receita do mês |
| Hospedagem | R$ 400 → R$ 900 → R$ 1.600 (escala com usuários) |
| Serviços (contador R$ 1.200 + licença de catálogo TMDB R$ 800) | R$ 2.000 |
| Água / Energia | R$ 150 / R$ 300 |
| Depreciação | R$ 266,67 |
| Outras | R$ 500 |
| Aluguel | R$ 0 (operação remota) |

**Total ano 1: R$ 249.240.**

A hospedagem sobe em degraus porque o custo de infra acompanha a base de usuários do app gratuito — que é justamente o custo do lado que não gera receita.

**A linha de serviços carrega o parceiro.** Dos R$ 2.000 mensais, R$ 800 são licenciamento de catálogo (TMDB, previsto no Canvas como parceiro de catálogo) e R$ 1.200 são contador. O parceiro foi incluído porque o enunciado pede explicitamente "buscar parceiros" e, sem essa linha, o item ficava sem resposta na planilha. O TMDB é gratuito para uso não comercial, mas o Top Filme é comercial — a licença é um custo real, não figurativo.

## Resultado

| | Ano 1 | Ano 2 | Ano 3 | Ano 4 | Ano 5 |
|---|---|---|---|---|---|
| Receita bruta | 290.400 | 580.800 | 958.320 | 1.197.900 | 1.257.795 |
| Lucro/Prejuízo líquido | **-18.510** | 133.224 | 361.621 | 516.959 | 554.540 |

**Prejuízo de R$ 18.510 no ano 1 é proposital.** Startup que projeta lucro no primeiro ano na frente de investidor perde credibilidade. O que vende é a curva: prejuízo contido no ano 1, virada no ano 2 puxada pela linha de assinatura.

**TIR: 85% ao ano.** Alta, mas crível para startup digital early-stage — VC de estágio inicial busca 30-50% ao ano, então 85% é uma tese atraente sem soar inventada. Necessidade total de investimento: cerca de R$ 177 mil (capex de R$ 158.100 mais a queima de caixa do ano 1), uma rodada seed plausível no Brasil.

---

## Limitação técnica do template (achado)

A aba `Calculo de Custo` puxa o custo unitário de cada produto da aba `Custo Unitário`. **Do produto 1 ao 3 o mapeamento está correto** (`B4`, `B6`, `B8`). A partir do produto 4 ele pula linhas: o produto 4 aponta para `B14`, que é o produto 6; do produto 7 em diante aponta para células que nem existem na aba.

Confirmação: a linha "Assinaturas ativas" (`Calculo de Custo` linha 5) soma apenas as três primeiras linhas de produto. A versão RevFinal foi adaptada para 3 linhas de receita e o resto ficou para trás.

**Por isso o modelo usa exatamente 3 linhas.** Não é limitação do projeto, é onde a planilha para de funcionar.

## Como a planilha foi preenchida

Não havia Excel nem LibreOffice na máquina. O preenchimento foi feito editando o XML dentro do `.xlsx` diretamente, escrevendo apenas nas 235 células de input (as verdes, `indexed 11` e `FF1FB714`).

Resultado verificado:
- 46 das 53 partes do pacote ficaram **byte-idênticas** ao template original
- **750 fórmulas conferidas contra o original, 0 alteradas**
- Gráfico, 17 comentários, estilos e configurações de impressão preservados
- Os valores calculados foram gravados no cache das fórmulas e `fullCalcOnLoad` foi ativado, para que a planilha mostre os números corretos tanto em visualizador que recalcula quanto em um que só lê o cache

Os números foram validados avaliando as próprias fórmulas do arquivo (IF, SUM, AVERAGE, IRR), não por aritmética paralela.
