import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react'

interface TokenInputProps {
  onRun: (text: string) => void
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  isRunning: boolean
  autoPlay: boolean
  onToggleAutoPlay: () => void
  speed: number
  onSpeedChange: (s: number) => void
  canNext: boolean
  canPrev: boolean
}

const MAX_CHARS = 100
const DEFAULT_TEXT = 'O gato dormiu no sofá'

export default function TokenInput({
  onRun,
  onNext,
  onPrev,
  onReset,
  isRunning,
  autoPlay,
  onToggleAutoPlay,
  speed,
  onSpeedChange,
  canNext,
  canPrev,
}: TokenInputProps) {
  const [text, setText] = useState(DEFAULT_TEXT)

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            maxLength={MAX_CHARS}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && text.trim() && onRun(text)}
            placeholder="Digite um texto de até 100 caracteres..."
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-400"
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono ${
              text.length >= MAX_CHARS ? 'text-red-400' : 'text-slate-500'
            }`}
          >
            {text.length}/{MAX_CHARS}
          </span>
        </div>
        <button
          onClick={() => text.trim() && onRun(text)}
          disabled={!text.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap size={16} />
          Executar Transformer
        </button>
      </div>

      {isRunning && (
        <div className="anim-in flex flex-wrap items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            title="Atalho: ←"
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Etapa anterior
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            title="Atalho: →"
            className="flex items-center gap-1 rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-3 py-1.5 text-xs font-medium text-indigo-200 transition-colors hover:bg-indigo-500/30 disabled:opacity-35 disabled:cursor-not-allowed"
          >
            Próxima etapa <ChevronRight size={14} />
          </button>
          <button
            onClick={onToggleAutoPlay}
            title="Atalho: espaço"
            className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              autoPlay
                ? 'border-amber-400/40 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            {autoPlay ? <Pause size={14} /> : <Play size={14} />}
            {autoPlay ? 'Pausar' : 'Reprodução automática'}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            <RotateCcw size={14} /> Reiniciar
          </button>

          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
            <span>Velocidade</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-24 accent-indigo-500"
            />
            <span className="w-8 font-mono text-slate-300">{speed}x</span>
          </div>
        </div>
      )}
    </div>
  )
}
