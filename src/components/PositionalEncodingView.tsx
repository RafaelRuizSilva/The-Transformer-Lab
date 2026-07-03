import { Plus, Equal } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SimulationResult } from '../lib/simulation'
import { TOKEN_COLORS } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'

interface Props {
  sim: SimulationResult
  selectedToken: number | null
  animationsEnabled: boolean
}

export default function PositionalEncodingView({
  sim,
  selectedToken,
  animationsEnabled,
}: Props) {
  const dimLabels = Array.from({ length: sim.dim }, (_, i) => `d${i}`)
  const tokenLabels = sim.tokens.map((t) => t.text)

  const lineData = sim.positional.map((row, pos) => {
    const point: Record<string, number> = { pos }
    row.forEach((v, d) => {
      if (d < 4) point[`d${d}`] = v
    })
    return point
  })

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
        <div className={animationsEnabled ? 'combine-pulse' : ''}>
          <MatrixHeatmap
            matrix={sim.embeddings}
            rowLabels={tokenLabels}
            colLabels={dimLabels}
            title="Embeddings"
            color="purple"
            highlightRow={selectedToken}
            cellSize="sm"
          />
        </div>
        <Plus className="mt-8 shrink-0 text-slate-400" size={24} />
        <div
          className={animationsEnabled ? 'combine-pulse' : ''}
          style={{ animationDelay: '0.8s' }}
        >
          <MatrixHeatmap
            matrix={sim.positional}
            rowLabels={tokenLabels}
            colLabels={dimLabels}
            title="Positional Encoding"
            color="blue"
            highlightRow={selectedToken}
            cellSize="sm"
          />
        </div>
        <Equal className="mt-8 shrink-0 text-slate-400" size={24} />
        <MatrixHeatmap
          matrix={sim.embeddingsWithPosition}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title="Embeddings + Posição"
          color="green"
          highlightRow={selectedToken}
          cellSize="sm"
        />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-1 text-xs font-semibold text-slate-300">
          Valores posicionais por posição (4 primeiras dimensões)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="pos"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              label={{ value: 'posição', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[-1.1, 1.1]} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {[0, 1, 2, 3].slice(0, Math.min(4, sim.dim)).map((d) => (
              <Line
                key={d}
                type="monotone"
                dataKey={`d${d}`}
                stroke={TOKEN_COLORS[d]}
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={animationsEnabled}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
