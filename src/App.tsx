import { useEffect, useMemo, useState } from 'react'
import { analyzeEfficiency } from './analysis'
import { AnalysisModal } from './components/AnalysisModal'
import { FloatingHand } from './components/FloatingHand'
import { ManualDrawer } from './components/ManualDrawer'
import { ManualPanel } from './components/ManualPanel'
import { GridBackground } from './components/GridBackground'
import { RandomPanel } from './components/RandomPanel'
import { randomHand, randomTile } from './lib/hand'

const getInitialStats = () => {
  if (typeof window === 'undefined') {
    return { correct: 0, streak: 0, bestStreak: 0 }
  }
  const stored = localStorage.getItem('mahjong-game-stats')
  if (!stored) return { correct: 0, streak: 0, bestStreak: 0 }
  try {
    const data = JSON.parse(stored) as {
      correct?: number
      streak?: number
      bestStreak?: number
    }
    return {
      correct: typeof data.correct === 'number' ? data.correct : 0,
      streak: typeof data.streak === 'number' ? data.streak : 0,
      bestStreak: typeof data.bestStreak === 'number' ? data.bestStreak : 0,
    }
  } catch {
    return { correct: 0, streak: 0, bestStreak: 0 }
  }
}

function App() {
  const [isHandVisible, setIsHandVisible] = useState(true)
  const [randomHandEl, setRandomHandEl] = useState<HTMLDivElement | null>(null)
  const [manualOpen, setManualOpen] = useState(false)
  const [manualAnalysisOpen, setManualAnalysisOpen] = useState(false)

  const [paistr, setPaistr] = useState('m123p123789s338s88')
  const [baopai, setBaopai] = useState('s3')
  const [zhuangfeng, setZhuangfeng] = useState(0)
  const [menfeng, setMenfeng] = useState(0)
  const [xun, setXun] = useState(5)
  const [hongpai, setHongpai] = useState(true)

  const [includeZi, setIncludeZi] = useState(false)
  const [randomPaistr, setRandomPaistr] = useState(() => randomHand(false))
  const [randomBaopai, setRandomBaopai] = useState(() => randomTile())
  const [randomZhuangfeng, setRandomZhuangfeng] = useState(() => Math.floor(Math.random() * 4))
  const [randomMenfeng, setRandomMenfeng] = useState(() => Math.floor(Math.random() * 4))
  const [randomXun] = useState(5)
  const [randomHongpai] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const initialStats = getInitialStats()
  const [correctCount, setCorrectCount] = useState(initialStats.correct)
  const [streak, setStreak] = useState(initialStats.streak)
  const [bestStreak, setBestStreak] = useState(initialStats.bestStreak)
  const [lastOutcome, setLastOutcome] = useState<'best' | 'picked' | 'miss' | null>(null)
  const [celebrateId, setCelebrateId] = useState(0)

  useEffect(() => {
    localStorage.setItem(
      'mahjong-game-stats',
      JSON.stringify({ correct: correctCount, streak, bestStreak }),
    )
  }, [correctCount, streak, bestStreak])

  const { result, error } = useMemo(() => {
    try {
      const baopaiList = baopai
        .split(/[,\s]+/)
        .map((p) => p.trim())
        .filter(Boolean)
      return {
        result: analyzeEfficiency({
          paistr,
          baopai: baopaiList,
          zhuangfeng,
          menfeng,
          xun,
          hongpai,
        }),
        error: null,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { result: null, error: message }
    }
  }, [baopai, hongpai, menfeng, paistr, xun, zhuangfeng])

  const { randomResult, randomError } = useMemo(() => {
    try {
      const baopaiList = randomBaopai
        .split(/[,\s]+/)
        .map((p) => p.trim())
        .filter(Boolean)
      return {
        randomResult: analyzeEfficiency({
          paistr: randomPaistr,
          baopai: baopaiList,
          zhuangfeng: randomZhuangfeng,
          menfeng: randomMenfeng,
          xun: randomXun,
          hongpai: randomHongpai,
        }),
        randomError: null,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { randomResult: null, randomError: message }
    }
  }, [randomBaopai, randomHongpai, randomMenfeng, randomPaistr, randomXun, randomZhuangfeng])

  const randomBest = useMemo(() => {
    if (!randomResult) return []
    let max = Number.NEGATIVE_INFINITY
    for (const row of randomResult.results) {
      if (row.ev == null) continue
      if (row.ev > max) max = row.ev
    }
    if (!Number.isFinite(max)) return []
    return randomResult.results.filter((r) => r.ev === max)
  }, [randomResult])

  const handleGenerate = () => {
    if (streak > 0 && selected.length === 0 && !submitted) {
      const confirmReset = window.confirm('未作出选择就换牌将终止连胜，确定要换牌吗？')
      if (!confirmReset) return
      setStreak(0)
      setLastOutcome(null)
    }
    setRandomPaistr(randomHand(includeZi))
    setRandomBaopai(randomTile())
    setRandomZhuangfeng(Math.floor(Math.random() * 4))
    setRandomMenfeng(Math.floor(Math.random() * 4))
    setSelected([])
    setSubmitted(false)
    setAnalysisOpen(false)
    setLastOutcome(null)
  }

  const toggleSelect = (discard: string) => {
    setSelected((prev) =>
      prev.includes(discard) ? prev.filter((d) => d !== discard) : [...prev, discard],
    )
  }

  const handleSubmit = () => {
    if (submitted) return
    setSubmitted(true)
    const bestDiscards = new Set(randomBest.map((b) => b.discard))
    const isCorrect = selected.length > 0 && selected.every((s) => bestDiscards.has(s))
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
      setCelebrateId((prev) => prev + 1)
    }
    const nextStreak = isCorrect ? streak + 1 : 0
    setStreak(nextStreak)
    setBestStreak((prev) => Math.max(prev, nextStreak))
    setLastOutcome(isCorrect ? 'best' : 'miss')
    if (!isCorrect) {
      setAnalysisOpen(true)
    }
  }

  useEffect(() => {
    const target = randomHandEl
    if (!target) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsHandVisible(entry.isIntersecting)
      },
      { threshold: 0.15 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [randomHandEl])

  const showFloating =
    !!randomHandEl && !isHandVisible && !analysisOpen && !manualAnalysisOpen && !manualOpen

  return (
    <div className="relative min-h-screen bg-transparent text-slate-900">
      <GridBackground />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-transparent" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-4 sm:pt-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-slate-900">何切挑战</div>
            <div className="text-xs text-slate-500">连胜评分 · 练习与挑战</div>
          </div>
          <button
            type="button"
            onClick={() => setManualOpen(true)}
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur hover:border-slate-300 hover:text-slate-800"
          >
            自定义分析
          </button>
        </header>

        <RandomPanel
          paistr={randomPaistr}
          baopai={randomBaopai}
          zhuangfeng={randomZhuangfeng}
          menfeng={randomMenfeng}
          xun={randomXun}
          hongpai={randomHongpai}
          includeZi={includeZi}
          error={randomError}
          handRef={setRandomHandEl}
          selected={selected}
          submitted={submitted}
          result={randomResult}
          best={randomBest}
          score={correctCount}
          streak={streak}
          bestStreak={bestStreak}
          lastOutcome={lastOutcome}
          celebrateId={celebrateId}
          onGenerate={handleGenerate}
          onIncludeZiChange={setIncludeZi}
          onToggleSelect={toggleSelect}
          onSubmit={handleSubmit}
          onOpenAnalysis={() => setAnalysisOpen(true)}
        />

        <footer className="text-center text-xs text-slate-500">
          数据来自本地分析引擎，仅用于练习参考。
        </footer>
      </div>
      <FloatingHand paistr={randomPaistr} visible={showFloating} />

      <ManualDrawer
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        onOpenAnalysis={() => setManualAnalysisOpen(true)}
        analysisEnabled={!!result && !error}
      >
        <ManualPanel
          paistr={paistr}
          baopai={baopai}
          zhuangfeng={zhuangfeng}
          menfeng={menfeng}
          xun={xun}
          hongpai={hongpai}
          error={error}
          onPaistrChange={setPaistr}
          onBaopaiChange={setBaopai}
          onZhuangfengChange={setZhuangfeng}
          onMenfengChange={setMenfeng}
          onXunChange={setXun}
          onHongpaiToggle={() => setHongpai((v) => !v)}
        />
      </ManualDrawer>

      {randomResult && (
        <AnalysisModal
          open={analysisOpen && submitted}
          title="分析结果"
          subtitle="对比你的切牌选择与最优解。"
          hand={randomPaistr}
          results={randomResult.results}
          highlight={(discard) => {
            const isBest = randomBest.some((b) => b.discard === discard)
            const isSelected = selected.includes(discard)
            if (isBest && isSelected) return 'both'
            if (isBest) return 'best'
            if (isSelected) return 'picked'
            return 'none'
          }}
          onClose={() => setAnalysisOpen(false)}
          showNext
          onNext={handleGenerate}
        />
      )}

      {result && (
        <AnalysisModal
          open={manualAnalysisOpen}
          title="手动解析"
          subtitle="根据自定义参数生成的分析结果。"
          hand={paistr}
          results={result.results}
          highlight={() => 'none'}
          onClose={() => setManualAnalysisOpen(false)}
        />
      )}
    </div>
  )
}

export default App
