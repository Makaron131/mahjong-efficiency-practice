export function Hero() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-emerald-100/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
          切
        </span>
        <div>
          <div className="text-base font-semibold text-slate-900">何切练习</div>
          <div className="text-xs text-slate-500">快速判断 · 随机练习</div>
        </div>
      </div>
      <div className="hidden text-xs text-slate-400 sm:block">Mahjong Efficiency Lab</div>
    </header>
  )
}
