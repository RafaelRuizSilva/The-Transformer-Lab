import { X, Equal } from 'lucide-react'
import type { BlockResult, SimulationResult } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'

interface Props {
  sim: SimulationResult
  block: BlockResult
  selectedToken: number | null
  animationsEnabled: boolean
}

export default function WeightedValuesView({
  sim,
  block,
  selectedToken,
  animationsEnabled,
}: Props) {
  const tokenLabels = sim.tokens.map((t) => t.text)
  const dimLabels = Array.from({ length: sim.dim }, (_, i) => `d${i}`)

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:items-start lg:gap-4">
        <div className={animationsEnabled ? 'combine-pulse' : ''}>
          <MatrixHeatmap
            matrix={block.attnWeights}
            rowLabels={tokenLabels}
            colLabels={tokenLabels}
            title="Pesos de atenção (softmax)"
            color="green"
            cellSize="sm"
            highlightRow={selectedToken}
          />
        </div>
        <X className="mt-8 shrink-0 text-slate-400" size={22} />
        <div
          className={animationsEnabled ? 'combine-pulse' : ''}
          style={{ animationDelay: '0.8s' }}
        >
          <MatrixHeatmap
            matrix={block.V}
            rowLabels={tokenLabels}
            colLabels={dimLabels}
            title="Matriz V (values)"
            color="green"
            cellSize="sm"
          />
        </div>
        <Equal className="mt-8 shrink-0 text-slate-400" size={22} />
        <MatrixHeatmap
          matrix={block.weightedOutput}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title="Saída da atenção"
          color="amber"
          cellSize="sm"
          highlightRow={selectedToken}
        />
      </div>

      <p className="mx-auto max-w-2xl text-center text-sm text-slate-400">
        Cada linha da saída é uma <b className="text-white">média ponderada dos Values</b>:
        o token novo mistura a informação de todos os tokens, na proporção dos pesos de
        atenção. {selectedToken !== null && (
          <>
            A linha destacada mostra como{' '}
            <span style={{ color: sim.tokens[selectedToken].color }}>
              “{sim.tokens[selectedToken].text}”
            </span>{' '}
            absorveu contexto dos demais.
          </>
        )}
      </p>
    </div>
  )
}
