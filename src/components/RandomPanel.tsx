import type { AnalyzeOutput } from '../analysis'
import { ResultsTable } from './ResultsTable'

type RandomPanelProps = {
  paistr: string
  baopai: string
  zhuangfeng: number
  menfeng: number
  xun: number
  hongpai: boolean
  error: string | null
  selected: string[]
  submitted: boolean
  result: AnalyzeOutput | null
  best: AnalyzeOutput['results']
  onGenerate: () => void
  onBaopaiChange: (value: string) => void
  onZhuangfengChange: (value: number) => void
  onMenfengChange: (value: number) => void
  onXunChange: (value: number) => void
  onHongpaiToggle: () => void
  onToggleSelect: (discard: string) => void
  onSubmit: () => void
}

export function RandomPanel({
  paistr,
  baopai,
  zhuangfeng,
  menfeng,
  xun,
  hongpai,
  error,
  selected,
  submitted,
  result,
  best,
  onGenerate,
  onBaopaiChange,
  onZhuangfengChange,
  onMenfengChange,
  onXunChange,
  onHongpaiToggle,
  onToggleSelect,
  onSubmit,
}: RandomPanelProps) {
  return (
    <>
      <section className="glass rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-800">随机练习</div>
            <div className="text-sm text-slate-500">选择切牌并提交，查看你的判断与最优解差异。</div>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow"
            onClick={onGenerate}
          >
            生成随机手牌
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
          当前手牌：<span className="font-mono">{paistr}</span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm text-slate-500">
            <span>宝牌指示（逗号分隔）</span>
            <input
              value={baopai}
              onChange={(e) => onBaopaiChange(e.target.value)}
              placeholder="s3"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-500">
            <span>场风</span>
            <select
              value={zhuangfeng}
              onChange={(e) => onZhuangfengChange(Number(e.target.value))}
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
              onChange={(e) => onMenfengChange(Number(e.target.value))}
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
              onChange={(e) => onXunChange(Number(e.target.value))}
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
              onClick={onHongpaiToggle}
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
        <div className="text-base font-semibold text-slate-800">请选择切牌（可多选）</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {result?.results.map((row) => (
            <button
              key={row.discard}
              type="button"
              onClick={() => onToggleSelect(row.discard)}
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
            onClick={onSubmit}
            disabled={!selected.length}
          >
            提交切牌
          </button>
          <div className="text-sm text-slate-500">
            已选择：{selected.length ? selected.join(' / ') : '暂无'}
          </div>
        </div>
      </section>

      {submitted && result && (
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
          <div className="text-base font-semibold text-slate-800">分析结果</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-widest text-slate-400">推荐切牌</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {best.length ? best.map((b) => b.discard).join(' / ') : '--'}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-widest text-slate-400">你的选择</div>
              <div className="mt-2 text-sm font-semibold text-slate-700">
                {selected.length ? selected.join(' / ') : '--'}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs uppercase tracking-widest text-slate-400">最优进张</div>
              <div className="mt-2 text-sm font-semibold text-emerald-700">
                {best.length ? best[0].tingpai.join(' ') : '--'}
              </div>
            </div>
          </div>

          <ResultsTable
            results={result.results}
            highlight={(discard) => {
              if (!selected.includes(discard)) return 'none'
              return best.find((b) => b.discard === discard) ? 'best' : 'warn'
            }}
          />

          {selected.some((s) => !result.results.find((r) => r.discard === s)) && (
            <div className="mt-4 text-sm font-semibold text-rose-600">
              你选择了非候选切牌：{' '}
              {selected.filter((s) => !result.results.find((r) => r.discard === s)).join(' / ')}
            </div>
          )}
        </section>
      )}
    </>
  )
}
