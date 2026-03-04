export function Hero() {
  return (
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
  )
}
