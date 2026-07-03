import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Braces,
  Columns2,
  FlaskConical,
  Network,
  Settings2,
  Sparkles,
  Wand2,
} from 'lucide-react'
import ArchitectureOverview from './components/ArchitectureOverview'
import CompareSteps from './components/CompareSteps'
import ExplanationPanel from './components/ExplanationPanel'
import StepContentView from './components/StepContentView'
import TokenInput from './components/TokenInput'
import TransformerPipeline from './components/TransformerPipeline'
import { runSimulation, type SimulationResult } from './lib/simulation'
import { STEPS } from './lib/steps'

export default function App() {
  const [text, setText] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const [selectedBlock, setSelectedBlock] = useState(0)

  const [dim, setDim] = useState(8)
  const [numHeads, setNumHeads] = useState(4)
  const [numBlocks, setNumBlocks] = useState(1)
  const [animationsEnabled, setAnimationsEnabled] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [showFormulas, setShowFormulas] = useState(true)
  const [showArch, setShowArch] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const sim: SimulationResult | null = useMemo(
    () => (text ? runSimulation(text, dim, numHeads, numBlocks) : null),
    [text, dim, numHeads, numBlocks],
  )

  const handleRun = useCallback((t: string) => {
    setText(t)
    setCurrentStep(0)
    setMaxReached(0)
    setSelectedToken(null)
    setSelectedBlock(0)
    setAutoPlay(false)
  }, [])

  const goToStep = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(i, STEPS.length - 1))
    setCurrentStep(clamped)
    setMaxReached((m) => Math.max(m, clamped))
  }, [])

  const handleNext = useCallback(() => goToStep(currentStep + 1), [currentStep, goToStep])
  const handlePrev = useCallback(() => goToStep(currentStep - 1), [currentStep, goToStep])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setMaxReached(0)
    setSelectedToken(null)
    setAutoPlay(false)
  }, [])

  // Reprodução automática
  useEffect(() => {
    if (!autoPlay || !sim) return
    if (currentStep >= STEPS.length - 1) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => goToStep(currentStep + 1), 3500 / speed)
    return () => clearTimeout(timer)
  }, [autoPlay, currentStep, speed, sim, goToStep])

  // Atalhos de teclado: ← → navegam etapas, espaço pausa/retoma, Esc fecha modais
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.key === 'Escape') {
        setShowArch(false)
        setShowCompare(false)
        return
      }
      if (!sim || showArch || showCompare) return
      if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === ' ') {
        e.preventDefault()
        setAutoPlay((a) => !a)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sim, showArch, showCompare, handleNext, handlePrev])

  const step = STEPS[currentStep]

  return (
    <div className={animationsEnabled ? '' : 'no-anim'}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6">
        {/* Cabeçalho */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
              <FlaskConical size={22} />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-xl font-bold text-transparent">
                Transformer Visual Lab
              </h1>
              <p className="text-xs text-slate-500">
                Aprenda visualmente como um Transformer funciona, passo a passo
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowArch(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
            >
              <Network size={14} /> Arquitetura
            </button>
            {sim && (
              <button
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
              >
                <Columns2 size={14} /> Comparar etapas
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showSettings
                  ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-200'
                  : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <Settings2 size={14} /> Configurações
            </button>
          </div>
        </header>

        {/* Configurações da simulação */}
        {showSettings && (
          <div className="card anim-in flex flex-wrap items-center gap-x-6 gap-y-3 p-4 text-xs">
            <label className="flex items-center gap-2 text-slate-300">
              Dimensão
              <select
                value={dim}
                onChange={(e) => setDim(Number(e.target.value))}
                className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-white outline-none focus:border-indigo-400"
              >
                {[4, 8, 12].map((d) => (
                  <option key={d} value={d}>d = {d}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-slate-300">
              Cabeças de atenção
              <select
                value={numHeads}
                onChange={(e) => setNumHeads(Number(e.target.value))}
                className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-white outline-none focus:border-indigo-400"
              >
                {[1, 2, 4].map((h) => (
                  <option key={h} value={h}>{h} {h === 1 ? 'cabeça' : 'cabeças'}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-slate-300">
              Número de blocos simulados
              <select
                value={numBlocks}
                onChange={(e) => {
                  setNumBlocks(Number(e.target.value))
                  setSelectedBlock(0)
                }}
                className="rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-white outline-none focus:border-indigo-400"
              >
                {[1, 2, 3, 4].map((b) => (
                  <option key={b} value={b}>{b} {b === 1 ? 'bloco' : 'blocos'}</option>
                ))}
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
                className="accent-indigo-500"
              />
              <Wand2 size={13} /> Animações
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={showFormulas}
                onChange={(e) => setShowFormulas(e.target.checked)}
                className="accent-indigo-500"
              />
              <Braces size={13} /> Mostrar fórmulas
            </label>
          </div>
        )}

        {/* Entrada e controles */}
        <TokenInput
          onRun={handleRun}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          isRunning={!!sim}
          autoPlay={autoPlay}
          onToggleAutoPlay={() => setAutoPlay(!autoPlay)}
          speed={speed}
          onSpeedChange={setSpeed}
          canNext={currentStep < STEPS.length - 1}
          canPrev={currentStep > 0}
        />

        {sim ? (
          <>
            {/* Pipeline */}
            <TransformerPipeline
              currentStep={currentStep}
              maxReachedStep={maxReached}
              onStepClick={goToStep}
            />

            {/* Conteúdo principal + painel educacional */}
            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_340px]">
              <main className="card min-h-96 p-5">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
                  <Sparkles size={18} className="text-indigo-400" />
                  {step.title}
                </h2>
                <StepContentView
                  key={`${currentStep}-${text}-${dim}-${numHeads}-${numBlocks}`}
                  sim={sim}
                  stepIndex={currentStep}
                  selectedToken={selectedToken}
                  onSelectToken={setSelectedToken}
                  selectedBlock={selectedBlock}
                  onSelectBlock={setSelectedBlock}
                  animationsEnabled={animationsEnabled}
                  showFormulas={showFormulas}
                />
              </main>
              <ExplanationPanel step={step} showFormulas={showFormulas} />
            </div>
          </>
        ) : (
          <div className="card flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-violet-500/25 text-indigo-300">
              <FlaskConical size={30} />
            </div>
            <div>
              <p className="mb-1 text-lg font-semibold text-white">
                Digite um texto e clique em “Executar Transformer”
              </p>
              <p className="mx-auto max-w-md text-sm text-slate-400">
                Você vai acompanhar o texto atravessando as 15 etapas de um bloco
                Transformer — da tokenização até a previsão do próximo token.
              </p>
            </div>
          </div>
        )}

        {/* Rodapé com aviso */}
        <footer className="pb-4 text-center text-xs text-slate-600">
          ⚠️ Simulação educacional simplificada — os valores são gerados
          deterministicamente no navegador (a partir do texto) e não vêm de um modelo
          real. O objetivo é o aprendizado visual, não a precisão científica.
        </footer>
      </div>

      {/* Modais */}
      <ArchitectureOverview
        open={showArch}
        onClose={() => setShowArch(false)}
        currentStep={currentStep}
        animationsEnabled={animationsEnabled}
        isPlaying={autoPlay}
      />
      {sim && (
        <CompareSteps
          open={showCompare}
          onClose={() => setShowCompare(false)}
          sim={sim}
          selectedBlock={selectedBlock}
          showFormulas={showFormulas}
        />
      )}
    </div>
  )
}
