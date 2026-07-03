import { ArrowDown } from 'lucide-react'
import type { SimulationResult } from '../lib/simulation'
import TokenChip from './TokenChip'

interface Props {
  sim: SimulationResult
  selectedToken: number | null
  onSelectToken: (i: number | null) => void
}

export default function TokenizationView({ sim, selectedToken, onSelectToken }: Props) {
  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="text-center">
        <p className="mb-2 text-sm text-slate-400">Texto original</p>
        <p className="text-lg text-white">“{sim.text}”</p>
        <ArrowDown className="mx-auto my-3 text-slate-500" size={20} />
        <div className="flex flex-wrap justify-center gap-2">
          {sim.tokens.map((tok, i) => (
            <TokenChip
              key={i}
              token={tok}
              showId
              selected={selectedToken === i}
              onClick={() => onSelectToken(selectedToken === i ? null : i)}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Clique em um token para acompanhá-lo pelas próximas etapas
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="mx-auto min-w-72 text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-2">Posição</th>
              <th className="px-4 py-2">Token</th>
              <th className="px-4 py-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {sim.tokens.map((tok, i) => (
              <tr
                key={i}
                onClick={() => onSelectToken(selectedToken === i ? null : i)}
                className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5 ${
                  selectedToken === i ? 'bg-white/10' : ''
                }`}
              >
                <td className="px-4 py-2 font-mono text-slate-400">{tok.position}</td>
                <td className="px-4 py-2 font-medium" style={{ color: tok.color }}>
                  {tok.text}
                </td>
                <td className="px-4 py-2 font-mono text-slate-300">#{tok.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-sm text-slate-400">
        Total: <b className="text-white">{sim.tokens.length} tokens</b>
      </p>
    </div>
  )
}
