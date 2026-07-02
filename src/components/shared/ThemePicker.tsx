import { cn } from '@/lib/utils'
import { useTheme, type ThemeName } from '@/hooks/useTheme'

interface ThemeOption {
  name: ThemeName
  label: string
  emoji: string
  previewClass: string
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    name: 'cheerful',
    label: 'Cheerful',
    emoji: '🌟',
    previewClass: 'bg-orange-100 border-orange-300',
  },
  {
    name: 'calming',
    label: 'Calming',
    emoji: '🌊',
    previewClass: 'bg-sky-100 border-sky-300',
  },
  {
    name: 'bright',
    label: 'Bright',
    emoji: '✨',
    previewClass: 'bg-purple-100 border-purple-300',
  },
  {
    name: 'pastel',
    label: 'Pastel',
    emoji: '🌸',
    previewClass: 'bg-pink-100 border-pink-300',
  },
  {
    name: 'neon',
    label: 'Neon',
    emoji: '⚡',
    previewClass: 'bg-slate-900 border-green-500',
  },
  {
    name: 'minimal-light',
    label: 'Minimal Light',
    emoji: '☀️',
    previewClass: 'bg-neutral-50 border-neutral-300',
  },
  {
    name: 'minimal-dark',
    label: 'Minimal Dark',
    emoji: '🌙',
    previewClass: 'bg-neutral-900 border-neutral-600',
  },
  {
    name: 'custom',
    label: 'Custom',
    emoji: '🎨',
    previewClass: 'bg-gradient-to-br from-violet-400 via-pink-400 to-orange-400 border-transparent',
  },
]

interface ThemePickerProps {
  /** compact = vertical/scroll layout for dropdown; default = grid layout for settings page */
  compact?: boolean
}

export function ThemePicker({ compact = false }: ThemePickerProps) {
  const { theme, setTheme, customConfig, setCustomConfig } = useTheme()

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'grid gap-2',
          compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
        )}
      >
        {THEME_OPTIONS.map(({ name, label, emoji, previewClass }) => {
          const isActive = theme === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => setTheme(name)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 text-xs transition-all',
                isActive
                  ? 'border-accent-500 ring-2 ring-accent-500/30 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
              )}
            >
              <div className={cn('h-7 w-full rounded-md border', previewClass)} />
              <span
                className={cn(
                  'font-medium leading-tight text-center',
                  isActive
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-slate-700 dark:text-slate-300'
                )}
              >
                {emoji} {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Custom theme controls — shown only when custom is active */}
      {theme === 'custom' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Accent color
            </label>
            <input
              type="color"
              value={customConfig.accent}
              onChange={(e) =>
                setCustomConfig({ ...customConfig, accent: e.target.value })
              }
              className="h-8 w-14 cursor-pointer rounded border border-slate-300 dark:border-slate-600 p-0.5"
              aria-label="Choose accent color"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Mode
            </span>
            <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              {(['light', 'dark'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCustomConfig({ ...customConfig, mode })}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                    customConfig.mode === mode
                      ? 'bg-accent-500 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
