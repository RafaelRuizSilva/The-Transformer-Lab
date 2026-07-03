import { useMemo } from 'react'
import { CheckCircle2, Clock, Cpu, Hash, MessageSquareText, Sparkles } from 'lucide-react'
import { generateContinuation, type SimulationResult } from '../lib/simulation'
import { STEPS } from '../lib/steps'

interface Props {
  sim: SimulationResult
  animationsEnabled: boolean
}

export default function FinalResultView({ sim, animationsEnabled }: Props) {
  const continuation = useMemo(
    () => generateContinuation(sim.text, sim.dim, sim.numHeads, sim.numBlocks),
    [sim],
  )

  return (
    <div className="anim-in flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 text-emerald-300 glow">
          <Sparkles size={26} />
        </div>
        <div className="text-center">
          <p className="mb-1 text-sm text-slate-400">Texto original</p>
          <p className="text-lg text-slate-200">“{sim.text}”</p>
        </div>
        <div className="text-center">
          <p className="mb-1 text-sm text-slate-400">Token previsto</p>
          <span className="inline-block rounded-xl border border-emerald-400/50 bg-emerald-500/15 px-4 py-1.5 text-lg font-bold text-emerald-300">
            {sim.predictedGreedy}
          </span>
        </div>
        <div className="max-w-xl text-center">
          <p className="mb-1 text-sm text-slate-400">Texto completo com a previsão</p>
          <p className="rounded-2xl border border-white/10 bg-black/25 px-6 py-4 text-xl font-medium text-white">
            {sim.text}{' '}
            <span className="text-emerald-300">{sim.predictedGreedy}</span>
          </p>
        </div>

        <div className="max-w-xl text-center">
          <p className="mb-1 flex items-center justify-center gap-1.5 text-sm text-slate-400">
            <MessageSquareText size={14} />
            Resposta gerada (ciclo repetido {continuation.length}×)
          </p>
          <p className="rounded-2xl border border-indigo-400/25 bg-indigo-500/10 px-6 py-4 text-xl font-medium text-white">
            {sim.text}
            {continuation.map((tok, i) => (
              <span
                key={i}
                className={`text-indigo-300 ${animationsEnabled ? 'anim-in' : ''}`}
                style={animationsEnabled ? { animationDelay: `${0.4 + i * 0.35}s` } : undefined}
              >
                {['.', '!', '…'].includes(tok) ? tok : ` ${tok}`}
              </span>
            ))}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Cada palavra colorida saiu de uma passada completa pelas 15 etapas:
            o token escolhido é anexado ao texto e o pipeline roda de novo. A
            escolha usa amostragem com penalidade de repetição (técnicas reais
            de decodificação), por isso pode diferir do token guloso acima.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          Caminho percorrido
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300 ${
                animationsEnabled ? 'anim-in' : ''
              }`}
              style={animationsEnabled ? { animationDelay: `${i * 0.12}s` } : undefined}
            >
              <CheckCircle2 size={11} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <Clock size={20} className="shrink-0 text-sky-400" />
          <div>
            <div className="text-lg font-bold text-white">{sim.simulatedTimeMs} ms</div>
            <div className="text-xs text-slate-500">tempo simulado</div>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <Hash size={20} className="shrink-0 text-violet-400" />
          <div>
            <div className="text-lg font-bold text-white">{sim.tokens.length}</div>
            <div className="text-xs text-slate-500">tokens processados</div>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <Cpu size={20} className="shrink-0 text-amber-400" />
          <div>
            <div className="text-lg font-bold text-white">
              {sim.totalOperations.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-slate-500">operações simuladas</div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        Em um modelo real, este token entraria na sequência e todo o processo se
        repetiria para prever a próxima palavra — é assim que os LLMs escrevem.
      </p>
    </div>
  )
}
