// =============================================================
// Transformer Visual Lab — motor de simulação determinístico
// Todos os valores são simulados no navegador. Nenhum modelo
// real é executado. A seed deriva do texto: o mesmo texto
// sempre produz os mesmos números.
// =============================================================

import { KIND_COUNT, VOCAB_WORDS, WORD_KIND } from './vocab'

export type Matrix = number[][]
export type Vector = number[]

export interface TokenInfo {
  text: string
  id: number
  position: number
  color: string
}

export interface HeadResult {
  name: string
  description: string
  scores: Matrix
  softmax: Matrix
  output: Matrix
  intensity: number
}

export interface BlockResult {
  input: Matrix
  Q: Matrix
  K: Matrix
  V: Matrix
  scoresRaw: Matrix
  scoresScaled: Matrix
  attnWeights: Matrix
  weightedOutput: Matrix
  heads: HeadResult[]
  concatHeads: Matrix
  addNorm1Sum: Matrix
  addNorm1: Matrix
  ffnHidden: Matrix
  ffnActivated: Matrix
  ffnOutput: Matrix
  addNorm2Sum: Matrix
  addNorm2: Matrix
}

export interface VocabEntry {
  word: string
  logit: number
  prob: number
}

export interface SimulationResult {
  text: string
  tokens: TokenInfo[]
  dim: number
  numHeads: number
  numBlocks: number
  embeddings: Matrix
  positional: Matrix
  embeddingsWithPosition: Matrix
  blocks: BlockResult[]
  vocab: VocabEntry[]
  predictedGreedy: string
  predictedSampled: string
  totalOperations: number
  simulatedTimeMs: number
}

// ---------------- Seed / RNG determinístico ----------------

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRng(seedText: string): () => number {
  return mulberry32(xmur3(seedText)())
}

export const round3 = (x: number): number => Math.round(x * 1000) / 1000

const roundMatrix = (m: Matrix): Matrix => m.map((row) => row.map(round3))

// ---------------- Álgebra de matrizes ----------------

let opCounter = 0

function matMul(a: Matrix, b: Matrix): Matrix {
  const rows = a.length
  const inner = b.length
  const cols = b[0].length
  opCounter += rows * inner * cols
  const out: Matrix = []
  for (let i = 0; i < rows; i++) {
    const row: number[] = []
    for (let j = 0; j < cols; j++) {
      let s = 0
      for (let k = 0; k < inner; k++) s += a[i][k] * b[k][j]
      row.push(s)
    }
    out.push(row)
  }
  return out
}

export function transpose(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => row[j]))
}

function addMatrices(a: Matrix, b: Matrix): Matrix {
  opCounter += a.length * a[0].length
  return a.map((row, i) => row.map((v, j) => v + b[i][j]))
}

export function softmaxRow(row: number[]): number[] {
  const max = Math.max(...row)
  const exps = row.map((v) => Math.exp(v - max))
  const sum = exps.reduce((s, v) => s + v, 0)
  opCounter += row.length * 2
  return exps.map((v) => v / sum)
}

function softmaxMatrix(m: Matrix): Matrix {
  return m.map(softmaxRow)
}

function layerNorm(m: Matrix): Matrix {
  opCounter += m.length * m[0].length * 3
  return m.map((row) => {
    const mean = row.reduce((s, v) => s + v, 0) / row.length
    const variance = row.reduce((s, v) => s + (v - mean) ** 2, 0) / row.length
    const std = Math.sqrt(variance + 1e-5)
    return row.map((v) => (v - mean) / std)
  })
}

function relu(m: Matrix): Matrix {
  opCounter += m.length * m[0].length
  return m.map((row) => row.map((v) => Math.max(0, v)))
}

function randomMatrix(rng: () => number, rows: number, cols: number, scale = 1): Matrix {
  const out: Matrix = []
  for (let i = 0; i < rows; i++) {
    const row: number[] = []
    for (let j = 0; j < cols; j++) row.push((rng() * 2 - 1) * scale)
    out.push(row)
  }
  return out
}

// ---------------- Tokenização ----------------

export const TOKEN_COLORS = [
  '#38bdf8', '#f472b6', '#4ade80', '#fbbf24', '#a78bfa',
  '#fb7185', '#2dd4bf', '#fb923c', '#818cf8', '#a3e635',
  '#e879f9', '#22d3ee', '#facc15', '#f87171', '#34d399',
]

export function tokenize(text: string): TokenInfo[] {
  const raw = text
    .trim()
    .split(/(\s+|[.,;:!?])/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  return raw.map((t, i) => {
    const hash = xmur3(t.toLowerCase())()
    return {
      text: t,
      id: hash % 1000,
      position: i,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
    }
  })
}

// ---------------- Positional encoding (seno/cosseno) ----------------

export function positionalEncoding(numTokens: number, dim: number): Matrix {
  const out: Matrix = []
  for (let pos = 0; pos < numTokens; pos++) {
    const row: number[] = []
    for (let i = 0; i < dim; i++) {
      const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dim)
      row.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle))
    }
    out.push(row)
  }
  return roundMatrix(out)
}

// ---------------- Cabeças de atenção ----------------

export const HEAD_PATTERNS = [
  {
    name: 'Proximidade',
    description: 'Presta mais atenção nos tokens vizinhos (antes e depois).',
  },
  {
    name: 'Relação semântica',
    description: 'Conecta tokens com significados relacionados.',
  },
  {
    name: 'Ordem',
    description: 'Foca nos tokens que vieram antes na sequência.',
  },
  {
    name: 'Contexto global',
    description: 'Distribui a atenção por toda a frase.',
  },
]

function headBias(pattern: number, n: number, rng: () => number): Matrix {
  const bias: Matrix = []
  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < n; j++) {
      switch (pattern) {
        case 0: // proximidade
          row.push(1.6 * (1 - Math.abs(i - j) / Math.max(n - 1, 1)))
          break
        case 1: // relação semântica (padrão fixo derivado da seed)
          row.push((rng() * 2 - 1) * 1.4)
          break
        case 2: // ordem: olha para trás
          row.push(j <= i ? 0.9 - 0.15 * (i - j) : -1.2)
          break
        default: // contexto global: quase uniforme
          row.push((rng() * 2 - 1) * 0.15)
      }
    }
    bias.push(row)
  }
  return bias
}

// ---------------- Vocabulário simulado ----------------
// ~1000 tokens categorizados, definidos em vocab.ts (inclui tokens
// dinâmicos com o dia atual). Re-exportado para uso nos componentes.

export { VOCAB_WORDS } from './vocab'

// ---------------- Simulação completa ----------------

export function runSimulation(
  text: string,
  dim: number,
  numHeads: number,
  numBlocks: number,
): SimulationResult {
  opCounter = 0
  const tokens = tokenize(text)
  const n = Math.max(tokens.length, 1)
  const seedBase = `${text}|d${dim}|h${numHeads}`

  // Embeddings: determinísticos por token (mesma palavra = mesmo vetor)
  const embeddings: Matrix = tokens.map((tok) => {
    const rng = makeRng(`emb|${tok.text.toLowerCase()}|d${dim}`)
    return Array.from({ length: dim }, () => round3(rng() * 2 - 1))
  })

  const positional = positionalEncoding(n, dim)
  const embeddingsWithPosition = roundMatrix(addMatrices(embeddings, positional))

  const blocks: BlockResult[] = []
  let x = embeddingsWithPosition

  for (let b = 0; b < numBlocks; b++) {
    const rngW = makeRng(`${seedBase}|block${b}|weights`)
    const scale = 0.6

    // --- Atenção principal (dimensão completa, didática) ---
    const Wq = randomMatrix(rngW, dim, dim, scale)
    const Wk = randomMatrix(rngW, dim, dim, scale)
    const Wv = randomMatrix(rngW, dim, dim, scale)

    const Q = roundMatrix(matMul(x, Wq))
    const K = roundMatrix(matMul(x, Wk))
    const V = roundMatrix(matMul(x, Wv))

    const scoresRaw = roundMatrix(matMul(Q, transpose(K)))
    const scale_d = Math.sqrt(dim)
    const scoresScaled = roundMatrix(scoresRaw.map((row) => row.map((v) => v / scale_d)))
    const attnWeights = roundMatrix(softmaxMatrix(scoresScaled))
    const weightedOutput = roundMatrix(matMul(attnWeights, V))

    // --- Multi-head (cada cabeça com um viés de padrão diferente) ---
    const headDim = Math.max(Math.floor(dim / numHeads), 1)
    const heads: HeadResult[] = []
    for (let h = 0; h < numHeads; h++) {
      const rngH = makeRng(`${seedBase}|block${b}|head${h}`)
      const Wqh = randomMatrix(rngH, dim, headDim, scale)
      const Wkh = randomMatrix(rngH, dim, headDim, scale)
      const Wvh = randomMatrix(rngH, dim, headDim, scale)
      const Qh = matMul(x, Wqh)
      const Kh = matMul(x, Wkh)
      const Vh = matMul(x, Wvh)
      const rawScores = matMul(Qh, transpose(Kh)).map((row) =>
        row.map((v) => v / Math.sqrt(headDim)),
      )
      const bias = headBias(h % 4, n, makeRng(`${seedBase}|bias${h}`))
      const biased = rawScores.map((row, i) => row.map((v, j) => v * 0.4 + bias[i][j]))
      const sm = softmaxMatrix(biased)
      const out = matMul(sm, Vh)
      const intensity = round3(
        sm.reduce((s, row) => s + Math.max(...row), 0) / n,
      )
      heads.push({
        name: HEAD_PATTERNS[h % 4].name,
        description: HEAD_PATTERNS[h % 4].description,
        scores: roundMatrix(biased),
        softmax: roundMatrix(sm),
        output: roundMatrix(out),
        intensity,
      })
    }
    const concatHeads = roundMatrix(
      tokens.map((_, i) => heads.flatMap((h) => h.output[i])),
    )

    // --- Add & Norm 1 ---
    const addNorm1Sum = roundMatrix(addMatrices(x, weightedOutput))
    const addNorm1 = roundMatrix(layerNorm(addNorm1Sum))

    // --- Feed Forward ---
    const hidden = dim * 2
    const W1 = randomMatrix(rngW, dim, hidden, scale)
    const W2 = randomMatrix(rngW, hidden, dim, scale)
    const ffnHidden = roundMatrix(matMul(addNorm1, W1))
    const ffnActivated = roundMatrix(relu(ffnHidden))
    const ffnOutput = roundMatrix(matMul(ffnActivated, W2))

    // --- Add & Norm 2 ---
    const addNorm2Sum = roundMatrix(addMatrices(addNorm1, ffnOutput))
    const addNorm2 = roundMatrix(layerNorm(addNorm2Sum))

    blocks.push({
      input: x,
      Q, K, V,
      scoresRaw, scoresScaled, attnWeights, weightedOutput,
      heads, concatHeads,
      addNorm1Sum, addNorm1,
      ffnHidden, ffnActivated, ffnOutput,
      addNorm2Sum, addNorm2,
    })
    x = addNorm2
  }

  // --- Logits e probabilidades ---
  const lastToken = x[x.length - 1] ?? Array(dim).fill(0)
  const logitsRaw = VOCAB_WORDS.map((word) => {
    const rngV = makeRng(`vocab|${word}|d${dim}`)
    const wordVec = Array.from({ length: dim }, () => rngV() * 2 - 1)
    opCounter += dim
    return wordVec.reduce((s, v, i) => s + v * lastToken[i], 0) * 1.4
  })
  const probs = softmaxRow(logitsRaw)
  // Probabilidades com 6 casas: com ~1000 palavras, muitas ficam < 0.001
  const vocab: VocabEntry[] = VOCAB_WORDS.map((word, i) => ({
    word,
    logit: round3(logitsRaw[i]),
    prob: Math.round(probs[i] * 1e6) / 1e6,
  }))

  const greedyIdx = probs.indexOf(Math.max(...probs))

  // Amostragem simulada (determinística via seed do texto)
  const rngSample = makeRng(`sample|${seedBase}`)
  const r = rngSample()
  let acc = 0
  let sampledIdx = greedyIdx
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i]
    if (r <= acc) { sampledIdx = i; break }
  }

  return {
    text,
    tokens,
    dim,
    numHeads,
    numBlocks,
    embeddings,
    positional,
    embeddingsWithPosition,
    blocks,
    vocab,
    predictedGreedy: VOCAB_WORDS[greedyIdx],
    predictedSampled: VOCAB_WORDS[sampledIdx],
    totalOperations: opCounter,
    simulatedTimeMs: round3(opCounter / 5000),
  }
}

// ---------------- Geração autorregressiva ----------------
// Repete o ciclo completo: prevê um token, anexa ao texto e roda o
// pipeline de novo — é assim que um LLM real escreve, token por token.
// Sobre os logits do Transformer aplicamos técnicas reais de
// decodificação: penalidade de repetição, comprimento mínimo antes do
// "." e um viés de plausibilidade gramatical (simulando o encadeamento
// que um modelo treinado aprenderia). Para no "." ou em maxTokens.

const MIN_TOKENS_BEFORE_END = 2
const BLOCKED = -100

function decodeBias(
  word: string,
  prev: string | null,
  position: number,
  maxTokens: number,
  used: Set<string>,
  usedKinds: Set<string>,
): number {
  const kind = WORD_KIND[word]
  const prevKind = prev ? WORD_KIND[prev] : null
  const remaining = maxTokens - position

  // Prior por categoria: sem isso, a categoria com mais palavras
  // domina o softmax por pura massa (875 locuções vs 3 pontuações)
  const catPrior = -Math.log(KIND_COUNT[kind])

  // Pontuação final: bloqueada no início, cada vez mais provável depois
  // e praticamente garantida no último token disponível
  if (kind === 'fim') {
    if (position < MIN_TOKENS_BEFORE_END || prevKind === 'conjuncao' || prevKind === 'intensificador') {
      return BLOCKED
    }
    if (remaining <= 1) return 30
    return catPrior + 2 * (position - MIN_TOKENS_BEFORE_END + 1)
  }

  // Perto do limite não há espaço para "porque..." / "muito..." sem fecho
  if ((kind === 'conjuncao' || kind === 'intensificador') && remaining <= 2) {
    return BLOCKED
  }

  // Penalidade de repetição (como em LLMs reais)
  if (word === prev) return BLOCKED
  let bias = catPrior + (used.has(word) ? -5 : 0)

  // Variedade: repetir a mesma categoria na frase soa estranho
  // ("ontem ... em janeiro"), exceto adjetivos ligados por conjunção
  if (usedKinds.has(kind) && kind !== 'adjetivo') {
    bias += kind === 'tempo' ? -3 : -2
  }

  // Encadeamento gramatical
  if (prevKind === 'intensificador') {
    bias += kind === 'adjetivo' ? 4 : BLOCKED // "muito" pede adjetivo
  } else if (prevKind === 'conjuncao') {
    bias += kind === 'conjuncao' ? BLOCKED : 1.5 // "e" pede conteúdo
  } else if (prevKind === 'adjetivo') {
    bias += kind === 'conjuncao' || kind === 'tempo' || kind === 'adverbial' ? 2 : BLOCKED
  } else if (prevKind === 'tempo') {
    // adjetivo direto após tempo soa solto ("cedo descansado") — prefere "e"
    bias += kind === 'tempo' ? -2.5 : kind === 'adjetivo' ? -1 : 1.5
  } else if (prevKind === 'adverbial') {
    // depois de um lugar, prefere conectar ou fechar em vez de emendar outro
    bias += kind === 'adverbial' ? -2.5 : kind === 'adjetivo' ? -1 : 1.5
  } else {
    // início da continuação: evita começar com conjunção
    bias += kind === 'conjuncao' ? -2.5 : 0.5
  }
  return bias
}

export function generateContinuation(
  text: string,
  dim: number,
  numHeads: number,
  numBlocks: number,
  maxTokens = 8,
): string[] {
  const generated: string[] = []
  const used = new Set<string>()
  const usedKinds = new Set<string>()
  let current = text
  let prev: string | null = null

  for (let i = 0; i < maxTokens; i++) {
    const step = runSimulation(current, dim, numHeads, numBlocks)
    const adjusted = step.vocab.map(
      (v) => v.logit * 0.6 + decodeBias(v.word, prev, i, maxTokens, used, usedKinds),
    )
    const probs = softmaxRow(adjusted)

    // Amostragem determinística (seed derivada do texto atual)
    const rng = makeRng(`gen|${current}|d${dim}`)
    const r = rng()
    let acc = 0
    let idx = probs.indexOf(Math.max(...probs))
    for (let j = 0; j < probs.length; j++) {
      acc += probs[j]
      if (r <= acc) { idx = j; break }
    }

    const next = VOCAB_WORDS[idx]
    generated.push(next)
    if (WORD_KIND[next] === 'fim') break
    used.add(next)
    usedKinds.add(WORD_KIND[next])
    prev = next
    current = `${current} ${next}`
  }
  return generated
}
