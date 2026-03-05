import { useEffect, useMemo, useState } from 'react'
import { analyzeEfficiency } from './analysis'
import { FloatingHand } from './components/FloatingHand'
import { Hero } from './components/Hero'
import { ManualPanel } from './components/ManualPanel'
import { ManualResults } from './components/ManualResults'
import { ModeTabs } from './components/ModeTabs'
import { RandomPanel } from './components/RandomPanel'
import { randomHand, randomTile } from './lib/hand'

type Mode = 'manual' | 'random'

function App() {
  const [mode, setMode] = useState<Mode>('manual')
  const [isHandVisible, setIsHandVisible] = useState(true)
  const [manualHandEl, setManualHandEl] = useState<HTMLDivElement | null>(null)
  const [randomHandEl, setRandomHandEl] = useState<HTMLDivElement | null>(null)

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

  const best = useMemo(() => {
    if (!result) return []
    let max = Number.NEGATIVE_INFINITY
    for (const row of result.results) {
      if (row.ev == null) continue
      if (row.ev > max) max = row.ev
    }
    if (!Number.isFinite(max)) return []
    return result.results.filter((r) => r.ev === max)
  }, [result])

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
    setRandomPaistr(randomHand(includeZi))
    setRandomBaopai(randomTile())
    setRandomZhuangfeng(Math.floor(Math.random() * 4))
    setRandomMenfeng(Math.floor(Math.random() * 4))
    setSelected([])
    setSubmitted(false)
    setAnalysisOpen(false)
  }

  const toggleSelect = (discard: string) => {
    setSelected((prev) =>
      prev.includes(discard) ? prev.filter((d) => d !== discard) : [...prev, discard],
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setAnalysisOpen(true)
  }

  useEffect(() => {
    const target = mode === 'manual' ? manualHandEl : randomHandEl
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
  }, [mode, manualHandEl, randomHandEl])

  const showFloating = !!(mode === 'manual' ? manualHandEl : randomHandEl) && !isHandVisible

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-indigo-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-4 sm:pt-6">
        <Hero />
        <ModeTabs mode={mode} onChange={setMode} />

        {mode === 'manual' && (
          <>
            <ManualPanel
              paistr={paistr}
              baopai={baopai}
              zhuangfeng={zhuangfeng}
              menfeng={menfeng}
              xun={xun}
              hongpai={hongpai}
              error={error}
              handRef={setManualHandEl}
              onPaistrChange={setPaistr}
              onBaopaiChange={setBaopai}
              onZhuangfengChange={setZhuangfeng}
              onMenfengChange={setMenfeng}
              onXunChange={setXun}
              onHongpaiToggle={() => setHongpai((v) => !v)}
            />
            <ManualResults result={result} best={best} />
          </>
        )}

        {mode === 'random' && (
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
            analysisOpen={analysisOpen}
            onGenerate={handleGenerate}
            onIncludeZiChange={setIncludeZi}
            onToggleSelect={toggleSelect}
            onSubmit={handleSubmit}
            onOpenAnalysis={() => setAnalysisOpen(true)}
            onCloseAnalysis={() => setAnalysisOpen(false)}
          />
        )}

        <footer className="text-center text-xs text-slate-500">
          数据来自本地分析引擎，仅用于练习参考。
        </footer>
      </div>
      <FloatingHand paistr={mode === 'manual' ? paistr : randomPaistr} visible={showFloating} />
    </div>
  )
}

export default App
