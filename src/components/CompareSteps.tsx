import { useState } from 'react'
import { X } from 'lucide-react'
import type { SimulationResult } from '../lib/simulation'
import { STEPS } from '../lib/steps'
import StepContentView from './StepContentView'

interface Props {
  open: boolean
  onClose: () => void
  sim: SimulationResult
  selectedBlock: number
  showFormulas: boolean
}

export default function CompareSteps({
  open,
  onClose,
  sim,
  selectedBlock,
  showFormulas,
}: Props) {
  const [stepA, setStepA] = useState(5)
  const [stepB, setStepB] = useState(6)

  if (!open) return null

  const selector = (value: number, onChange: (v: number) => void) => (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-lg border border-white/15 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-400"
    >
      {STEPS.map((s, i) => (
        <option key={s.id} value={i}>
          {s.title}
        </option>
      ))}
    </select>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Comparar duas etapas"
        className="card anim-in flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Comparar duas etapas</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-2">
          {[
            { value: stepA, set: setStepA },
            { value: stepB, set: setStepB },
          ].map((side, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="mb-3">{selector(side.value, side.set)}</div>
              <div className="overflow-x-auto">
                <StepContentView
                  sim={sim}
                  stepIndex={side.value}
                  selectedToken={null}
                  onSelectToken={() => {}}
                  selectedBlock={selectedBlock}
                  onSelectBlock={() => {}}
                  animationsEnabled={false}
                  showFormulas={showFormulas}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
