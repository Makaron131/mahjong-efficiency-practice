import type { AnalyzeOutput } from '../analysis'
import { parsePaistr, tileImage } from '../lib/tiles'
import { ResultsTable } from './ResultsTable'

type HighlightState = 'best' | 'picked' | 'both' | 'none'

type AnalysisModalProps = {
  open: boolean
  title: string
  subtitle?: string
  hand?: string
  results: AnalyzeOutput['results']
  highlight: (discard: string) => HighlightState
  onClose: () => void
  showNext?: boolean
  onNext?: () => void
}

export function AnalysisModal({
  open,
  title,
  subtitle,
  hand,
  results,
  highlight,
  onClose,
  showNext = false,
  onNext,
}: AnalysisModalProps) {
  if (!open) return null

  return (
    <>
      {hand && (
        <div className="fixed left-1/2 top-2 z-50 w-full -translate-x-1/2 px-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/60 bg-gradient-to-r from-white/95 via-white/90 to-white/80 px-4 py-2 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/60 backdrop-blur">
            <span className="shrink-0 text-[11px] font-semibold tracking-widest text-slate-400">
              当前手牌
            </span>
            <div className="flex flex-nowrap items-center gap-1">
              {parsePaistr(hand).map((tile, index) => (
                <img
                  key={`${tile}-screen-${index}`}
                  src={tileImage(tile)}
                  alt={tile}
                  className="h-5 w-3.5 sm:h-6 sm:w-4"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 pb-5 pt-12 backdrop-blur-sm">
        <div className="relative flex h-full max-h-[calc(92vh-40px)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <div className="text-base font-semibold text-slate-900">{title}</div>
              {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700"
            >
              关闭
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-3 pt-6">
            <ResultsTable results={results} highlight={highlight} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
            <div className="text-xs text-slate-500">关闭不会清空当前题目，可随时再次打开分析。</div>
            {showNext && (
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow"
              >
                下一题
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
