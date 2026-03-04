import { useMemo, useState } from 'react'
import { analyzeEfficiency } from './analysis'

function App() {
  const [paistr, setPaistr] = useState('m123p123789s338s88')
  const [baopai, setBaopai] = useState('s3')
  const [zhuangfeng, setZhuangfeng] = useState(0)
  const [menfeng, setMenfeng] = useState(0)
  const [xun, setXun] = useState(5)
  const [hongpai, setHongpai] = useState(true)
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

        <section className="glass rounded-3xl p-6">
          <div className="text-base font-semibold text-slate-800">手牌输入</div>
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
          <div className="text-base font-semibold text-slate-800">分析结果</div>
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

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
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
        </section>

        <footer className="text-center text-xs text-slate-500">
          数据来自本地分析引擎，仅用于练习参考。
        </footer>
      </div>
    </div>
  )
}

export default App
