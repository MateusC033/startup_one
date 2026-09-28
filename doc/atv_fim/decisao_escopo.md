# Startup One — Decisão de Escopo da Entrega Final
#fiap #plano

> Por que o escopo foi enxugado. Decidido em diálogo no domingo, 27/09/2026.
> Enunciado: [[entrega_final/enunciado]] · Plano: [[entrega_final/plano]]

---

## A pergunta

Com o prazo na segunda (28/09, 23h59) e o trabalho começando só no domingo, vale investir o tempo em deixar o app completo (backend, login, deploy, painel, visual) ou o tempo rende mais em outro lugar? E um produto melhor, com link acessível para quem corrige, aumenta a nota?

## O que a nota avalia

O enunciado pede **PPT + vídeo de 5 minutos**. Não há campo para link nem critério sobre sistema funcionando. Quem corrige vê o vídeo; dificilmente cria conta e testa o app.

| O que se faz | Quanto aparece no vídeo | Efeito na nota |
|---|---|---|
| **Pitch** (narrativa, slides, gravação) | é o vídeo inteiro | **alto** |
| **Painel de Inteligência** | slides de Solução, Validações e Financeiro | **alto**: mostra o produto B2B que o negócio vende |
| **Visual** | todo print e toda gravação de tela | **médio-alto**: tira a cara de "app genérico de IA" |
| **Backend com login real e deploy** | quase invisível | **baixo** |

A impressão de produto profissional, no vídeo, vem do **visual e do painel**, não do backend. A disciplina (Entrepreneurship) já está projetada para aprovar em [[projetos/fiap/estimativa_notas]]: o que está em jogo é qualidade, não aprovação.

## Estimativa de tempo

| Etapa | Estimativa realista |
|---|---|
| Backend com login real + integração do front | 3–5 h |
| Deploy no Railway com Postgres | 1–2 h |
| Simulador | ~1 h |
| Painel | 2–4 h |
| Visual com a skill | 2–3 h |
| Pitch: slides + ensaio + gravação + edição | 4–6 h |
| **Total** | **~13–21 h** |

É mais do que domingo e segunda oferecem, com loja e outros trabalhos no meio. No plano original o pitch fica por último e absorve qualquer atraso, justamente a parte que vale nota. Risco adicional: virar a noite de domingo cobra na segunda, o dia de gravar.

## Decisão

Manter a ordem, **enxugando o backend ao mínimo que alimenta o painel**:

1. **Backend enxuto:** gravar só análises e feedbacks. **Sem login real** (sessão anônima com apelido e idade). **Rodando local, sem deploy.**
2. **Simulador → Painel.** A energia do domingo vai aqui.
3. **Visual:** segunda de manhã, com tempo limitado.
4. **Pitch:** tarde de segunda protegida. **Upload até ~21h**, não 23h59.
5. **Login real e deploy com link:** depois da entrega, se o projeto for para o portfólio.

**Ponto de corte:** se o painel não estiver de pé até uma hora combinada no domingo à noite, congela no estado em que estiver. Segunda é visual + pitch, sem voltar ao código.

## Ganho além da nota

Dashboard de análise de dados é o tipo de projeto que falta no GitHub para a Fase 1 da carreira (emprego em dados). O plano de robustecer o Startup One já estava registrado em [[presenca_digital/github]]. O tempo no painel rende nas duas frentes; o tempo em login real, em quase nenhuma.
