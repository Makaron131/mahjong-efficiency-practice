type Mode = 'manual' | 'random'

type ModeTabsProps = {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      <button
        type="button"
        className={
          mode === 'manual'
            ? 'rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow'
            : 'rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600'
        }
        onClick={() => onChange('manual')}
      >
        手动输入
      </button>
      <button
        type="button"
        className={
          mode === 'random'
            ? 'rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow'
            : 'rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600'
        }
        onClick={() => onChange('random')}
      >
        随机练习
      </button>
    </nav>
  )
}
