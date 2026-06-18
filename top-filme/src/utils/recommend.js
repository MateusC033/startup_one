import { movies } from '../data/movies'

export function buildUserVector(answers) {
  const [q1, q2, q3] = answers

  const emotionMap = {
    'rir':    { humor: 0.9, emocional: 0.1, acao: 0.2, reflexivo: 0.1 },
    'sentir': { humor: 0.1, emocional: 0.9, acao: 0.2, reflexivo: 0.5 },
    'acao':   { humor: 0.2, emocional: 0.3, acao: 0.9, reflexivo: 0.2 },
    'pensar': { humor: 0.2, emocional: 0.5, acao: 0.2, reflexivo: 0.9 },
  }

  const socialMap = {
    'sozinho':  0.1,
    'especial': 0.4,
    'amigos':   0.7,
    'familia':  1.0,
  }

  const atencaoMap = {
    'relaxar':  0.1,
    'medio':    0.5,
    'intenso':  0.9,
  }

  const emotion = emotionMap[q1] ?? emotionMap['rir']
  const social = socialMap[q2] ?? 0.5
  const atencao = atencaoMap[q3] ?? 0.5

  return { ...emotion, social, atencao }
}

function dotScore(userVec, movie) {
  return (
    userVec.humor    * movie.humor +
    userVec.emocional * movie.emocional +
    userVec.acao     * movie.acao +
    userVec.reflexivo * movie.reflexivo +
    userVec.social   * movie.social +
    userVec.atencao  * movie.atencao
  )
}

export function getRecommendations(answers) {
  const userVec = buildUserVector(answers)

  const scored = movies
    .map(movie => ({ movie, score: dotScore(userVec, movie) }))
    .sort((a, b) => b.score - a.score)

  return [scored[0].movie, scored[1].movie]
}
