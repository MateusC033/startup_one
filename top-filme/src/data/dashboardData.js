// Dados agregados simulados para o Painel de Inteligência.
// Números coerentes entre si: 847 análises / 312 usuários únicos ≈ 2,7 análises por usuário.

const T = 'https://image.tmdb.org/t/p/w500'

export const kpis = {
  totalAnalises: 847,
  usuariosUnicos: 312,
  tempoMedioSeg: 98,
  retorno7d: 0.41,
}

// Q1 — estado emocional ao chegar (soma = 100%)
export const estadoEmocional = [
  { key: 'sentir',  label: 'Sentir algo',    valor: 32 },
  { key: 'rir',     label: 'Levinho',         valor: 28 },
  { key: 'pensar',  label: 'Curioso',         valor: 22 },
  { key: 'acao',    label: 'Ação',            valor: 18 },
]

// Q4 — destino emocional desejado (soma = 100%)
export const destinoEmocional = [
  { key: 'aliviado',   label: 'Aliviado',   valor: 31 },
  { key: 'pensativo',  label: 'Pensativo',  valor: 27 },
  { key: 'inspirado',  label: 'Inspirado',  valor: 24 },
  { key: 'animado',    label: 'Animado',    valor: 18 },
]

// Q2 — companhia (donut, soma = 100%)
export const companhia = [
  { key: 'sozinho',  label: 'Sozinho',      valor: 44 },
  { key: 'amigos',   label: 'Com amigos',   valor: 26 },
  { key: 'especial', label: 'Alguém especial', valor: 18 },
  { key: 'familia',  label: 'Família',      valor: 12 },
]

// Distribuição por hora do dia (24 posições, escala 0-100 relativa ao pico)
// Pico à noite (21h-23h) — coerente com o hábito de consumo de filmes.
export const horariosPico = [
  4,  2,  1,  1,  1,  2,  4,  8,  12, 14, 16, 18,
  22, 25, 26, 30, 38, 44, 55, 68, 82, 95, 88, 62,
]

// Top filmes mais recomendados (frequência absoluta em 30 dias)
export const topFilmes = [
  { titulo: 'Parasita',           frequencia: 47, poster: `${T}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg` },
  { titulo: 'La La Land',         frequencia: 41, poster: `${T}/AvMietG6xuobpSSdmVnKuTjv4bL.jpg` },
  { titulo: 'Interestelar',       frequencia: 38, poster: `${T}/tR1XVa5bxgdh2bRw2u0DzrgkO2l.jpg` },
  { titulo: 'Divertida Mente',    frequencia: 34, poster: `${T}/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg` },
  { titulo: 'Coringa',            frequencia: 29, poster: `${T}/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg` },
  { titulo: 'A Vida é Bela',      frequencia: 26, poster: `${T}/74hLDKjD5aGYOotO6esUVaeISa2.jpg` },
  { titulo: 'Forrest Gump',       frequencia: 23, poster: `${T}/d74WpIsH8379TIL4wUxDneRCYv2.jpg` },
  { titulo: 'Mad Max: Fúria',     frequencia: 19, poster: `${T}/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg` },
]

// Insight principal e secundário — o "por quê o cliente B2B paga por isso"
export const insight = {
  numero: '3,1×',
  frase: 'a demanda por "sentir algo" no início da noite supera em 3,1× a busca por comédia leve — inversão do que os catálogos de streaming priorizam no horário nobre.',
  categoria: 'Padrão inédito · Semana de 20 a 27 set',
}

export const insightSecundario = {
  numero: '47%',
  frase: 'do consumo emocional entre 22h e meia-noite vem do cluster 25–34 anos — audiência premium invisível para os algoritmos genéricos dos catálogos.',
  categoria: 'Segmento de valor · Cruzamento idade × horário',
}

// Heatmap: cada emoção tem 24 valores (0–100) por hora do dia
export const heatmapEmoHora = {
  sentir: [ 2, 1, 1, 1, 0, 1, 2, 3, 4, 5, 8,10,14,18,22,28,35,42,55,68,85,95,88,72],
  rir:    [ 3, 2, 1, 1, 1, 1, 3, 6,10,15,20,25,30,32,35,42,48,55,72,88,92,85,60,25],
  pensar: [55,62,68,45,20,12, 8,10,15,20,25,28,34,38,42,48,52,58,64,52,45,40,50,54],
  acao:   [15,10, 8, 5, 3, 2, 8,20,25,30,35,42,48,52,58,65,72,80,88,85,78,65,45,25],
}

// Segmentação demográfica — % de cada estado emocional por faixa etária
// Cada linha soma 100%. Peso das faixas: 16-24=30%, 25-34=35%, 35-44=20%, 45+=15%
export const demografia = [
  { faixa: '16–24', peso: 30, humores: { acao: 40, rir: 30, sentir: 18, pensar: 12 } },
  { faixa: '25–34', peso: 35, humores: { sentir: 38, rir: 28, pensar: 20, acao: 14 } },
  { faixa: '35–44', peso: 20, humores: { pensar: 34, sentir: 32, rir: 22, acao: 12 } },
  { faixa: '45+',   peso: 15, humores: { pensar: 40, sentir: 38, rir: 20, acao:  2 } },
]
