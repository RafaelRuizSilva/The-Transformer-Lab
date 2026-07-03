import { Search, KeyRound, Package } from 'lucide-react'
import type { BlockResult, SimulationResult } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'
import TokenChip from './TokenChip'

interface Props {
  sim: SimulationResult
  block: BlockResult
  selectedToken: number | null
  onSelectToken: (i: number | null) => void
}

const PANELS = [
  {
    key: 'Q' as const,
    icon: Search,
    name: 'Query (Q)',
    desc: 'O que o token procura',
    color: 'blue' as const,
    text: 'text-sky-300',
  },
  {
    key: 'K' as const,
    icon: KeyRound,
    name: 'Key (K)',
    desc: 'O que o token oferece',
    color: 'pink' as const,
    text: 'text-pink-300',
  },
  {
    key: 'V' as const,
    icon: Package,
    name: 'Value (V)',
    desc: 'A informação transportada',
    color: 'green' as const,
    text: 'text-emerald-300',
  },
]

export default function QKVView({ sim, block, selectedToken, onSelectToken }: Props) {
  const dimLabels = Array.from({ length: sim.dim }, (_, i) => `d${i}`)
  const tokenLabels = sim.tokens.map((t) => t.text)

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
      <p className="-mt-3 text-center text-xs text-slate-500">
        Selecione um token para destacar sua linha nas três matrizes
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {PANELS.map((panel) => (
          <div key={panel.key} className="card flex min-w-0 flex-col items-center gap-2 p-4">
            <div className={`flex items-center gap-2 text-sm font-bold ${panel.text}`}>
              <panel.icon size={16} />
              {panel.name}
            </div>
            <p className="text-center text-xs text-slate-400">{panel.desc}</p>
            <div className="w-full min-w-0 text-center">
              <MatrixHeatmap
                matrix={block[panel.key]}
                rowLabels={tokenLabels}
                colLabels={dimLabels}
                color={panel.color}
                highlightRow={selectedToken}
                cellSize="sm"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        Cada matriz nasce da multiplicação da entrada X pelos pesos aprendidos:
        Q = X·Wq, K = X·Wk, V = X·Wv
      </p>
    </div>
  )
}
