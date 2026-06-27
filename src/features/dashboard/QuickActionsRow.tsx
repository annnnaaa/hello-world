import { CheckSquare, Calendar, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'

const actions = [
  { key: 'task', icon: CheckSquare, label: 'Task', color: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' },
  { key: 'event', icon: Calendar, label: 'Event', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { key: 'note', icon: StickyNote, label: 'Note', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
]

export function QuickActionsRow() {
  return (
    <div className="flex gap-3">
      {actions.map((action) => (
        <button
          key={action.key}
          className={cn(
            'flex flex-1 flex-col items-center gap-1.5 rounded-xl py-3',
            action.color,
            'active:scale-95 transition-transform',
          )}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-xs font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  )
}
