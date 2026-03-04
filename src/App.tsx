import { useMemo, useState } from 'react'
import { analyzeEfficiency } from './analysis'

type Mode = 'manual' | 'random'

const SUITS = ['m', 'p', 's', 'z'] as const

function buildPaistrFromTiles(tiles: string[]) {
  const grouped: Record<string, number[]> = { m: [], p: [], s: [], z: [] }
  for (const t of tiles) {
    grouped[t[0]].push(Number(t[1]))
  }
  let out = ''
  for (const suit of SUITS) {
    const nums = grouped[suit].sort((a, b) => a - b)
    if (!nums.length) continue
    out += suit + nums.join('')
  }
  return out
}

function randomHand() {
  const tiles: string[] = []
  for (const s of ['m', 'p', 's']) {
    for (let n = 1; n <= 9; n += 1) {
      for (let i = 0; i < 4; i += 1) tiles.push(`${s}${n}`)
    }
  }
  for (let n = 1; n <= 7; n += 1) {
    for (let i = 0; i < 4; i += 1) tiles.push(`z${n}`)
  }

  const pick: string[] = []
  for (let i = 0; i < 14; i += 1) {
    const idx = Math.floor(Math.random() * tiles.length)
    pick.push(tiles.splice(idx, 1)[0])
  }
  return buildPaistrFromTiles(pick)
}

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
  }, [
    randomBaopai,
    randomHongpai,
    randomMenfeng,
    randomPaistr,
    randomXun,
    randomZhuangfeng,
  ])

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
      prev.includes(discard)
        ? prev.filter((d) => d !== discard)
        : [...prev, discard],
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-20 pt-12">
        <header className="glass relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-white/80 p-8 shadow-soft">
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Mahjong Efficiency Lab
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            何切分析 · 手牌效率练习
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            输入手牌，立即获得最优切牌与进张信息。支持赤牌、巡目与宝牌指示。
          </p>
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        </header>

        <nav className="flex flex-wrap gap-2">
          <button
            type="button"
            className={
              mode === 'manual'
                ? 'rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow'
                : 'rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600'
            }
            onClick={() => setMode('manual')}
          >
            手动输入
          </button>
          <button
            type="button"
            className={
              mode === 'random'
                ? 'rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow'
                : 'rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600'
            }
            onClick={() => setMode('random')}
          >
            随机练习
          </button>
        </nav>

        {mode === 'manual' && (
          <>
            <section className="glass rounded-3xl p-6">
              <div className="text-base font-semibold text-slate-800">
                手牌输入（自查）
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>手牌（14张）</span>
                  <input
                    value={paistr}
                    onChange={(e) => setPaistr(e.target.value)}
                    placeholder="m123p123789s338s88"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>宝牌指示（逗号分隔）</span>
                  <input
                    value={baopai}
                    onChange={(e) => setBaopai(e.target.value)}
                    placeholder="s3"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>场风</span>
                  <select
                    value={zhuangfeng}
                    onChange={(e) => setZhuangfeng(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value={0}>东场</option>
                    <option value={1}>南场</option>
                    <option value={2}>西场</option>
                    <option value={3}>北场</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>自风</span>
                  <select
                    value={menfeng}
                    onChange={(e) => setMenfeng(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value={0}>东家</option>
                    <option value={1}>南家</option>
                    <option value={2}>西家</option>
                    <option value={3}>北家</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>巡目</span>
                  <input
                    type="number"
                    min={1}
                    max={18}
                    value={xun}
                    onChange={(e) => setXun(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <span>赤牌</span>
                  <button
                    type="button"
                    className={
                      hongpai
                        ? 'rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow'
                        : 'rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500'
                    }
                    onClick={() => setHongpai((v) => !v)}
                  >
                    {hongpai ? '启用' : '关闭'}
                  </button>
                </label>
              </div>
              {error && (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  解析失败：{error}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
              <div className="text-base font-semibold text-slate-800">
                分析结果
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-widest text-slate-400">
                    候选切牌
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {result ? result.results.length : '--'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-widest text-slate-400">
                    推荐切牌
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {best.length
                      ? best.map((b) => b.discard).join(' / ')
                      : '--'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-widest text-slate-400">
                    进张信息
                  </div>
                  <div className="mt-2 text-sm font-semibold text-emerald-700">
                    {best.length ? best[0].tingpai.join(' ') : '--'}
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
                <div className="min-w-[520px]">
                  <div className="grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <span>切牌</span>
                    <span>向听</span>
                    <span>进张</span>
                    <span>枚数</span>
                    <span>评价</span>
                  </div>
                  <div>
                    {result?.results.map((row) => (
                      <div
                        key={row.discard}
                        className={
                          best.find((b) => b.discard === row.discard)
                            ? 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-emerald-200/70 bg-emerald-50/60 px-4 py-3 text-sm'
                            : 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-slate-200 px-4 py-3 text-sm hover:bg-slate-50'
                        }
                      >
                        <span className="font-mono">{row.discard}</span>
                        <span>{row.xiangting}</span>
                        <span className="font-semibold text-emerald-700">
                          {row.tingpai.join(' ')}
                        </span>
                        <span>{row.n_tingpai}</span>
                        <span>{row.ev == null ? '--' : row.ev.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {mode === 'random' && (
          <>
            <section className="glass rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-800">
                    随机练习
                  </div>
                  <div className="text-sm text-slate-500">
                    选择切牌并提交，查看你的判断与最优解差异。
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow"
                  onClick={handleGenerate}
                >
                  生成随机手牌
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
                当前手牌：<span className="font-mono">{randomPaistr}</span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>宝牌指示（逗号分隔）</span>
                  <input
                    value={randomBaopai}
                    onChange={(e) => setRandomBaopai(e.target.value)}
                    placeholder="s3"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>场风</span>
                  <select
                    value={randomZhuangfeng}
                    onChange={(e) => setRandomZhuangfeng(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value={0}>东场</option>
                    <option value={1}>南场</option>
                    <option value={2}>西场</option>
                    <option value={3}>北场</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>自风</span>
                  <select
                    value={randomMenfeng}
                    onChange={(e) => setRandomMenfeng(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value={0}>东家</option>
                    <option value={1}>南家</option>
                    <option value={2}>西家</option>
                    <option value={3}>北家</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-500">
                  <span>巡目</span>
                  <input
                    type="number"
                    min={1}
                    max={18}
                    value={randomXun}
                    onChange={(e) => setRandomXun(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <span>赤牌</span>
                  <button
                    type="button"
                    className={
                      randomHongpai
                        ? 'rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow'
                        : 'rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500'
                    }
                    onClick={() => setRandomHongpai((v) => !v)}
                  >
                    {randomHongpai ? '启用' : '关闭'}
                  </button>
                </label>
              </div>

              {randomError && (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  解析失败：{randomError}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
              <div className="text-base font-semibold text-slate-800">
                请选择切牌（可多选）
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {randomResult?.results.map((row) => (
                  <button
                    key={row.discard}
                    type="button"
                    onClick={() => toggleSelect(row.discard)}
                    className={
                      selected.includes(row.discard)
                        ? 'rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'
                        : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-200'
                    }
                  >
                    {row.discard}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-emerald-300"
                  onClick={handleSubmit}
                  disabled={!selected.length}
                >
                  提交切牌
                </button>
                <div className="text-sm text-slate-500">
                  已选择：{selected.length ? selected.join(' / ') : '暂无'}
                </div>
              </div>
            </section>

            {submitted && randomResult && (
              <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
                <div className="text-base font-semibold text-slate-800">
                  分析结果
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      推荐切牌
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">
                      {randomBest.length
                        ? randomBest.map((b) => b.discard).join(' / ')
                        : '--'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      你的选择
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-700">
                      {selected.length ? selected.join(' / ') : '--'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      最优进张
                    </div>
                    <div className="mt-2 text-sm font-semibold text-emerald-700">
                      {randomBest.length ? randomBest[0].tingpai.join(' ') : '--'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
                  <div className="min-w-[520px]">
                    <div className="grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                      <span>切牌</span>
                      <span>向听</span>
                      <span>进张</span>
                      <span>枚数</span>
                      <span>评价</span>
                    </div>
                    <div>
                      {randomResult.results.map((row) => {
                        const isSelected = selected.includes(row.discard)
                        const isBest = randomBest.find(
                          (b) => b.discard === row.discard,
                        )
                        const rowClass = isSelected
                          ? isBest
                            ? 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-sm'
                            : 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-yellow-200/70 bg-yellow-50/70 px-4 py-3 text-sm'
                          : 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-slate-200 px-4 py-3 text-sm'
                        return (
                          <div key={row.discard} className={rowClass}>
                            <span className="font-mono">{row.discard}</span>
                            <span>{row.xiangting}</span>
                            <span className="font-semibold text-emerald-700">
                              {row.tingpai.join(' ')}
                            </span>
                            <span>{row.n_tingpai}</span>
                            <span>{row.ev == null ? '--' : row.ev.toFixed(2)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {selected.some(
                  (s) => !randomResult.results.find((r) => r.discard === s),
                ) && (
                  <div className="mt-4 text-sm font-semibold text-rose-600">
                    你选择了非候选切牌：{' '}
                    {selected
                      .filter(
                        (s) =>
                          !randomResult.results.find((r) => r.discard === s),
                      )
                      .join(' / ')}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <footer className="text-center text-xs text-slate-500">
          数据来自本地分析引擎，仅用于练习参考。
        </footer>
      </div>
    </div>
  )
}

export default App
