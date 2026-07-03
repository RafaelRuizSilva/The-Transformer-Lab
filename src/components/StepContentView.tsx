import { Layers } from 'lucide-react'
import type { SimulationResult } from '../lib/simulation'
import { STEPS } from '../lib/steps'
import AddNormView from './AddNormView'
import AttentionView from './AttentionView'
import EmbeddingsView from './EmbeddingsView'
import FeedForwardView from './FeedForwardView'
import FinalResultView from './FinalResultView'
import InputView from './InputView'
import LogitsView from './LogitsView'
import MultiHeadView from './MultiHeadView'
import OutputProbabilities from './OutputProbabilities'
import PositionalEncodingView from './PositionalEncodingView'
import QKVView from './QKVView'
import SoftmaxView from './SoftmaxView'
import TokenizationView from './TokenizationView'
import WeightedValuesView from './WeightedValuesView'

interface Props {
  sim: SimulationResult
  stepIndex: number
  selectedToken: number | null
  onSelectToken: (i: number | null) => void
  selectedBlock: number
  onSelectBlock: (b: number) => void
  animationsEnabled: boolean
  showFormulas: boolean
}

export default function StepContentView({
  sim,
  stepIndex,
  selectedToken,
  onSelectToken,
  selectedBlock,
  onSelectBlock,
  animationsEnabled,
  showFormulas,
}: Props) {
  const blockIdx = Math.min(selectedBlock, sim.blocks.length - 1)
  const block = sim.blocks[blockIdx]
  const stepId = STEPS[stepIndex]?.id

  const blockSelector = sim.numBlocks > 1 && (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
      <Layers size={14} />
      <span>Bloco em detalhe:</span>
      {sim.blocks.map((_, b) => (
        <button
          key={b}
          onClick={() => onSelectBlock(b)}
          className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
            blockIdx === b
              ? 'bg-indigo-500 text-white'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Bloco {b + 1}
        </button>
      ))}
    </div>
  )

  switch (stepId) {
    case 'input':
      return <InputView sim={sim} />
    case 'tokenization':
      return (
        <TokenizationView
          sim={sim}
          selectedToken={selectedToken}
          onSelectToken={onSelectToken}
        />
      )
    case 'embeddings':
      return (
        <EmbeddingsView
          sim={sim}
          selectedToken={selectedToken}
          onSelectToken={onSelectToken}
        />
      )
    case 'positional':
      return (
        <PositionalEncodingView
          sim={sim}
          selectedToken={selectedToken}
          animationsEnabled={animationsEnabled}
        />
      )
    case 'qkv':
      return (
        <>
          {blockSelector}
          <QKVView
            sim={sim}
            block={block}
            selectedToken={selectedToken}
            onSelectToken={onSelectToken}
          />
        </>
      )
    case 'attention':
      return (
        <>
          {blockSelector}
          <AttentionView
            sim={sim}
            block={block}
            animationsEnabled={animationsEnabled}
            showFormulas={showFormulas}
          />
        </>
      )
    case 'softmax':
      return (
        <>
          {blockSelector}
          <SoftmaxView
            sim={sim}
            block={block}
            selectedToken={selectedToken}
            onSelectToken={onSelectToken}
            animationsEnabled={animationsEnabled}
          />
        </>
      )
    case 'weighted':
      return (
        <>
          {blockSelector}
          <WeightedValuesView
            sim={sim}
            block={block}
            selectedToken={selectedToken}
            animationsEnabled={animationsEnabled}
          />
        </>
      )
    case 'multihead':
      return (
        <>
          {blockSelector}
          <MultiHeadView sim={sim} block={block} />
        </>
      )
    case 'addnorm1':
      return (
        <>
          {blockSelector}
          <AddNormView
            sim={sim}
            input={block.input}
            layerOutput={block.weightedOutput}
            sum={block.addNorm1Sum}
            normalized={block.addNorm1}
            layerName="atenção"
            selectedToken={selectedToken}
            animationsEnabled={animationsEnabled}
          />
        </>
      )
    case 'ffn':
      return (
        <>
          {blockSelector}
          <FeedForwardView
            sim={sim}
            block={block}
            selectedToken={selectedToken}
            onSelectToken={onSelectToken}
            animationsEnabled={animationsEnabled}
            showFormulas={showFormulas}
          />
        </>
      )
    case 'addnorm2':
      return (
        <>
          {blockSelector}
          <AddNormView
            sim={sim}
            input={block.addNorm1}
            layerOutput={block.ffnOutput}
            sum={block.addNorm2Sum}
            normalized={block.addNorm2}
            layerName="FFN"
            selectedToken={selectedToken}
            animationsEnabled={animationsEnabled}
          />
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Blocos empilhados ({sim.numBlocks})
            </p>
            <div className="flex gap-2">
              {sim.blocks.map((_, b) => (
                <button
                  key={b}
                  onClick={() => onSelectBlock(b)}
                  className={`rounded-xl border px-4 py-3 text-xs font-semibold transition-all ${
                    blockIdx === b
                      ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-200 scale-105'
                      : 'border-white/10 bg-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  Bloco {b + 1}
                </button>
              ))}
            </div>
            <p className="max-w-md text-center text-xs text-slate-500">
              A saída de cada bloco alimenta o próximo. Um GPT real empilha dezenas
              de blocos idênticos a este.
            </p>
          </div>
        </>
      )
    case 'logits':
      return <LogitsView sim={sim} />
    case 'probs':
      return <OutputProbabilities sim={sim} />
    case 'output':
      return <FinalResultView sim={sim} animationsEnabled={animationsEnabled} />
    default:
      return null
  }
}
