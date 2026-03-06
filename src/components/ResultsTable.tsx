import type { AnalyzeOutput } from '../analysis'
import { tileImage } from '../lib/tiles'

type ResultsTableProps = {
  results: AnalyzeOutput['results']
  highlight: (discard: string) => 'best' | 'picked' | 'both' | 'none'
}

export function ResultsTable({ results, highlight }: ResultsTableProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
      <div>
        <div className="grid grid-cols-[52px_44px_minmax(0,1fr)_48px] gap-2 bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500 sm:grid-cols-[52px_44px_minmax(0,1fr)_48px_56px]">
          <span>切牌</span>
          <span>向听</span>
          <span>进张</span>
          <span>枚数</span>
          <span className="hidden sm:inline">评价</span>
        </div>
        <div>
          {results.map((row) => {
            const state = highlight(row.discard)
            const rowClass =
              state === 'both'
                ? 'grid grid-cols-[52px_44px_minmax(0,1fr)_48px] gap-2 border-t border-emerald-300/80 bg-emerald-100/80 px-3 py-2 text-sm sm:grid-cols-[52px_44px_minmax(0,1fr)_48px_56px]'
                : state === 'best'
                  ? 'grid grid-cols-[52px_44px_minmax(0,1fr)_48px] gap-2 border-t border-sky-300/80 bg-sky-100/80 px-3 py-2 text-sm sm:grid-cols-[52px_44px_minmax(0,1fr)_48px_56px]'
                  : state === 'picked'
                    ? 'grid grid-cols-[52px_44px_minmax(0,1fr)_48px] gap-2 border-t border-amber-300/80 bg-amber-100/80 px-3 py-2 text-sm sm:grid-cols-[52px_44px_minmax(0,1fr)_48px_56px]'
                    : 'grid grid-cols-[52px_44px_minmax(0,1fr)_48px] gap-2 border-t border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 sm:grid-cols-[52px_44px_minmax(0,1fr)_48px_56px]'
            return (
              <div key={row.discard} className={rowClass}>
                <span>
                  <img src={tileImage(row.discard)} alt={row.discard} className="h-7 w-5" />
                </span>
                <span>{row.xiangting}</span>
                <span className="flex flex-wrap gap-1">
                  {row.tingpai.map((t) => (
                    <img key={t} src={tileImage(t)} alt={t} className="h-7 w-5" />
                  ))}
                </span>
                <span>{row.n_tingpai}</span>
                <span className="hidden sm:inline">
                  {row.ev == null ? '--' : row.ev.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
