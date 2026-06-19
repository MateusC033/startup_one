import { movies } from '../data/movies'

const DIMS = ['humor', 'emocional', 'acao', 'reflexivo', 'social', 'atencao']

// Vetor de dimensões por resposta
const VECTORS = {
  // Q1: Estado emocional (peso 1.5 — maior sinal do app)
  rir:      { humor:0.9, emocional:0.1, acao:0.3, reflexivo:0.1, social:0.6, atencao:0.3 },
  sentir:   { humor:0.1, emocional:0.9, acao:0.1, reflexivo:0.6, social:0.3, atencao:0.7 },
  acao:     { humor:0.2, emocional:0.3, acao:0.9, reflexivo:0.2, social:0.5, atencao:0.6 },
  pensar:   { humor:0.1, emocional:0.5, acao:0.2, reflexivo:0.9, social:0.1, atencao:0.9 },
  // Q2: Com quem vai assistir (peso 0.8)
  sozinho:  { humor:0.3, emocional:0.7, acao:0.3, reflexivo:0.8, social:0.1, atencao:0.7 },
  especial: { humor:0.5, emocional:0.8, acao:0.3, reflexivo:0.4, social:0.7, atencao:0.5 },
  amigos:   { humor:0.8, emocional:0.3, acao:0.6, reflexivo:0.2, social:0.9, atencao:0.2 },
  familia:  { humor:0.7, emocional:0.5, acao:0.3, reflexivo:0.3, social:0.9, atencao:0.1 },
  // Q3: Concentração (peso 1.0)
  relaxar:  { humor:0.5, emocional:0.3, acao:0.4, reflexivo:0.2, social:0.4, atencao:0.1 },
  medio:    { humor:0.4, emocional:0.5, acao:0.5, reflexivo:0.4, social:0.5, atencao:0.5 },
  intenso:  { humor:0.1, emocional:0.6, acao:0.6, reflexivo:0.8, social:0.2, atencao:0.9 },
  // Q4: Como quer se sentir ao terminar (peso 1.5 — segundo maior sinal)
  inspirado:  { humor:0.3, emocional:0.8, acao:0.4, reflexivo:0.7, social:0.5, atencao:0.6 },
  aliviado:   { humor:0.6, emocional:0.6, acao:0.2, reflexivo:0.4, social:0.5, atencao:0.3 },
  pensativo:  { humor:0.1, emocional:0.6, acao:0.2, reflexivo:0.9, social:0.2, atencao:0.8 },
  animado:    { humor:0.9, emocional:0.2, acao:0.3, reflexivo:0.1, social:0.7, atencao:0.2 },
  // Q5: Tipo de mundo (peso 1.2)
  real:     { humor:0.2, emocional:0.8, acao:0.2, reflexivo:0.8, social:0.4, atencao:0.7 },
  epico:    { humor:0.2, emocional:0.4, acao:0.9, reflexivo:0.4, social:0.6, atencao:0.5 },
  intimo:   { humor:0.3, emocional:0.9, acao:0.1, reflexivo:0.7, social:0.3, atencao:0.5 },
  surpresa: { humor:0.4, emocional:0.5, acao:0.6, reflexivo:0.7, social:0.4, atencao:0.8 },
}

// Q1 e Q4 capturam o estado emocional central — maior peso
const WEIGHTS = [1.5, 0.8, 1.0, 1.5, 1.2]

export function buildUserVector(answers) {
  const vec = { humor: 0, emocional: 0, acao: 0, reflexivo: 0, social: 0, atencao: 0 }
  answers.forEach((key, i) => {
    const v = VECTORS[key]
    if (!v) return
    const w = WEIGHTS[i] ?? 1
    DIMS.forEach(d => { vec[d] += v[d] * w })
  })
  const max = Math.max(...DIMS.map(d => vec[d]))
  if (max > 0) DIMS.forEach(d => { vec[d] /= max })
  return vec
}

// Cosine similarity entre dois objetos com as dimensões DIMS
function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0
  DIMS.forEach(d => {
    dot  += a[d] * b[d]
    magA += a[d] ** 2
    magB += b[d] ** 2
  })
  const mag = Math.sqrt(magA) * Math.sqrt(magB)
  return mag > 0 ? dot / mag : 0
}

// MMR: penalidade de diversidade para a 2ª e 3ª indicações
// Evita que três filmes do mesmo "perfil" apareçam juntos
const MMR_LAMBDA = 0.35

export function getRecommendations(answers) {
  const userVec = buildUserVector(answers)

  // 1. Pontua todos os filmes por cosine similarity (e não dot product bruto)
  //    Filmes com altos scores em TODAS as dimensões são penalizados pelo denominador
  const scored = movies
    .map(m => ({ ...m, score: cosineSim(userVec, m) }))
    .sort((a, b) => b.score - a.score)

  // 2. MMR: seleciona iterativamente maximizando relevância - diversidade
  const selected = [scored[0]]
  const pool = scored.slice(1)

  while (selected.length < 3 && pool.length > 0) {
    let bestIdx = 0
    let bestMMR = -Infinity

    pool.forEach((candidate, i) => {
      const maxSim = Math.max(...selected.map(s => cosineSim(s, candidate)))
      const mmrScore = candidate.score - MMR_LAMBDA * maxSim
      if (mmrScore > bestMMR) {
        bestMMR = mmrScore
        bestIdx = i
      }
    })

    selected.push(pool[bestIdx])
    pool.splice(bestIdx, 1)
  }

  return selected
}
