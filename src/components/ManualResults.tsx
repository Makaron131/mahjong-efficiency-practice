import type { AnalyzeOutput } from '../analysis'
import { ResultsTable } from './ResultsTable'

type ManualResultsProps = {
  result: AnalyzeOutput | null
  best: AnalyzeOutput['results']
}

export function ManualResults({ result, best }: ManualResultsProps) {
  return (
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
            {best.length ? best.map((b) => b.discard).join(' / ') : '--'}
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

      {result && (
        <ResultsTable
          results={result.results}
          highlight={(discard) =>
            best.find((b) => b.discard === discard) ? 'best' : 'none'
          }
        />
      )}
    </section>
  )
}
