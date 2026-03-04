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
    <section className="glass rounded-3xl p-6">
      <div className="text-base font-semibold text-slate-800">
        手牌输入（自查）
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-slate-500">
          <span>手牌（14张）</span>
          <input
            value={paistr}
            onChange={(e) => onPaistrChange(e.target.value)}
            placeholder="m123p123789s338s88"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </label>
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
  )
}
