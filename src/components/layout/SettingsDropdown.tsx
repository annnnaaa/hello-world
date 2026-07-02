import { useState, useRef, useEffect } from 'react'
import { Settings, Sun, Moon, Monitor, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from '@/stores/authStore'

export function SettingsDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const signOut = useAuthStore((s) => s.signOut)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
          open && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
        )}
      >
        <Settings className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 top-11 z-50 w-52 rounded-xl border shadow-lg',
            'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700',
          )}
        >
          {/* Theme section */}
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Theme
            </p>
          </div>
          <div className="px-1 pb-1">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setTheme(value); setOpen(false) }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  theme === value
                    ? 'bg-accent-500/10 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400 font-medium'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {theme === value && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-500" />
                )}
              </button>
            ))}
          </div>

          <div className="mx-3 border-t border-slate-100 dark:border-slate-800" />

          {/* Sign out */}
          <div className="p-1">
            <button
              type="button"
              onClick={async () => { setOpen(false); await signOut() }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
