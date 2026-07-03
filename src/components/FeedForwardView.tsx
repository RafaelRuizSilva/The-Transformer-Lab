import type { BlockResult, SimulationResult } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'
import TokenChip from './TokenChip'
import VectorChart from './VectorChart'

interface Props {
  sim: SimulationResult
  block: BlockResult
  selectedToken: number | null
  onSelectToken: (i: number | null) => void
  animationsEnabled: boolean
  showFormulas: boolean
}

export default function FeedForwardView({
  sim,
  block,
  selectedToken,
  onSelectToken,
  animationsEnabled,
  showFormulas,
}: Props) {
  const tokenLabels = sim.tokens.map((t) => t.text)
  const focusToken = selectedToken ?? 0
  const hidden = sim.dim * 2

  // Diagrama de neurônios: entrada (dim) → oculta (hidden) → saída (dim)
  const W = 560
  const H = 240
  const layerX = [60, W / 2, W - 60]
  const nodeY = (count: number, i: number) =>
    count === 1 ? H / 2 : 30 + (i * (H - 60)) / (count - 1)

  const inputVec = block.addNorm1[focusToken]
  const hiddenVec = block.ffnActivated[focusToken]
  const outputVec = block.ffnOutput[focusToken]

  const maxAbs = (v: number[]) => Math.max(...v.map(Math.abs), 1e-6)
  const inMax = maxAbs(inputVec)
  const hidMax = maxAbs(hiddenVec)
  const outMax = maxAbs(outputVec)

  return (
    <div className="anim-in flex flex-col gap-6">
      {showFormulas && (
        <div className="mx-auto rounded-xl border border-violet-400/20 bg-violet-950/30 px-5 py-2.5 font-mono text-sm text-violet-200">
          FFN(x) = W₂ · ReLU(W₁ · x) — camada oculta com {hidden} neurônios
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {sim.tokens.map((tok, i) => (
          <TokenChip
            key={i}
            token={tok}
            size="sm"
            selected={focusToken === i}
            onClick={() => onSelectToken(i)}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-2xl overflow-x-auto">
        <div className="mb-1 text-center text-xs font-semibold text-slate-300">
          Rede FFN para o token “{sim.tokens[focusToken].text}” — brilho = magnitude da ativação
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block" style={{ minWidth: 480, maxWidth: '100%' }}>
          {/* conexões entrada → oculta */}
          {inputVec.map((_, i) =>
            hiddenVec.map((hv, j) => (
              <line
                key={`a${i}-${j}`}
                x1={layerX[0]} y1={nodeY(sim.dim, i)}
                x2={layerX[1]} y2={nodeY(hidden, j)}
                stroke="#818cf8"
                strokeWidth={0.4}
                opacity={0.08 + (Math.abs(hv) / hidMax) * 0.25}
                className={animationsEnabled ? 'flow-line' : ''}
              />
            )),
          )}
          {/* conexões oculta → saída */}
          {hiddenVec.map((hv, j) =>
            outputVec.map((_, k) => (
              <line
                key={`b${j}-${k}`}
                x1={layerX[1]} y1={nodeY(hidden, j)}
                x2={layerX[2]} y2={nodeY(sim.dim, k)}
                stroke="#a78bfa"
                strokeWidth={0.4}
                opacity={0.08 + (Math.abs(hv) / hidMax) * 0.25}
                className={animationsEnabled ? 'flow-line' : ''}
              />
            )),
          )}
          {/* neurônios */}
          {inputVec.map((v, i) => (
            <circle
              key={`in${i}`} cx={layerX[0]} cy={nodeY(sim.dim, i)} r={7}
              fill={`rgba(129, 140, 248, ${0.2 + (Math.abs(v) / inMax) * 0.8})`}
              stroke="#818cf8" strokeWidth={1}
            />
          ))}
          {hiddenVec.map((v, j) => (
            <circle
              key={`h${j}`} cx={layerX[1]} cy={nodeY(hidden, j)} r={6}
              fill={v === 0 ? 'rgba(100,116,139,0.25)' : `rgba(251, 191, 36, ${0.2 + (v / hidMax) * 0.8})`}
              stroke={v === 0 ? '#64748b' : '#fbbf24'} strokeWidth={1}
            >
              <title>{`neurônio ${j}: ${v}${v === 0 ? ' (zerado pela ReLU)' : ''}`}</title>
            </circle>
          ))}
          {outputVec.map((v, k) => (
            <circle
              key={`o${k}`} cx={layerX[2]} cy={nodeY(sim.dim, k)} r={7}
              fill={`rgba(52, 211, 153, ${0.2 + (Math.abs(v) / outMax) * 0.8})`}
              stroke="#34d399" strokeWidth={1}
            />
          ))}
          <text x={layerX[0]} y={H - 6} textAnchor="middle" fill="#818cf8" fontSize={10} fontWeight={600}>
            entrada ({sim.dim})
          </text>
          <text x={layerX[1]} y={H - 6} textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={600}>
            oculta + ReLU ({hidden})
          </text>
          <text x={layerX[2]} y={H - 6} textAnchor="middle" fill="#34d399" fontSize={10} fontWeight={600}>
            saída ({sim.dim})
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          <VectorChart
            vector={block.ffnHidden[focusToken]}
            color="#f472b6"
            title="Camada oculta ANTES da ReLU (valores negativos existem)"
            height={160}
          />
        </div>
        <div className="mx-auto w-full max-w-md">
          <VectorChart
            vector={block.ffnActivated[focusToken]}
            color="#fbbf24"
            title="Camada oculta DEPOIS da ReLU (negativos zerados)"
            height={160}
          />
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto">
        <MatrixHeatmap
          matrix={block.ffnOutput}
          rowLabels={tokenLabels}
          title="Saída da FFN para todos os tokens"
          color="green"
          cellSize="sm"
          highlightRow={selectedToken}
        />
      </div>
    </div>
  )
}
