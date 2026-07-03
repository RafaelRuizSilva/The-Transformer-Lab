import { useState } from 'react'
import { BookOpen, ChevronDown, HelpCircle, Lightbulb, Sigma, Sparkles } from 'lucide-react'
import type { StepContent } from '../lib/steps'

interface ExplanationPanelProps {
  step: StepContent
  showFormulas: boolean
}

export default function ExplanationPanel({ step, showFormulas }: ExplanationPanelProps) {
  const [mode, setMode] = useState<'simple' | 'technical'>('simple')
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  return (
    <aside className="card sticky top-4 flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <Lightbulb size={16} className="text-amber-400" />
          Painel educacional
        </h3>
        <div className="flex rounded-lg border border-white/10 bg-black/20 p-0.5 text-xs">
          <button
            onClick={() => setMode('simple')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              mode === 'simple'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Simples
          </button>
          <button
            onClick={() => setMode('technical')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              mode === 'technical'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Técnica
          </button>
        </div>
      </div>

      <section>
        <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-400">
          <Sparkles size={12} /> O que está acontecendo?
        </h4>
        <p className="text-sm leading-relaxed text-slate-200">
          {mode === 'simple' ? step.simple : step.technical}
        </p>
      </section>

      <section>
        <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-pink-400">
          <HelpCircle size={12} /> Por que isso é necessário?
        </h4>
        <p className="text-sm leading-relaxed text-slate-300">{step.why}</p>
      </section>

      <section>
        <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">
          <BookOpen size={12} /> Exemplo simples
        </h4>
        <p className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm italic leading-relaxed text-slate-300">
          {step.example}
        </p>
      </section>

      {step.formula && showFormulas && (
        <section>
          <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-violet-400">
            <Sigma size={12} /> Fórmula
          </h4>
          <pre className="overflow-x-auto rounded-lg border border-violet-400/20 bg-violet-950/40 p-3 font-mono text-xs leading-relaxed text-violet-200">
            {step.formula}
          </pre>
        </section>
      )}

      <section className="border-t border-white/10 pt-3">
        <button
          onClick={() => setGlossaryOpen(!glossaryOpen)}
          className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-white"
        >
          <span>Glossário ({step.glossary.length})</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${glossaryOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {glossaryOpen && (
          <dl className="anim-in mt-2 space-y-2">
            {step.glossary.map((g) => (
              <div key={g.term} className="rounded-lg bg-black/20 p-2.5">
                <dt className="text-xs font-bold text-indigo-300">{g.term}</dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-slate-400">
                  {g.definition}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </aside>
  )
}
