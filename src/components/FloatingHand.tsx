import { parsePaistr, tileImage } from '../lib/tiles'

type FloatingHandProps = {
  paistr: string
  visible: boolean
}

export function FloatingHand({ paistr, visible }: FloatingHandProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 ease-out">
      <div className="w-full max-w-3xl animate-[floatIn_280ms_ease-out] rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-slate-200 backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            当前手牌
          </span>
          <span className="text-[11px] text-slate-400">浮动预览</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {parsePaistr(paistr).map((tile, index) => (
            <img key={`${tile}-${index}`} src={tileImage(tile)} alt={tile} className="h-7 w-5" />
          ))}
        </div>
      </div>
    </div>
  )
}
