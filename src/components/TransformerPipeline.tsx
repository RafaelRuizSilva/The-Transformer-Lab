import { Check, ChevronRight } from 'lucide-react'
import { STEPS } from '../lib/steps'

interface TransformerPipelineProps {
  currentStep: number
  maxReachedStep: number
  onStepClick: (index: number) => void
}

export default function TransformerPipeline({
  currentStep,
  maxReachedStep,
  onStepClick,
}: TransformerPipelineProps) {
  return (
    <nav className="card overflow-x-auto p-3">
      <ol className="flex min-w-max items-center gap-1">
        {STEPS.map((step, i) => {
          const isCurrent = i === currentStep
          const isDone = i < maxReachedStep || (i < currentStep)
          const isReachable = i <= maxReachedStep
          return (
            <li key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => isReachable && onStepClick(i)}
                disabled={!isReachable}
                title={step.title}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : isDone
                      ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                      : isReachable
                        ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                        : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isDone && !isCurrent && <Check size={11} className="shrink-0" />}
                {step.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={12} className="shrink-0 text-slate-600" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
