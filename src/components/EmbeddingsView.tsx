import type { SimulationResult } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'
import TokenChip from './TokenChip'
import VectorChart from './VectorChart'

interface Props {
  sim: SimulationResult
  selectedToken: number | null
  onSelectToken: (i: number | null) => void
}

export default function EmbeddingsView({ sim, selectedToken, onSelectToken }: Props) {
  const dimLabels = Array.from({ length: sim.dim }, (_, i) => `d${i}`)
  const tokenLabels = sim.tokens.map((t) => t.text)
  const chartToken = selectedToken ?? 0

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {sim.tokens.map((tok, i) => (
          <TokenChip
            key={i}
            token={tok}
            size="sm"
            selected={selectedToken === i}
            onClick={() => onSelectToken(selectedToken === i ? null : i)}
          />
        ))}
      </div>

      <div className="flex justify-center overflow-x-auto">
        <MatrixHeatmap
          matrix={sim.embeddings}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title={`Matriz de embeddings (${sim.tokens.length} tokens × ${sim.dim} dimensões)`}
          color="purple"
          highlightRow={selectedToken}
        />
      </div>

      <div className="mx-auto w-full max-w-lg">
        <VectorChart
          vector={sim.embeddings[chartToken]}
          color={sim.tokens[chartToken].color}
          title={`Vetor do token “${sim.tokens[chartToken].text}” (posição ${chartToken})`}
          labels={dimLabels}
        />
      </div>
    </div>
  )
}
