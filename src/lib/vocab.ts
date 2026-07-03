// =============================================================
// Vocabulário simulado (~1000 tokens) com categoria gramatical.
// Assim como num LLM real, o vocabulário é fixo e fechado — o
// modelo só pode "prever" tokens desta lista. As categorias
// alimentam o viés de encadeamento da decodificação (simulando as
// preferências que um modelo treinado aprenderia dos dados).
// Inclui tokens dinâmicos com o dia atual (dia da semana e data).
// =============================================================

export type WordKind =
  | 'tempo'
  | 'adjetivo'
  | 'intensificador'
  | 'conjuncao'
  | 'adverbial'
  | 'fim'

// --- Tokens dinâmicos com a data de hoje ---
const now = new Date()
const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now)
const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(now)
const TODAY_TOKENS = [
  weekday.endsWith('-feira') ? `nesta ${weekday}` : `neste ${weekday}`,
  `no dia ${now.getDate()} de ${month}`,
]

const TEMPO = [
  ...TODAY_TOKENS,
  'hoje', 'ontem', 'amanhã', 'anteontem', 'agora', 'cedo', 'tarde', 'depois',
  'antes', 'logo', 'ainda', 'já', 'sempre', 'nunca', 'raramente',
  'frequentemente', 'diariamente', 'novamente', 'outra vez', 'de novo',
  'mais tarde', 'mais cedo', 'em breve', 'de repente', 'às vezes',
  'de manhã', 'de tarde', 'à noite', 'de madrugada', 'ao meio-dia',
  'ao amanhecer', 'ao entardecer', 'ao anoitecer', 'aos domingos',
  'aos sábados', 'todos os dias', 'toda semana', 'todo mês', 'todo ano',
  'na segunda-feira', 'na terça-feira', 'na quarta-feira', 'na quinta-feira',
  'na sexta-feira', 'no sábado', 'no domingo', 'no fim de semana',
  'no feriado', 'nas férias', 'no verão', 'no outono', 'no inverno',
  'na primavera', 'em janeiro', 'em fevereiro', 'em março', 'em abril',
  'em maio', 'em junho', 'em julho', 'em agosto', 'em setembro',
  'em outubro', 'em novembro', 'em dezembro',
]

const ADJETIVOS = [
  'feliz', 'tranquilo', 'calmo', 'sereno', 'alegre', 'contente', 'animado',
  'empolgado', 'satisfeito', 'radiante', 'sorridente', 'bem-humorado',
  'cansado', 'sonolento', 'exausto', 'relaxado', 'descansado', 'preguiçoso',
  'quieto', 'silencioso', 'pensativo', 'distraído', 'curioso', 'atento',
  'concentrado', 'esperançoso', 'otimista', 'confiante', 'corajoso',
  'valente', 'gentil', 'generoso', 'amável', 'carinhoso', 'educado',
  'simpático', 'agradável', 'encantador', 'elegante', 'charmoso', 'bonito',
  'belo', 'lindo', 'formoso', 'radioso', 'luminoso', 'brilhante', 'esperto',
  'inteligente', 'sábio', 'criativo', 'talentoso', 'dedicado', 'esforçado',
  'trabalhador', 'organizado', 'cuidadoso', 'prudente', 'paciente',
  'persistente', 'determinado', 'focado', 'disciplinado', 'leal', 'sincero',
  'honesto', 'justo', 'humilde', 'modesto', 'discreto', 'reservado',
  'tímido', 'sonhador', 'romântico', 'apaixonado', 'saudoso', 'nostálgico',
  'emocionado', 'comovido', 'grato', 'agradecido', 'orgulhoso', 'realizado',
  'pleno', 'completo', 'leve', 'livre', 'solto', 'descontraído',
  'despreocupado', 'inspirado', 'motivado', 'energizado', 'revigorado',
  'renovado', 'fortalecido', 'saudável', 'forte', 'ágil', 'veloz', 'rápido',
  'lento', 'faminto', 'esfomeado', 'sedento', 'aconchegado', 'agasalhado',
  'aquecido', 'refrescado', 'molhado', 'seco', 'limpo', 'arrumado',
  'perfumado', 'abraçado', 'acompanhado', 'sozinho', 'protegido', 'seguro',
]

const INTENSIFICADORES = [
  'muito', 'bem', 'tão', 'bastante', 'super', 'extremamente', 'realmente',
  'incrivelmente', 'verdadeiramente', 'um pouco',
]

const CONJUNCOES = [
  'e', 'mas', 'porque', 'quando', 'enquanto', 'embora', 'pois', 'então',
  'portanto', 'ou', 'também', 'além disso',
]

// --- Locuções adverbiais de lugar, geradas combinatoriamente ---
const SUBSTANTIVOS_MASC = [
  'parque', 'jardim', 'quintal', 'sofá', 'quarto', 'escritório', 'mercado',
  'shopping', 'cinema', 'teatro', 'museu', 'restaurante', 'bar', 'hospital',
  'aeroporto', 'campo', 'sítio', 'rio', 'lago', 'mar', 'bosque', 'estádio',
  'ginásio', 'clube', 'hotel', 'corredor', 'porão', 'sótão', 'terraço',
  'banco', 'colégio', 'consultório', 'laboratório', 'estúdio', 'palco',
  'salão', 'pátio', 'refeitório', 'dormitório', 'alojamento', 'condomínio',
  'prédio', 'edifício', 'apartamento', 'chalé', 'castelo', 'farol', 'porto',
  'cais', 'mirante', 'deserto', 'vale', 'penhasco', 'pomar', 'celeiro',
  'estábulo', 'galpão', 'armazém', 'viveiro', 'jardim de inverno',
]

const SUBSTANTIVOS_FEM = [
  'praia', 'escola', 'cidade', 'casa', 'rua', 'praça', 'floresta',
  'montanha', 'fazenda', 'biblioteca', 'cozinha', 'sala', 'varanda',
  'piscina', 'igreja', 'feira', 'loja', 'padaria', 'farmácia', 'estação',
  'esquina', 'avenida', 'ilha', 'cachoeira', 'lagoa', 'chácara', 'horta',
  'plantação', 'vila', 'aldeia', 'capital', 'universidade', 'faculdade',
  'academia', 'quadra', 'arena', 'livraria', 'papelaria', 'sorveteria',
  'pizzaria', 'lanchonete', 'cafeteria', 'banca', 'barraca', 'tenda',
  'garagem', 'oficina', 'fábrica', 'empresa', 'clínica', 'delegacia',
  'prefeitura', 'rodoviária', 'estrada', 'trilha', 'colina', 'serra',
  'gruta', 'caverna', 'ponte',
]

const PREPS_MASC = ['no', 'perto do', 'longe do', 'dentro do', 'atrás do', 'ao lado do', 'em frente ao']
const PREPS_FEM = ['na', 'perto da', 'longe da', 'dentro da', 'atrás da', 'ao lado da', 'em frente à']

const LUGARES = [
  ...SUBSTANTIVOS_MASC.flatMap((s) => PREPS_MASC.map((p) => `${p} ${s}`)),
  ...SUBSTANTIVOS_FEM.flatMap((s) => PREPS_FEM.map((p) => `${p} ${s}`)),
]

const MODOS = [
  'com calma', 'com carinho', 'com alegria', 'com cuidado', 'com entusiasmo',
  'com paixão', 'com dedicação', 'com paciência', 'com coragem',
  'com gratidão', 'com serenidade', 'com ternura', 'com leveza',
  'com vontade', 'com prazer', 'com gosto', 'sem pressa', 'sem medo',
  'sem preocupação', 'em paz', 'em silêncio', 'em harmonia', 'devagar',
  'depressa', 'rapidamente', 'lentamente', 'calmamente', 'tranquilamente',
  'alegremente', 'suavemente', 'docemente', 'profundamente', 'intensamente',
  'completamente', 'finalmente',
]

const FIM = ['.', '!', '…']

// --- Montagem final: lista única + mapa palavra → categoria ---
const KIND_LISTS: [WordKind, string[]][] = [
  ['tempo', TEMPO],
  ['adjetivo', ADJETIVOS],
  ['intensificador', INTENSIFICADORES],
  ['conjuncao', CONJUNCOES],
  ['adverbial', [...LUGARES, ...MODOS]],
  ['fim', FIM],
]

export const WORD_KIND: Record<string, WordKind> = {}
export const VOCAB_WORDS: string[] = []

for (const [kind, words] of KIND_LISTS) {
  for (const word of words) {
    if (!(word in WORD_KIND)) {
      WORD_KIND[word] = kind
      VOCAB_WORDS.push(word)
    }
  }
}

// Tamanho de cada categoria — usado na decodificação para que as
// categorias compitam em pé de igualdade (senão a maior domina o softmax)
export const KIND_COUNT = VOCAB_WORDS.reduce(
  (acc, w) => {
    acc[WORD_KIND[w]]++
    return acc
  },
  { tempo: 0, adjetivo: 0, intensificador: 0, conjuncao: 0, adverbial: 0, fim: 0 } as Record<WordKind, number>,
)
