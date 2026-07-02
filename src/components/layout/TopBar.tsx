import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SettingsDropdown } from './SettingsDropdown'

interface TopBarProps {
  title: string
  showBack?: boolean
  rightAction?: ReactNode
}

export function TopBar({ title, showBack = false, rightAction }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-10',
        'bg-white/80 backdrop-blur-lg border-b border-slate-200/60',
        'dark:bg-slate-900/80 dark:border-slate-700/60'
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
              'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700'
            )}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <h1 className="flex-1 text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
          {title}
        </h1>

        <div className="flex items-center gap-1">
          {rightAction && <div className="flex items-center">{rightAction}</div>}
          <SettingsDropdown />
        </div>
      </div>
    </header>
  )
}
