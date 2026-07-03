import { FileText } from 'lucide-react'
import type { SimulationResult } from '../lib/simulation'

export default function InputView({ sim }: { sim: SimulationResult }) {
  return (
    <div className="anim-in flex flex-col items-center gap-6 py-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-indigo-300 glow">
        <FileText size={28} />
      </div>
      <div className="max-w-xl text-center">
        <p className="mb-3 text-sm text-slate-400">Texto recebido pelo modelo:</p>
        <p className="rounded-2xl border border-white/10 bg-black/25 px-6 py-4 text-xl font-medium text-white">
          “{sim.text}”
        </p>
      </div>
      <div className="flex gap-6 text-center text-sm">
        <div>
          <div className="text-2xl font-bold text-indigo-300">{sim.text.length}</div>
          <div className="text-xs text-slate-500">caracteres</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-violet-300">{sim.tokens.length}</div>
          <div className="text-xs text-slate-500">tokens (próxima etapa)</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-300">{sim.dim}</div>
          <div className="text-xs text-slate-500">dimensões simuladas</div>
        </div>
      </div>
    </div>
  )
}
