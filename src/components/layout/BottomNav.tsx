import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  CheckSquare,
  Lightbulb,
  Calendar,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'

interface NavItem {
  key: string
  label: string
  icon: typeof Home
  path: string
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home, path: '/' },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  // center FAB placeholder is handled separately
  { key: 'planner', label: 'Planner', icon: Calendar, path: '/planner' },
  { key: 'filing', label: 'Filing', icon: FolderOpen, path: '/filing' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const toggleBrainDump = useUiStore((s) => s.toggleBrainDump)
  const brainDumpOpen = useUiStore((s) => s.brainDumpOpen)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white/80 backdrop-blur-lg border-t border-slate-200/60',
        'dark:bg-slate-900/80 dark:border-slate-700/60'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {/* Left two items */}
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors',
                active
                  ? 'text-accent-600 dark:text-accent-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          )
        })}

        {/* Center FAB - Brain Dump */}
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={toggleBrainDump}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all',
              '-mt-4',
              brainDumpOpen
                ? 'bg-accent-700 dark:bg-accent-500'
                : 'bg-accent-600 dark:bg-accent-500',
              'text-white active:scale-95'
            )}
            aria-label="Brain Dump"
          >
            <Lightbulb className="h-6 w-6" />
          </button>
        </div>

        {/* Right two items */}
        {navItems.slice(2).map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors',
                active
                  ? 'text-accent-600 dark:text-accent-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
