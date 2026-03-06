import type { AnalyzeOutput } from '../analysis'
import type { Ref } from 'react'
import { doraFromIndicator, parsePaistr, tileImage } from '../lib/tiles'

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
  score: number
  streak: number
  bestStreak: number
  lastOutcome: 'best' | 'picked' | 'miss' | null
  celebrateId: number
  onGenerate: () => void
  onIncludeZiChange: (value: boolean) => void
  onToggleSelect: (discard: string) => void
  onSubmit: () => void
  onOpenAnalysis: () => void
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
  score,
  streak,
  bestStreak,
  lastOutcome,
  celebrateId,
  onGenerate,
  onIncludeZiChange,
  onToggleSelect,
  onSubmit,
  onOpenAnalysis,
}: RandomPanelProps) {
  const outcomeLabel =
    lastOutcome === 'best' ? '正确' : lastOutcome === 'miss' ? '错误' : '等待提交'

  const outcomeTone =
    lastOutcome === 'best'
      ? 'text-emerald-600'
      : lastOutcome === 'miss'
        ? 'text-rose-600'
        : 'text-slate-400'

  return (
    <>
      <section className="glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800">何切</div>
            <div className="text-xs text-slate-500">选择切牌并提交，开始连胜挑战。</div>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow"
            onClick={onGenerate}
          >
            换牌
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200/70">
            <span className="text-slate-400">正确</span>
            <span className="text-sm font-semibold text-slate-900">{score}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200/70">
            <span className="text-slate-400">连对</span>
            <span className="text-sm font-semibold text-slate-900">{streak}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200/70">
            <span className="text-slate-400">最高连对</span>
            <span className="text-sm font-semibold text-slate-900">{bestStreak}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200/70">
            <span className="text-slate-400">本题</span>
            <span
              key={lastOutcome === 'best' ? celebrateId : 'idle'}
              className={`text-sm font-semibold ${outcomeTone} ${
                lastOutcome === 'best' ? 'animate-success-pop' : ''
              }`}
            >
              {outcomeLabel}
            </span>
          </div>
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
                {hongpai ? '无赤' : '有赤'}
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
        {!submitted ? (
          <>
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
          </>
        ) : (
          <>
            <div className="text-sm font-semibold text-slate-800">你的选择</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-400">你的选择</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selected.length ? (
                    selected.map((s) => (
                      <img key={s} src={tileImage(s)} alt={s} className="h-8 w-6" />
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">暂无</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-400">最优切牌</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {best.length ? (
                    best.map((b) => (
                      <img
                        key={b.discard}
                        src={tileImage(b.discard)}
                        alt={b.discard}
                        className="h-8 w-6"
                      />
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">暂无</span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

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
          {!submitted && (
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
          )}
        </div>
      </section>
    </>
  )
}
