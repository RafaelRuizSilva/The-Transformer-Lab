import { ArrowRight } from 'lucide-react'
import type { BlockResult, SimulationResult } from '../lib/simulation'
import { round3 } from '../lib/simulation'
import MatrixHeatmap from './MatrixHeatmap'
import TokenChip from './TokenChip'
import VectorChart from './VectorChart'

interface Props {
  sim: SimulationResult
  block: BlockResult
  selectedToken: number | null
  onSelectToken: (i: number | null) => void
  animationsEnabled: boolean
}

export default function SoftmaxView({
  sim,
  block,
  selectedToken,
  onSelectToken,
  animationsEnabled,
}: Props) {
  const tokenLabels = sim.tokens.map((t) => t.text)
  const focusToken = selectedToken ?? 0
  const n = sim.tokens.length

  const width = Math.max(n * 90, 300)
  const nodeX = (i: number) => (n === 1 ? width / 2 : 40 + (i * (width - 80)) / (n - 1))

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-start">
        <MatrixHeatmap
          matrix={block.scoresScaled}
          rowLabels={tokenLabels}
          colLabels={tokenLabels}
          title="Antes do Softmax (scores)"
          color="amber"
          cellSize="sm"
          highlightRow={selectedToken}
        />
        <ArrowRight className="mt-10 shrink-0 rotate-90 text-slate-400 lg:rotate-0" size={22} />
        <div>
          <MatrixHeatmap
            matrix={block.attnWeights}
            rowLabels={tokenLabels}
            colLabels={tokenLabels}
            title="Depois do Softmax (pesos de atenção)"
            color="green"
            cellSize="sm"
            highlightRow={selectedToken}
          />
          <div className="mt-2 text-center text-[10px] text-emerald-300">
            {block.attnWeights.map((row, i) => (
              <span key={i} className="mr-2 inline-block font-mono">
                Σ linha {i} = {round3(row.reduce((s, v) => s + v, 0)).toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      </div>

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

      <div className="mx-auto w-full max-w-lg">
        <VectorChart
          vector={block.attnWeights[focusToken]}
          color={sim.tokens[focusToken].color}
          title={`Quanto “${sim.tokens[focusToken].text}” presta atenção em cada token (soma = 1)`}
          labels={tokenLabels}
        />
      </div>

      <div className="mx-auto w-full max-w-2xl overflow-x-auto">
        <div className="mb-1 text-center text-xs font-semibold text-slate-300">
          Atenção de “{sim.tokens[focusToken].text}” — espessura proporcional ao peso
        </div>
        <svg
          viewBox={`0 0 ${width} 120`}
          className="mx-auto block"
          style={{ minWidth: Math.min(width, 600), maxWidth: '100%' }}
        >
          {sim.tokens.map((_, j) => {
            const w = block.attnWeights[focusToken][j]
            if (j === focusToken) return null
            return (
              <path
                key={j}
                d={`M ${nodeX(focusToken)} 35 Q ${(nodeX(focusToken) + nodeX(j)) / 2} ${
                  35 + Math.abs(focusToken - j) * 20
                } ${nodeX(j)} 35`}
                fill="none"
                stroke={sim.tokens[focusToken].color}
                strokeWidth={0.5 + w * 8}
                opacity={0.25 + w * 0.75}
                className={animationsEnabled ? 'flow-line' : ''}
              />
            )
          })}
          {sim.tokens.map((tok, i) => (
            <g key={i} className="cursor-pointer" onClick={() => onSelectToken(i)}>
              <circle
                cx={nodeX(i)}
                cy={35}
                r={i === focusToken ? 16 : 12}
                fill={`${tok.color}33`}
                stroke={tok.color}
                strokeWidth={i === focusToken ? 2.5 : 1.5}
              />
              <text x={nodeX(i)} y={17} textAnchor="middle" fill={tok.color} fontSize={11} fontWeight={600}>
                {tok.text.length > 8 ? tok.text.slice(0, 7) + '…' : tok.text}
              </text>
              <text x={nodeX(i)} y={39} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>
                {i === focusToken ? '●' : `${Math.round(block.attnWeights[focusToken][i] * 100)}%`}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
