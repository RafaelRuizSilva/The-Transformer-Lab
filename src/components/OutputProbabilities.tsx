import { useState } from 'react'
import { Dices, Target, Trophy } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SimulationResult } from '../lib/simulation'

export default function OutputProbabilities({ sim }: { sim: SimulationResult }) {
  const [mode, setMode] = useState<'greedy' | 'sample'>('greedy')
  const chosen = mode === 'greedy' ? sim.predictedGreedy : sim.predictedSampled

  const sorted = [...sim.vocab].sort((a, b) => b.prob - a.prob)
  const top3 = sorted.slice(0, 3)
  const top10 = sorted.slice(0, 10)
  const data = top10.map((v) => ({ name: v.word, prob: Math.round(v.prob * 1000) / 10 }))
  const restPct = Math.max(0, 100 - top10.reduce((s, v) => s + v.prob * 100, 0))
  // Se a amostragem escolheu uma palavra fora do top 3, mostra-a também
  const chosenEntry = sorted.find((v) => v.word === chosen)
  const podium =
    chosenEntry && !top3.includes(chosenEntry) ? [...top3, chosenEntry] : top3

  return (
    <div className="anim-in flex flex-col gap-6">
      <div className="flex justify-center">
        <div className="flex rounded-xl border border-white/10 bg-black/20 p-1 text-xs">
          <button
            onClick={() => setMode('greedy')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              mode === 'greedy' ? 'bg-emerald-500/80 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target size={13} /> Determinística (argmax)
          </button>
          <button
            onClick={() => setMode('sample')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
              mode === 'sample' ? 'bg-violet-500/80 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dices size={13} /> Amostragem simulada
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-1 text-xs font-semibold text-slate-300">
          Top 10 de {sim.vocab.length.toLocaleString('pt-BR')} palavras — as
          demais somam {restPct.toFixed(1)}% da probabilidade
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 24, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-18}
              textAnchor="end"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="%" />
            <Tooltip
              formatter={(v) => [`${v}%`, 'probabilidade']}
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                fontSize: 12,
              }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.name === chosen ? '#34d399' : '#64748b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
        {podium.map((v, i) => (
          <div
            key={v.word}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${
              v.word === chosen
                ? 'border-emerald-400/60 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {i < 3 && (
              <Trophy
                size={16}
                className={i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : 'text-amber-700'}
              />
            )}
            <span className="font-semibold text-white">{v.word}</span>
            <span className="font-mono text-xs text-slate-400">
              {(v.prob * 100).toFixed(1)}%
            </span>
            {v.word === chosen && (
              <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                ESCOLHIDA
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        {mode === 'greedy'
          ? 'Modo determinístico: a palavra de maior probabilidade é sempre escolhida.'
          : 'Amostragem: a palavra é sorteada proporcionalmente às probabilidades (seed fixa derivada do texto).'}
      </p>
    </div>
  )
}
