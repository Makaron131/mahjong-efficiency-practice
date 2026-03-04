import { useMemo, useState } from 'react'
import { analyzeEfficiency } from './analysis'
import { Hero } from './components/Hero'
import { ManualPanel } from './components/ManualPanel'
import { ManualResults } from './components/ManualResults'
import { ModeTabs } from './components/ModeTabs'
import { RandomPanel } from './components/RandomPanel'
import { randomHand } from './lib/hand'

type Mode = 'manual' | 'random'

function App() {
  const [mode, setMode] = useState<Mode>('manual')

  const [paistr, setPaistr] = useState('m123p123789s338s88')
  const [baopai, setBaopai] = useState('s3')
  const [zhuangfeng, setZhuangfeng] = useState(0)
  const [menfeng, setMenfeng] = useState(0)
  const [xun, setXun] = useState(5)
  const [hongpai, setHongpai] = useState(true)

  const [randomPaistr, setRandomPaistr] = useState(() => randomHand())
  const [randomBaopai, setRandomBaopai] = useState('s3')
  const [randomZhuangfeng, setRandomZhuangfeng] = useState(0)
  const [randomMenfeng, setRandomMenfeng] = useState(0)
  const [randomXun, setRandomXun] = useState(5)
  const [randomHongpai, setRandomHongpai] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

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
    setRandomPaistr(randomHand())
    setSelected([])
    setSubmitted(false)
  }

  const toggleSelect = (discard: string) => {
    setSelected((prev) =>
      prev.includes(discard) ? prev.filter((d) => d !== discard) : [...prev, discard],
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-cyan-50 to-indigo-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-20 pt-12">
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
            error={randomError}
            selected={selected}
            submitted={submitted}
            result={randomResult}
            best={randomBest}
            onGenerate={handleGenerate}
            onBaopaiChange={setRandomBaopai}
            onZhuangfengChange={setRandomZhuangfeng}
            onMenfengChange={setRandomMenfeng}
            onXunChange={setRandomXun}
            onHongpaiToggle={() => setRandomHongpai((v) => !v)}
            onToggleSelect={toggleSelect}
            onSubmit={handleSubmit}
          />
        )}

        <footer className="text-center text-xs text-slate-500">
          数据来自本地分析引擎，仅用于练习参考。
        </footer>
      </div>
    </div>
  )
}

export default App
