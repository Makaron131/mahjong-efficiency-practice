import type { AnalyzeOutput } from '../analysis'

type ResultsTableProps = {
  results: AnalyzeOutput['results']
  highlight: (discard: string) => 'best' | 'warn' | 'none'
}

export function ResultsTable({ results, highlight }: ResultsTableProps) {
  return (
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
          {results.map((row) => {
            const state = highlight(row.discard)
            const rowClass =
              state === 'best'
                ? 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-emerald-200/70 bg-emerald-50/60 px-4 py-3 text-sm'
                : state === 'warn'
                  ? 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-yellow-200/70 bg-yellow-50/70 px-4 py-3 text-sm'
                  : 'grid grid-cols-[80px_80px_1fr_80px_100px] gap-3 border-t border-slate-200 px-4 py-3 text-sm hover:bg-slate-50'
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
  )
}
