export interface GlossaryEntry {
  term: string
  definition: string
}

export interface StepContent {
  id: string
  label: string
  title: string
  simple: string
  technical: string
  why: string
  example: string
  formula?: string
  glossary: GlossaryEntry[]
}

export const STEPS: StepContent[] = [
  {
    id: 'input',
    label: 'Entrada',
    title: '1. Texto de entrada',
    simple:
      'O Transformer recebe uma sequência de texto como entrada. É a partir dela que tudo começa.',
    technical:
      'A sequência de entrada é uma string de caracteres que será convertida em uma sequência de tokens discretos antes de qualquer processamento numérico.',
    why:
      'Modelos de linguagem só trabalham com números. O texto precisa passar por várias transformações até virar algo que a rede consiga processar.',
    example:
      'Você digita "O gato dormiu no sofá" e o modelo vai tentar prever qual palavra viria a seguir.',
    glossary: [
      { term: 'Sequência', definition: 'Uma lista ordenada de elementos — aqui, as palavras do texto.' },
      { term: 'Transformer', definition: 'Arquitetura de rede neural baseada em atenção, criada em 2017 no artigo "Attention Is All You Need".' },
    ],
  },
  {
    id: 'tokenization',
    label: 'Tokens',
    title: '2. Tokenização',
    simple:
      'O texto é dividido em unidades chamadas tokens. Cada token recebe um número (ID) que o identifica.',
    technical:
      'A tokenização mapeia a string para uma sequência de IDs inteiros usando um vocabulário. Modelos reais usam subpalavras (BPE, WordPiece); aqui usamos palavras inteiras para simplificar.',
    why:
      'A rede neural não entende letras — ela precisa de números discretos que apontem para representações aprendidas.',
    example:
      '"O gato dormiu" vira três tokens: [O → 412] [gato → 87] [dormiu → 653].',
    glossary: [
      { term: 'Token', definition: 'Unidade mínima de texto processada pelo modelo (palavra, subpalavra ou símbolo).' },
      { term: 'ID do token', definition: 'Número inteiro único que identifica cada token no vocabulário.' },
      { term: 'Vocabulário', definition: 'Conjunto de todos os tokens que o modelo conhece.' },
    ],
  },
  {
    id: 'embeddings',
    label: 'Embeddings',
    title: '3. Token Embeddings',
    simple:
      'O embedding transforma cada token em uma lista de números que representa características aprendidas.',
    technical:
      'Cada ID é usado para buscar um vetor denso em uma matriz de embedding treinada. Tokens com significados parecidos tendem a ter vetores próximos no espaço vetorial.',
    why:
      'Números isolados (IDs) não carregam significado. Vetores densos permitem que o modelo capture relações semânticas entre palavras.',
    example:
      '"gato" e "cachorro" teriam vetores parecidos; "gato" e "sofá" seriam mais distantes.',
    formula: 'E = EmbeddingMatrix[token_id]   →   vetor de dimensão d',
    glossary: [
      { term: 'Embedding', definition: 'Vetor denso de números reais que representa um token.' },
      { term: 'Dimensão (d)', definition: 'Quantidade de números em cada vetor. Aqui simulamos d pequeno; GPTs reais usam milhares.' },
      { term: 'Vetor denso', definition: 'Lista de números reais onde cada posição contribui com informação.' },
    ],
  },
  {
    id: 'positional',
    label: 'Posição',
    title: '4. Positional Encoding',
    simple:
      'Como o Transformer processa todos os tokens ao mesmo tempo, adicionamos informações sobre a posição de cada token.',
    technical:
      'Funções seno e cosseno de frequências diferentes geram um vetor único por posição, que é somado ao embedding. Assim a mesma palavra em posições diferentes tem representações diferentes.',
    why:
      'Sem isso, "o gato mordeu o cão" e "o cão mordeu o gato" seriam idênticos para o modelo — a atenção não tem noção de ordem.',
    example:
      'O token na posição 0 recebe um "carimbo" numérico diferente do token na posição 3.',
    formula: 'PE(pos, 2i) = sin(pos / 10000^(2i/d))\nPE(pos, 2i+1) = cos(pos / 10000^(2i/d))',
    glossary: [
      { term: 'Positional Encoding', definition: 'Vetor que codifica a posição do token na sequência.' },
      { term: 'Seno/Cosseno', definition: 'Funções periódicas que geram padrões únicos e suaves para cada posição.' },
    ],
  },
  {
    id: 'qkv',
    label: 'Q · K · V',
    title: '5. Criação de Q, K e V',
    simple:
      'Cada token gera três versões de si mesmo: Query (o que ele procura), Key (o que ele oferece) e Value (a informação que ele carrega).',
    technical:
      'Três matrizes de pesos treinadas (Wq, Wk, Wv) multiplicam a entrada X, projetando cada token em três espaços diferentes: Q = XWq, K = XWk, V = XWv.',
    why:
      'Separar "o que procuro" de "o que ofereço" permite que a atenção compare tokens de forma assimétrica e flexível.',
    example:
      'O token "dormiu" pode ter uma Query buscando "quem dormiu?", e a Key de "gato" responde "eu sou um sujeito!".',
    formula: 'Q = X · Wq     K = X · Wk     V = X · Wv',
    glossary: [
      { term: 'Query (Q)', definition: 'O que o token procura nos outros tokens.' },
      { term: 'Key (K)', definition: 'O que o token oferece para ser encontrado.' },
      { term: 'Value (V)', definition: 'A informação que o token transporta para quem prestar atenção nele.' },
      { term: 'Matriz de pesos', definition: 'Números aprendidos no treinamento que transformam os vetores.' },
    ],
  },
  {
    id: 'attention',
    label: 'Scores',
    title: '6. Attention Scores',
    simple:
      'Cada token compara sua Query com a Key dos outros tokens para descobrir quais palavras são mais importantes para ele.',
    technical:
      'O produto escalar Q·Kᵀ mede a similaridade entre cada par de tokens. A divisão por √d evita que os valores cresçam demais e saturem o softmax.',
    why:
      'É assim que o modelo descobre relações: quais palavras devem "conversar" entre si para entender o contexto.',
    example:
      'Na frase "O gato dormiu", a Query de "dormiu" combina fortemente com a Key de "gato" — score alto entre eles.',
    formula: 'Scores = (Q · Kᵀ) / √d',
    glossary: [
      { term: 'Produto escalar', definition: 'Soma dos produtos elemento a elemento de dois vetores; mede similaridade.' },
      { term: '√d (escala)', definition: 'Fator que estabiliza os valores para dimensões maiores.' },
      { term: 'Score', definition: 'Número que indica o quanto um token é relevante para outro.' },
    ],
  },
  {
    id: 'softmax',
    label: 'Softmax',
    title: '7. Softmax',
    simple:
      'O Softmax transforma os scores em porcentagens de atenção. Cada linha passa a somar exatamente 1 (100%).',
    technical:
      'Softmax exponencia cada score e normaliza pela soma da linha: valores altos dominam, valores baixos praticamente zeram. O resultado é uma distribuição de probabilidade por token.',
    why:
      'Scores brutos podem ser qualquer número. Transformá-los em pesos entre 0 e 1 permite combinar informações de forma controlada.',
    example:
      '"dormiu" pode dar 70% de atenção a "gato", 20% a "O" e 10% a si mesmo.',
    formula: 'softmax(xᵢ) = e^xᵢ / Σⱼ e^xⱼ',
    glossary: [
      { term: 'Softmax', definition: 'Função que converte números em probabilidades que somam 1.' },
      { term: 'Distribuição de atenção', definition: 'Como um token divide seus 100% de atenção entre os demais.' },
    ],
  },
  {
    id: 'weighted',
    label: 'Valores',
    title: '8. Weighted Values',
    simple:
      'O Transformer combina as informações dos outros tokens usando os pesos de atenção — como uma média ponderada.',
    technical:
      'A matriz de pesos de atenção multiplica V: cada token novo é a soma dos Values de todos os tokens, ponderada pela atenção. Output = Softmax(Scores) · V.',
    why:
      'É aqui que a informação realmente flui entre as palavras: cada token absorve contexto dos tokens relevantes.',
    example:
      'O novo vetor de "dormiu" contém 70% da informação de "gato" — agora ele "sabe" quem dormiu.',
    formula: 'Attention Output = Softmax(Q·Kᵀ/√d) · V',
    glossary: [
      { term: 'Média ponderada', definition: 'Soma onde cada elemento contribui proporcionalmente ao seu peso.' },
      { term: 'Contexto', definition: 'Informação das outras palavras incorporada ao token.' },
    ],
  },
  {
    id: 'multihead',
    label: 'Multi-Head',
    title: '9. Multi-Head Attention',
    simple:
      'Cada cabeça pode aprender um tipo diferente de relação entre as palavras: proximidade, semântica, ordem, contexto global...',
    technical:
      'A atenção é executada h vezes em paralelo com projeções diferentes (dimensão d/h cada). Os resultados são concatenados e projetados de volta para a dimensão original.',
    why:
      'Uma única atenção captura um único padrão. Várias cabeças permitem observar a frase por várias "lentes" ao mesmo tempo.',
    example:
      'A cabeça 1 conecta palavras vizinhas; a cabeça 2 liga "gato" a "dormiu" pelo significado.',
    formula: 'MultiHead = Concat(head₁, ..., headₕ) · Wo',
    glossary: [
      { term: 'Cabeça de atenção', definition: 'Uma instância independente do mecanismo de atenção.' },
      { term: 'Concatenação', definition: 'Juntar os vetores de todas as cabeças lado a lado.' },
    ],
  },
  {
    id: 'addnorm1',
    label: 'Add & Norm',
    title: '10. Add & Layer Normalization',
    simple:
      'A conexão residual preserva informações anteriores. A normalização mantém os valores equilibrados.',
    technical:
      'A entrada da camada é somada à saída da atenção (residual), e a LayerNorm re-centraliza cada vetor para média 0 e desvio 1, estabilizando o treinamento de redes profundas.',
    why:
      'Sem residual, redes profundas "esquecem" a entrada original e o gradiente se perde. Sem normalização, os valores explodem ou desaparecem.',
    example:
      'É como revisar um texto: você adiciona correções (atenção) sem apagar o original (residual).',
    formula: 'saída = LayerNorm(x + Atenção(x))',
    glossary: [
      { term: 'Conexão residual', definition: 'Atalho que soma a entrada original à saída da camada.' },
      { term: 'LayerNorm', definition: 'Normaliza cada vetor para média 0 e desvio padrão 1.' },
    ],
  },
  {
    id: 'ffn',
    label: 'Feed Forward',
    title: '11. Feed Forward Network',
    simple:
      'A rede Feed Forward analisa cada token individualmente e transforma suas características.',
    technical:
      'Duas camadas lineares com ativação não-linear no meio: FFN(x) = W₂ · ReLU(W₁·x). A camada oculta costuma ser 4× maior que d, expandindo e comprimindo a representação.',
    why:
      'A atenção mistura informação entre tokens; a FFN processa cada token em profundidade, detectando padrões complexos.',
    example:
      'Depois de saber que "gato" é o sujeito, a FFN pode refinar: "sujeito animado, singular, agente da ação".',
    formula: 'FFN(x) = W₂ · ReLU(W₁ · x)',
    glossary: [
      { term: 'ReLU', definition: 'Ativação que zera valores negativos: max(0, x). Cria não-linearidade.' },
      { term: 'Camada linear', definition: 'Multiplicação por uma matriz de pesos aprendida.' },
      { term: 'Não-linearidade', definition: 'Permite à rede aprender padrões que uma simples soma não captura.' },
    ],
  },
  {
    id: 'addnorm2',
    label: 'Add & Norm 2',
    title: '12. Segundo Add & Norm',
    simple:
      'Mais uma conexão residual e normalização fecham o bloco. Um Transformer real empilha dezenas de blocos idênticos a este.',
    technical:
      'saída = LayerNorm(x + FFN(x)). O resultado é a saída do bloco Transformer, que serve de entrada para o próximo bloco. GPT-3, por exemplo, empilha 96 blocos.',
    why:
      'Cada bloco refina a representação. Empilhar blocos permite construir entendimento cada vez mais abstrato.',
    example:
      'Bloco 1 entende sintaxe; bloco 2 entende papéis semânticos; blocos seguintes captam nuances.',
    formula: 'saída_bloco = LayerNorm(x + FFN(x))',
    glossary: [
      { term: 'Bloco Transformer', definition: 'A unidade completa: atenção + add&norm + FFN + add&norm.' },
      { term: 'Empilhamento', definition: 'Passar a saída de um bloco como entrada do próximo.' },
    ],
  },
  {
    id: 'logits',
    label: 'Logits',
    title: '13. Logits',
    simple:
      'Os logits são pontuações que indicam quais tokens podem aparecer na saída. Quanto maior o valor, mais provável a palavra.',
    technical:
      'O vetor final do último token é projetado sobre o vocabulário: logits = h · Wᵥᵒᶜᵃᵇᵀ. Cada palavra do vocabulário recebe uma pontuação bruta (pode ser negativa).',
    why:
      'É a ponte entre a representação interna (vetores) e o mundo das palavras: cada palavra candidata ganha uma nota.',
    example:
      'Para "O gato dormiu no sofá ___": "hoje" pode receber 3.2, "cedo" 2.1, e "." 1.8.',
    formula: 'logits = h_último_token · W_vocab',
    glossary: [
      { term: 'Logit', definition: 'Pontuação bruta (não normalizada) de cada palavra candidata.' },
      { term: 'Projeção linear', definition: 'Multiplicação do vetor final pela matriz do vocabulário.' },
    ],
  },
  {
    id: 'probs',
    label: 'Probs',
    title: '14. Probabilidades de saída',
    simple:
      'O modelo converte os logits em probabilidades e seleciona um possível próximo token.',
    technical:
      'Softmax sobre os logits gera a distribuição de probabilidade final. A escolha pode ser gulosa (argmax) ou por amostragem (temperatura, top-k, top-p em modelos reais).',
    why:
      'Probabilidades permitem tanto escolher a palavra mais provável quanto gerar variação por amostragem.',
    example:
      '"hoje" 45%, "cedo" 25%, "." 15%... o modo guloso escolhe "hoje"; a amostragem pode escolher outra.',
    formula: 'P(palavra) = softmax(logits)',
    glossary: [
      { term: 'Argmax (guloso)', definition: 'Escolher sempre a palavra de maior probabilidade.' },
      { term: 'Amostragem', definition: 'Sortear a palavra proporcionalmente às probabilidades.' },
    ],
  },
  {
    id: 'output',
    label: 'Saída',
    title: '15. Resultado final',
    simple:
      'O token previsto é adicionado ao texto. Em um modelo real, o processo se repetiria para gerar a próxima palavra, e a próxima...',
    technical:
      'Geração autorregressiva: o token escolhido entra na sequência e todo o pipeline roda novamente. É assim que LLMs escrevem textos longos, um token por vez.',
    why:
      'Este ciclo — prever, anexar, repetir — é o mecanismo fundamental por trás de todos os chatbots e LLMs modernos.',
    example:
      '"O gato dormiu no sofá" + "hoje" → o modelo rodaria de novo para prever a palavra seguinte.',
    glossary: [
      { term: 'Autorregressivo', definition: 'Cada nova previsão usa as previsões anteriores como entrada.' },
      { term: 'Geração', definition: 'O processo de produzir texto token por token.' },
    ],
  },
]

export const STEP_IDS = STEPS.map((s) => s.id)
