# 🧠 Transformer Visual Lab

**Aprenda visualmente como um Transformer funciona — passo a passo, camada por camada.**

Digite uma frase e acompanhe-a atravessando as 15 etapas de um bloco Transformer: da tokenização até a previsão do próximo token, com todos os números calculados de verdade no seu navegador.

🚀 **Demo ao vivo:** [the-transformer-lab.vercel.app](https://the-transformer-lab.vercel.app)

---

## ✨ O que você vai ver

| Etapas | Conteúdo |
|---|---|
| 1–2 | Texto de entrada e **tokenization** (cada token com seu ID) |
| 3–4 | **Embeddings** e **positional encoding** (seno/cosseno, como no paper original) |
| 5–8 | **Query, Key e Value**, attention scores, **softmax** e weighted values |
| 9 | **Multi-head attention** — 4 cabeças com padrões diferentes (proximidade, semântica, ordem, contexto global) |
| 10–12 | **Residual connections**, **Layer Normalization** e **Feed Forward Network** neurônio por neurônio |
| 13–15 | **Logits**, probabilidades e **geração autorregressiva** — o modelo "escreve" uma resposta token por token |

Tudo é interativo: clique em qualquer célula de um heatmap para ver o cálculo que gerou aquele número, selecione um token para acompanhá-lo pelas etapas, compare duas etapas lado a lado e visualize a arquitetura completa.

## 🎮 Como usar

1. Digite um texto de até 100 caracteres
2. Clique em **"Executar Transformer"**
3. Navegue pelas etapas — com os botões, com as setas do teclado (`←` `→`) ou com a reprodução automática (`espaço` pausa/retoma)
4. Na etapa 15, veja a resposta gerada palavra por palavra

## ⚙️ Como funciona por dentro

**As contas são reais, mas os pesos são simulados.** A mecânica é fiel à arquitetura do paper *"Attention Is All You Need"* (Vaswani et al., 2017):

- ✅ Multiplicações de matrizes, softmax, LayerNorm, ReLU e conexões residuais executadas de verdade, elemento por elemento
- ✅ Positional encoding com as fórmulas exatas de seno/cosseno do paper
- ✅ Decodificação com técnicas reais de LLMs: amostragem, penalidade de repetição e comprimento mínimo
- ⚠️ Os pesos **não são treinados** — são gerados deterministicamente a partir do texto (a mesma frase sempre produz os mesmos números)
- ⚠️ Escala didática: dimensão 4–12 (real: milhares), vocabulário de ~1000 palavras (real: ~100 mil tokens), 1–4 blocos (real: dezenas)

O objetivo é o **aprendizado visual do mecanismo**, não a precisão do resultado.

## 🛠️ Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (build e dev server)
- [Tailwind CSS](https://tailwindcss.com) (estilo)
- [Recharts](https://recharts.org) (gráficos)
- [Lucide](https://lucide.dev) (ícones)
- Zero backend — toda a simulação roda no navegador

## 🏃 Rodando localmente

```bash
git clone https://github.com/RafaelRuizSilva/The-Transformer-Lab.git
cd The-Transformer-Lab
npm install
npm run dev       # http://localhost:5173
```

Outros comandos:

```bash
npm run build     # build de produção (dist/)
npm run preview   # serve o build localmente
npm run lint      # oxlint
```

## 📁 Estrutura

```
src/
├── lib/
│   ├── simulation.ts   # motor: álgebra de matrizes, atenção, FFN, decodificação
│   ├── vocab.ts        # vocabulário simulado (~1000 tokens categorizados)
│   └── steps.ts        # conteúdo educacional das 15 etapas
└── components/         # uma view por etapa + heatmaps, gráficos e pipeline
```

## 🤝 Créditos

Projeto de estudo da arquitetura Transformer, construído em parceria com o **Claude Fable 5** (Anthropic).

Baseado no paper [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762) (Vaswani et al., 2017).

---

⚠️ *Simulação educacional simplificada — os valores são gerados deterministicamente no navegador e não vêm de um modelo real.*
