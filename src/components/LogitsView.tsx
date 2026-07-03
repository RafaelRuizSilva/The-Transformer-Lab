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

const TOP_N = 10

export default function LogitsView({ sim }: { sim: SimulationResult }) {
  const top = [...sim.vocab].sort((a, b) => b.logit - a.logit).slice(0, TOP_N)
  const data = top.map((v) => ({ name: v.word, logit: v.logit }))
  const maxLogit = top[0].logit

  return (
    <div className="anim-in flex flex-col gap-6">
      <p className="text-center text-sm text-slate-400">
        O vetor final do último token (“{sim.tokens[sim.tokens.length - 1]?.text}”) é
        comparado com cada uma das{' '}
        <strong className="text-slate-200">{sim.vocab.length.toLocaleString('pt-BR')}</strong>{' '}
        palavras do vocabulário simulado — abaixo, as {TOP_N} de maior pontuação:
      </p>

      <div className="mx-auto w-full max-w-2xl">
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
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                fontSize: 12,
              }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="logit" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={
                    d.logit === maxLogit
                      ? '#34d399'
                      : d.logit >= 0
                        ? '#818cf8'
                        : '#f87171'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-5">
        {top.map((v) => (
          <div
            key={v.word}
            className={`rounded-xl border p-2.5 text-center transition-all ${
              v.logit === maxLogit
                ? 'border-emerald-400/50 bg-emerald-500/15'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="text-sm font-semibold text-white">{v.word}</div>
            <div
              className={`font-mono text-xs ${
                v.logit >= 0 ? 'text-indigo-300' : 'text-red-400'
              }`}
            >
              {v.logit.toFixed(3)}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        Logits são pontuações brutas — podem ser negativas e não somam 1.
        A próxima etapa (Softmax) as converte em probabilidades. As{' '}
        {(sim.vocab.length - TOP_N).toLocaleString('pt-BR')} palavras restantes
        receberam pontuações menores e ficaram fora do gráfico.
      </p>
    </div>
  )
}
