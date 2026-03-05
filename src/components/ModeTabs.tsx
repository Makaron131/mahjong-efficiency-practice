type Mode = 'manual' | 'random'

type ModeTabsProps = {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <nav className="inline-flex w-full max-w-xs rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-slate-200/70">
      <button
        type="button"
        className={
          mode === 'manual'
            ? 'flex-1 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white'
            : 'flex-1 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600'
        }
        onClick={() => onChange('manual')}
      >
        手动输入
      </button>
      <button
        type="button"
        className={
          mode === 'random'
            ? 'flex-1 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white'
            : 'flex-1 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600'
        }
        onClick={() => onChange('random')}
      >
        随机练习
      </button>
    </nav>
  )
}
