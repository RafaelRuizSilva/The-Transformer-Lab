import { useState } from 'react'
import type { BlockResult, SimulationResult } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'
import VectorChart from './VectorChart'

interface Props {
  sim: SimulationResult
  block: BlockResult
}

const HEAD_COLORS: Array<'blue' | 'pink' | 'green' | 'amber'> = [
  'blue', 'pink', 'green', 'amber',
]
const HEAD_HEX = ['#38bdf8', '#f472b6', '#4ade80', '#fbbf24']

export default function MultiHeadView({ sim, block }: Props) {
  const [selectedHead, setSelectedHead] = useState(0)
  const tokenLabels = sim.tokens.map((t) => t.text)
  const head = block.heads[selectedHead]

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {block.heads.map((h, i) => (
          <button
            key={i}
            onClick={() => setSelectedHead(i)}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
              selectedHead === i
                ? 'scale-105 border-white/50 bg-white/10 text-white shadow-lg'
                : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
            style={selectedHead === i ? { borderColor: HEAD_HEX[i % 4] } : undefined}
          >
            <span style={{ color: HEAD_HEX[i % 4] }}>Cabeça {i + 1}</span>
            <span className="ml-1.5 text-slate-400">{h.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {block.heads.map((h, i) => (
          <button
            key={i}
            onClick={() => setSelectedHead(i)}
            className={`card flex flex-col items-center gap-2 p-3 transition-all ${
              selectedHead === i ? 'ring-2 ring-white/40' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <span className="text-xs font-bold" style={{ color: HEAD_HEX[i % 4] }}>
              {i + 1}. {h.name}
            </span>
            <div className="overflow-x-auto">
              <MatrixHeatmap
                matrix={h.softmax}
                color={HEAD_COLORS[i % 4]}
                cellSize="sm"
              />
            </div>
          </button>
        ))}
      </div>

      <div className="card mx-auto w-full max-w-2xl p-4">
        <p className="mb-2 text-sm font-semibold" style={{ color: HEAD_HEX[selectedHead % 4] }}>
          Cabeça {selectedHead + 1} — {head.name}
        </p>
        <p className="mb-3 text-xs text-slate-400">{head.description}</p>
        <div className="flex justify-center overflow-x-auto">
          <MatrixHeatmap
            matrix={head.softmax}
            rowLabels={tokenLabels}
            colLabels={tokenLabels}
            title="Pesos de atenção desta cabeça"
            color={HEAD_COLORS[selectedHead % 4]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          <VectorChart
            vector={block.heads.map((h) => h.intensity)}
            labels={block.heads.map((_, i) => `Cabeça ${i + 1}`)}
            color="#a78bfa"
            title="Intensidade de foco por cabeça (pico médio de atenção)"
          />
        </div>
        <div className="mx-auto overflow-x-auto">
          <MatrixHeatmap
            matrix={block.concatHeads}
            rowLabels={tokenLabels}
            title={`Resultado concatenado (${block.heads.length} cabeças lado a lado)`}
            color="purple"
            cellSize="sm"
          />
        </div>
      </div>
    </div>
  )
}
