import { useState } from 'react'
import type { BlockResult, SimulationResult } from '../lib/simulation'
import { round3 } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'

interface Props {
  sim: SimulationResult
  block: BlockResult
  animationsEnabled: boolean
  showFormulas: boolean
}

export default function AttentionView({ sim, block, animationsEnabled, showFormulas }: Props) {
  const [cell, setCell] = useState<[number, number] | null>(null)
  const tokenLabels = sim.tokens.map((t) => t.text)
  const n = sim.tokens.length

  // Posições dos tokens no diagrama de conexões
  const width = Math.max(n * 90, 300)
  const nodeX = (i: number) => (n === 1 ? width / 2 : 40 + (i * (width - 80)) / (n - 1))

  return (
    <div className="anim-in flex flex-col gap-6">
      {showFormulas && (
        <div className="mx-auto max-w-full overflow-x-auto rounded-xl border border-amber-400/20 bg-amber-950/30 px-5 py-2.5 text-center font-mono text-sm text-amber-200">
          Attention Scores = (Q · Kᵀ) / √{sim.dim} = (Q · Kᵀ) / {round3(Math.sqrt(sim.dim))}
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-start">
        <div className="w-full min-w-0 text-center lg:w-auto">
          <MatrixHeatmap
            matrix={block.scoresRaw}
            rowLabels={tokenLabels}
            colLabels={tokenLabels}
            title="Q · Kᵀ (scores brutos)"
            color="amber"
            cellSize="sm"
          />
        </div>
        <div className="w-full min-w-0 text-center lg:w-auto">
          <MatrixHeatmap
            matrix={block.scoresScaled}
            rowLabels={tokenLabels}
            colLabels={tokenLabels}
            title={`Scores ÷ √d — clique numa célula para ver o cálculo`}
            color="amber"
            onCellClick={(r, c) => setCell(cell && cell[0] === r && cell[1] === c ? null : [r, c])}
            selectedCell={cell}
          />
        </div>
      </div>

      {cell && (
        <div className="anim-in mx-auto max-w-xl rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
          <p className="mb-2 font-semibold text-white">
            Cálculo do score entre{' '}
            <span style={{ color: sim.tokens[cell[0]].color }}>“{tokenLabels[cell[0]]}”</span>
            {' '}(Query) e{' '}
            <span style={{ color: sim.tokens[cell[1]].color }}>“{tokenLabels[cell[1]]}”</span>
            {' '}(Key):
          </p>
          <div className="overflow-x-auto font-mono text-xs text-slate-300">
            <p className="mb-1">
              Q[{cell[0]}] · K[{cell[1]}] ={' '}
              {block.Q[cell[0]]
                .map((q, d) => `(${q}×${block.K[cell[1]][d]})`)
                .join(' + ')}
            </p>
            <p className="mb-1">
              = <b className="text-amber-300">{block.scoresRaw[cell[0]][cell[1]]}</b>
            </p>
            <p>
              ÷ √{sim.dim} ={' '}
              <b className="text-amber-300">{block.scoresScaled[cell[0]][cell[1]]}</b>
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-2xl overflow-x-auto">
        <div className="mb-1 text-center text-xs font-semibold text-slate-300">
          Conexões de atenção (opacidade proporcional ao score)
        </div>
        <svg
          viewBox={`0 0 ${width} 130`}
          className="mx-auto block"
          style={{ minWidth: Math.min(width, 600), maxWidth: '100%' }}
        >
          {sim.tokens.map((_, i) =>
            sim.tokens.map((_t, j) => {
              if (i === j) return null
              const s = block.attnWeights[i][j]
              return (
                <path
                  key={`${i}-${j}`}
                  d={`M ${nodeX(i)} 30 Q ${(nodeX(i) + nodeX(j)) / 2} ${
                    30 + Math.abs(i - j) * 22
                  } ${nodeX(j)} 30`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={0.5 + s * 3}
                  opacity={0.15 + s * 0.8}
                  className={animationsEnabled ? 'flow-line' : ''}
                />
              )
            }),
          )}
          {sim.tokens.map((tok, i) => (
            <g key={i}>
              <circle cx={nodeX(i)} cy={30} r={13} fill={`${tok.color}33`} stroke={tok.color} strokeWidth={1.5} />
              <text
                x={nodeX(i)}
                y={14}
                textAnchor="middle"
                fill={tok.color}
                fontSize={11}
                fontWeight={600}
              >
                {tok.text.length > 8 ? tok.text.slice(0, 7) + '…' : tok.text}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
