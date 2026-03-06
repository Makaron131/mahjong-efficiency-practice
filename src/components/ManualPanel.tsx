import { parsePaistr, tileImage } from '../lib/tiles'

type ManualPanelProps = {
  paistr: string
  baopai: string
  zhuangfeng: number
  menfeng: number
  xun: number
  hongpai: boolean
  error: string | null
  onPaistrChange: (value: string) => void
  onBaopaiChange: (value: string) => void
  onZhuangfengChange: (value: number) => void
  onMenfengChange: (value: number) => void
  onXunChange: (value: number) => void
  onHongpaiToggle: () => void
}

export function ManualPanel({
  paistr,
  baopai,
  zhuangfeng,
  menfeng,
  xun,
  hongpai,
  error,
  onPaistrChange,
  onBaopaiChange,
  onZhuangfengChange,
  onMenfengChange,
  onXunChange,
  onHongpaiToggle,
}: ManualPanelProps) {
  return (
    <section className="glass rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">手牌输入</div>
          <div className="text-xs text-slate-500">编辑参数并即时查看切牌分析。</div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-2 text-xs text-slate-700">
        <div className="flex flex-wrap items-center gap-1">
          {parsePaistr(paistr).map((tile, index) => (
            <img key={`${tile}-${index}`} src={tileImage(tile)} alt={tile} className="h-8 w-6" />
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span>手牌（14张）</span>
          <input
            value={paistr}
            onChange={(e) => onPaistrChange(e.target.value)}
            placeholder="m123p123789s338s88"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span>宝牌指示（逗号分隔）</span>
          <input
            value={baopai}
            onChange={(e) => onBaopaiChange(e.target.value)}
            placeholder="s3"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span>场风</span>
          <select
            value={zhuangfeng}
            onChange={(e) => onZhuangfengChange(Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <option value={0}>东场</option>
            <option value={1}>南场</option>
            <option value={2}>西场</option>
            <option value={3}>北场</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span>自风</span>
          <select
            value={menfeng}
            onChange={(e) => onMenfengChange(Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <option value={0}>东家</option>
            <option value={1}>南家</option>
            <option value={2}>西家</option>
            <option value={3}>北家</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span>巡目</span>
          <input
            type="number"
            min={1}
            max={18}
            value={xun}
            onChange={(e) => onXunChange(Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span>赤牌</span>
          <button
            type="button"
            className={
              hongpai
                ? 'flex h-11 w-full items-center justify-between rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white shadow'
                : 'flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-500'
            }
            onClick={onHongpaiToggle}
          >
            <span>当前：{hongpai ? '开启' : '关闭'}</span>
            <span className={hongpai ? 'text-emerald-50' : 'text-slate-400'}>点击切换</span>
          </button>
        </label>
      </div>
      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          解析失败：{error}
        </div>
      )}
    </section>
  )
}
