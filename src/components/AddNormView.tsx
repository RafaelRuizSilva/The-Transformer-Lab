import { Plus, ArrowRight } from 'lucide-react'
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
import type { SimulationResult, Matrix } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'

interface Props {
  sim: SimulationResult
  input: Matrix
  layerOutput: Matrix
  sum: Matrix
  normalized: Matrix
  layerName: string
  selectedToken: number | null
  animationsEnabled: boolean
}

export default function AddNormView({
  sim,
  input,
  layerOutput,
  sum,
  normalized,
  layerName,
  selectedToken,
  animationsEnabled,
}: Props) {
  const tokenLabels = sim.tokens.map((t) => t.text)
  const dimLabels = Array.from({ length: sim.dim }, (_, i) => `d${i}`)
  const focusToken = selectedToken ?? 0

  const chartData = Array.from({ length: sim.dim }, (_, d) => ({
    dim: `d${d}`,
    'antes (soma)': sum[focusToken][d],
    'depois (norm)': normalized[focusToken][d],
  }))

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:items-start lg:gap-3">
        <MatrixHeatmap
          matrix={input}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title="Entrada da camada (residual)"
          color="purple"
          cellSize="sm"
          highlightRow={selectedToken}
        />
        <Plus className="mt-8 shrink-0 text-violet-400" size={22} />
        <MatrixHeatmap
          matrix={layerOutput}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title={`Saída da ${layerName}`}
          color="amber"
          cellSize="sm"
          highlightRow={selectedToken}
        />
        <ArrowRight className="mt-8 shrink-0 text-slate-400" size={22} />
        <MatrixHeatmap
          matrix={sum}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title="Soma residual"
          color="pink"
          cellSize="sm"
          highlightRow={selectedToken}
        />
        <ArrowRight className="mt-8 shrink-0 text-slate-400" size={22} />
        <MatrixHeatmap
          matrix={normalized}
          rowLabels={tokenLabels}
          colLabels={dimLabels}
          title="Após LayerNorm"
          color="green"
          cellSize="sm"
          highlightRow={selectedToken}
        />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-1 text-xs font-semibold text-slate-300">
          Token “{sim.tokens[focusToken].text}” — valores antes e depois da normalização
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="dim" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="antes (soma)"
              stroke="#f472b6"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={animationsEnabled}
            />
            <Line
              type="monotone"
              dataKey="depois (norm)"
              stroke="#4ade80"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={animationsEnabled}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
