import type { AnalyzeOutput } from '../analysis'
import type { Ref } from 'react'
import { useEffect, useRef, useState } from 'react'
import { doraFromIndicator, parsePaistr, tileImage } from '../lib/tiles'
import { ResultsTable } from './ResultsTable'

function windLabel(value: number) {
  return ['东', '南', '西', '北'][value] ?? '--'
}

type RandomPanelProps = {
  paistr: string
  baopai: string
  zhuangfeng: number
  menfeng: number
  xun: number
  hongpai: boolean
  includeZi: boolean
  error: string | null
  handRef?: Ref<HTMLDivElement>
  selected: string[]
  submitted: boolean
  result: AnalyzeOutput | null
  best: AnalyzeOutput['results']
  analysisOpen: boolean
  onGenerate: () => void
  onIncludeZiChange: (value: boolean) => void
  onToggleSelect: (discard: string) => void
  onSubmit: () => void
  onOpenAnalysis: () => void
  onCloseAnalysis: () => void
}

export function RandomPanel({
  paistr,
  baopai,
  zhuangfeng,
  menfeng,
  xun,
  hongpai,
  includeZi,
  error,
  handRef,
  selected,
  submitted,
  result,
  best,
  analysisOpen,
  onGenerate,
  onIncludeZiChange,
  onToggleSelect,
  onSubmit,
  onOpenAnalysis,
  onCloseAnalysis,
}: RandomPanelProps) {
  const modalScrollRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [isTableVisible, setIsTableVisible] = useState(false)

  useEffect(() => {
    if (!analysisOpen) return
    const target = tableRef.current
    const root = modalScrollRef.current
    if (!target || !root) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsTableVisible(entry.isIntersecting)
      },
      { threshold: 0.2, root },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [analysisOpen])

  const showModalHand = analysisOpen && isTableVisible

  return (
    <>
      <section className="glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800">随机练习</div>
            <div className="text-xs text-slate-500">选择切牌并提交，查看你的判断与最优解差异。</div>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow"
            onClick={onGenerate}
          >
            生成随机手牌
          </button>
        </div>

        <div
          ref={handRef}
          className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-2 text-xs text-slate-700"
        >
          <div className="flex flex-wrap items-center gap-1">
            {parsePaistr(paistr).map((tile, index) => (
              <img key={`${tile}-${index}`} src={tileImage(tile)} alt={tile} className="h-8 w-6" />
            ))}
          </div>
        </div>

        <div className="mt-2 grid gap-2 text-[11px] text-slate-500 sm:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200/70">
              <span className="text-slate-400">宝牌</span>
              {baopai
                .split(/[,\s]+/)
                .filter(Boolean)
                .map((tile) => doraFromIndicator(tile))
                .map((tile) => (
                  <img
                    key={tile}
                    src={tileImage(tile)}
                    alt={tile}
                    className="h-6 w-4 object-contain"
                  />
                ))}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200/70">
              <span className="text-slate-400">场</span>
              <img
                src={tileImage(`z${zhuangfeng + 1}`)}
                alt={`z${zhuangfeng + 1}`}
                className="h-5 w-3.5"
              />
              <span className="text-slate-600">{windLabel(zhuangfeng)}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200/70">
              <span className="text-slate-400">自</span>
              <img
                src={tileImage(`z${menfeng + 1}`)}
                alt={`z${menfeng + 1}`}
                className="h-5 w-3.5"
              />
              <span className="text-slate-600">{windLabel(menfeng)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200/70">
              <span className="text-slate-400">{xun}巡</span>
              <span className={hongpai ? 'text-emerald-700' : 'text-slate-400'}>
                {hongpai ? '赤开' : '赤关'}
              </span>
            </div>
          </div>
          <label className="flex items-center gap-2 justify-self-start rounded-full bg-white/80 px-2.5 py-1 ring-1 ring-slate-200/70 sm:justify-self-end">
            <input
              type="checkbox"
              checked={includeZi}
              onChange={(e) => onIncludeZiChange(e.target.checked)}
              className="h-3 w-3 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
            />
            生成字牌
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            解析失败：{error}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-soft">
        <div className="text-sm font-semibold text-slate-800">请选择切牌（可多选）</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {result?.results.map((row) => (
            <button
              key={row.discard}
              type="button"
              onClick={() => onToggleSelect(row.discard)}
              className={
                selected.includes(row.discard)
                  ? 'rounded-lg p-2 ring-2 ring-emerald-500/80'
                  : 'rounded-lg p-2 opacity-90 hover:opacity-100'
              }
              aria-pressed={selected.includes(row.discard)}
            >
              <img
                src={tileImage(row.discard)}
                alt={row.discard}
                className={
                  selected.includes(row.discard)
                    ? 'h-7 w-5 drop-shadow-[0_0_12px_rgba(16,185,129,0.75)]'
                    : 'h-7 w-5'
                }
              />
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            onClick={onSubmit}
            disabled={!selected.length || submitted}
          >
            提交切牌
          </button>
          {submitted && (
            <button
              type="button"
              onClick={onOpenAnalysis}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300 hover:text-slate-800"
            >
              查看分析
            </button>
          )}
          <div className="flex min-h-[28px] items-center text-xs text-slate-500">
            已选择：
            {selected.length ? (
              <span className="ml-1 inline-flex flex-wrap gap-1">
                {selected.map((s) => (
                  <img key={s} src={tileImage(s)} alt={s} className="h-7 w-5 object-contain" />
                ))}
              </span>
            ) : (
              <span className="ml-1">暂无</span>
            )}
          </div>
        </div>
      </section>

      {analysisOpen && submitted && result && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-base font-semibold text-slate-900">分析结果</div>
                <div className="text-xs text-slate-500">对比你的切牌选择与最优解。</div>
              </div>
              <button
                type="button"
                onClick={onCloseAnalysis}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700"
              >
                关闭
              </button>
            </div>

            <div ref={modalScrollRef} className="flex-1 overflow-y-auto px-5 py-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-xs uppercase tracking-widest text-slate-400">当前手牌</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {parsePaistr(paistr).map((tile, index) => (
                    <img
                      key={`${tile}-modal-${index}`}
                      src={tileImage(tile)}
                      alt={tile}
                      className="h-7 w-5"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-xs uppercase tracking-widest text-slate-400">推荐切牌</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {best.length ? (
                      <div className="flex flex-wrap gap-1">
                        {best.map((b) => (
                          <img
                            key={b.discard}
                            src={tileImage(b.discard)}
                            alt={b.discard}
                            className="h-7 w-5"
                          />
                        ))}
                      </div>
                    ) : (
                      '--'
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="text-xs uppercase tracking-widest text-slate-400">你的选择</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {selected.length ? (
                      <div className="flex flex-wrap gap-1">
                        {selected.map((s) => (
                          <img key={s} src={tileImage(s)} alt={s} className="h-7 w-5" />
                        ))}
                      </div>
                    ) : (
                      '--'
                    )}
                  </div>
                </div>
              </div>

              <div ref={tableRef} className="mt-4">
                {showModalHand && (
                  <div className="sticky top-2 z-10 mb-2 flex justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] text-slate-500 shadow-sm backdrop-blur">
                      <span className="text-slate-400">手牌</span>
                      <div className="flex items-center gap-1">
                        {parsePaistr(paistr)
                          .slice(0, 10)
                          .map((tile, index) => (
                            <img
                              key={`${tile}-float-${index}`}
                              src={tileImage(tile)}
                              alt={tile}
                              className="h-6 w-4"
                            />
                          ))}
                        {parsePaistr(paistr).length > 10 && (
                          <span className="ml-1 text-slate-400">
                            +{parsePaistr(paistr).length - 10}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <ResultsTable
                  results={result.results}
                  highlight={(discard) => {
                    if (!selected.includes(discard)) return 'none'
                    return best.find((b) => b.discard === discard) ? 'best' : 'warn'
                  }}
                />
              </div>

              {selected.some((s) => !result.results.find((r) => r.discard === s)) && (
                <div className="mt-4 text-sm font-semibold text-rose-600">
                  你选择了非候选切牌：{' '}
                  <span className="inline-flex flex-wrap gap-1">
                    {selected
                      .filter((s) => !result.results.find((r) => r.discard === s))
                      .map((s) => (
                        <img key={s} src={tileImage(s)} alt={s} className="h-7 w-5" />
                      ))}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
              <div className="text-xs text-slate-500">
                关闭不会清空当前题目，可随时再次打开分析。
              </div>
              <button
                type="button"
                onClick={onGenerate}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow"
              >
                下一题
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
