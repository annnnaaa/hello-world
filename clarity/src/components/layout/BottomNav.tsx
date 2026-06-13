import { Home, Inbox, CheckSquare, Calendar, FolderOpen } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'planner', label: 'Planner', icon: Calendar },
  { id: 'filing', label: 'Files', icon: FolderOpen },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 safe-bottom z-40"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'nav-item',
              activeTab === id ? 'nav-item-active' : 'nav-item-inactive'
            )}
            aria-label={label}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon className={cn('w-5 h-5 transition-transform duration-150', activeTab === id && 'scale-110')} />
            <span className={cn('text-[10px] font-medium', activeTab === id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500')}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
