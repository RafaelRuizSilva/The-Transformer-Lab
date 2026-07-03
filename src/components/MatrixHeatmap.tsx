import { useState } from 'react'

interface MatrixHeatmapProps {
  matrix: number[][]
  rowLabels?: string[]
  colLabels?: string[]
  title?: string
  color?: 'blue' | 'pink' | 'green' | 'amber' | 'purple'
  highlightRow?: number | null
  cellSize?: 'sm' | 'md'
  onCellClick?: (row: number, col: number) => void
  selectedCell?: [number, number] | null
}

const COLOR_MAP = {
  blue: [56, 189, 248],
  pink: [244, 114, 182],
  green: [74, 222, 128],
  amber: [251, 191, 36],
  purple: [167, 139, 250],
}

export default function MatrixHeatmap({
  matrix,
  rowLabels,
  colLabels,
  title,
  color = 'purple',
  highlightRow = null,
  cellSize = 'md',
  onCellClick,
  selectedCell,
}: MatrixHeatmapProps) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)

  if (!matrix.length || !matrix[0]?.length) return null

  const flat = matrix.flat()
  const maxAbs = Math.max(...flat.map(Math.abs), 1e-6)
  const [cr, cg, cb] = COLOR_MAP[color]

  const cellClass =
    cellSize === 'sm'
      ? 'w-7 h-7 text-[8px] min-w-7'
      : 'w-11 h-9 text-[10px] min-w-11'

  const cellBg = (v: number) => {
    const t = Math.min(Math.abs(v) / maxAbs, 1)
    if (v >= 0) return `rgba(${cr}, ${cg}, ${cb}, ${0.08 + t * 0.85})`
    return `rgba(248, 113, 113, ${0.08 + t * 0.75})`
  }

  return (
    <div className="inline-block max-w-full">
      {title && (
        <div className="mb-1.5 text-xs font-semibold text-slate-300">{title}</div>
      )}
      <div className="relative overflow-x-auto pb-1">
        <table className="border-separate" style={{ borderSpacing: 2 }}>
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th />}
                {colLabels.map((l, j) => (
                  <th
                    key={j}
                    className="pb-1 text-[9px] font-medium text-slate-400"
                    title={l}
                  >
                    <span className="block max-w-14 truncate">{l}</span>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {matrix.map((row, i) => (
              <tr
                key={i}
                className={
                  highlightRow === i
                    ? 'outline-2 outline-white/60 rounded'
                    : highlightRow !== null
                      ? 'opacity-40'
                      : ''
                }
              >
                {rowLabels && (
                  <td className="pr-2 text-right text-[10px] font-medium text-slate-300 whitespace-nowrap max-w-20 truncate">
                    {rowLabels[i]}
                  </td>
                )}
                {row.map((v, j) => {
                  const isSelected =
                    selectedCell && selectedCell[0] === i && selectedCell[1] === j
                  return (
                    <td
                      key={j}
                      className={`${cellClass} relative rounded text-center font-mono text-slate-100 transition-transform cursor-default ${
                        onCellClick ? 'cursor-pointer hover:scale-110' : 'hover:scale-110'
                      } ${isSelected ? 'ring-2 ring-white' : ''}`}
                      style={{ background: cellBg(v) }}
                      onMouseEnter={() => setHover({ r: i, c: j })}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => onCellClick?.(i, j)}
                    >
                      {cellSize === 'md' ? v.toFixed(2) : ''}
                      {hover && hover.r === i && hover.c === j && (
                        <div className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-xl">
                          {rowLabels ? `${rowLabels[i]} · ` : `linha ${i} · `}
                          {colLabels ? colLabels[j] : `col ${j}`} = <b>{v}</b>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
