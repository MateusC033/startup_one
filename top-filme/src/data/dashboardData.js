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

// Insight destacado — o "por quê o cliente B2B paga por isso"
export const insight = {
  numero: '3,1×',
  frase: 'a demanda por "sentir algo" no início da noite supera em 3,1× a busca por comédia leve — inversão do que os catálogos de streaming priorizam no horário nobre.',
  categoria: 'Padrão inédito · Semana de 20 a 27 set',
}
