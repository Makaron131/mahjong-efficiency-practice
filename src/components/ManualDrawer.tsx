import type { ReactNode } from 'react'

type ManualDrawerProps = {
  open: boolean
  onClose: () => void
  onOpenAnalysis: () => void
  analysisEnabled: boolean
  children: ReactNode
}

export function ManualDrawer({
  open,
  onClose,
  onOpenAnalysis,
  analysisEnabled,
  children,
}: ManualDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[90vh] w-full max-w-2xl rounded-t-3xl bg-white shadow-2xl sm:inset-y-6 sm:right-6 sm:left-auto sm:max-h-none sm:w-[420px] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">自定义分析</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:border-rose-300 hover:text-rose-700"
          >
            关闭
          </button>
        </div>
        <div className="max-h-[calc(90vh-112px)] overflow-y-auto px-4 py-4 sm:max-h-none">
          {children}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-4 py-3">
          <span className="text-xs text-slate-500">解析结果会在弹窗中展示。</span>
          <button
            type="button"
            onClick={onOpenAnalysis}
            disabled={!analysisEnabled}
            className="ml-auto rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            查看解析
          </button>
        </div>
      </div>
    </div>
  )
}
