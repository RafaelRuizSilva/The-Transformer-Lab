import type { TokenInfo } from '../lib/simulation'

interface TokenChipProps {
  token: TokenInfo
  selected?: boolean
  onClick?: () => void
  showId?: boolean
  size?: 'sm' | 'md'
}

export default function TokenChip({
  token,
  selected = false,
  onClick,
  showId = false,
  size = 'md',
}: TokenChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
      } ${
        selected
          ? 'scale-110 border-white/70 shadow-lg'
          : 'border-transparent hover:scale-105'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        background: `${token.color}26`,
        color: token.color,
        borderColor: selected ? token.color : `${token.color}44`,
      }}
    >
      <span>{token.text}</span>
      {showId && (
        <span className="rounded bg-black/30 px-1 font-mono text-[10px] text-slate-300">
          #{token.id}
        </span>
      )}
    </button>
  )
}
