import { X } from 'lucide-react'
import { ARCH_NODE_FOR_STEP } from '../lib/archMap'

interface Props {
  open: boolean
  onClose: () => void
  currentStep: number
  animationsEnabled: boolean
  isPlaying: boolean
}

const ARCH_NODES = [
  { label: 'Input', color: '#94a3b8' },
  { label: 'Token Embedding + Positional Encoding', color: '#a78bfa' },
  { label: 'Multi-Head Self-Attention', color: '#fbbf24' },
  { label: 'Add & Norm', color: '#f472b6' },
  { label: 'Feed Forward', color: '#818cf8' },
  { label: 'Add & Norm', color: '#f472b6' },
  { label: 'Linear', color: '#38bdf8' },
  { label: 'Softmax', color: '#4ade80' },
  { label: 'Output', color: '#34d399' },
]

export default function ArchitectureOverview({
  open,
  onClose,
  currentStep,
  animationsEnabled,
  isPlaying,
}: Props) {
  if (!open) return null
  const activeNode = ARCH_NODE_FOR_STEP[currentStep] ?? 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Arquitetura completa do Transformer"
        className="card anim-in max-h-[90vh] w-full max-w-md overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            Arquitetura completa do Transformer
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          {ARCH_NODES.map((node, i) => {
            const isActive = i === activeNode
            const isDone = i < activeNode
            return (
              <div key={i} className="flex w-full flex-col items-center">
                <div
                  className={`w-full max-w-xs rounded-xl border px-4 py-2.5 text-center text-sm font-medium transition-all ${
                    isActive
                      ? 'scale-105 text-white shadow-lg glow'
                      : isDone
                        ? 'text-slate-300'
                        : 'text-slate-500'
                  }`}
                  style={{
                    borderColor: isActive ? node.color : `${node.color}${isDone ? '66' : '26'}`,
                    background: isActive
                      ? `${node.color}26`
                      : isDone
                        ? `${node.color}14`
                        : 'rgba(255,255,255,0.03)',
                  }}
                >
                  {node.label}
                </div>
                {i < ARCH_NODES.length - 1 && (
                  <svg width="24" height="26" className="my-0.5">
                    <line
                      x1="12" y1="0" x2="12" y2="18"
                      stroke={i < activeNode ? node.color : '#475569'}
                      strokeWidth="2"
                      className={
                        animationsEnabled && isPlaying && i === activeNode ? 'flow-line' : ''
                      }
                    />
                    <polygon
                      points="7,17 17,17 12,25"
                      fill={i < activeNode ? node.color : '#475569'}
                    />
                  </svg>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          A etapa atual da simulação está destacada. Durante a reprodução automática,
          a informação “viaja” pelo diagrama.
        </p>
      </div>
    </div>
  )
}
