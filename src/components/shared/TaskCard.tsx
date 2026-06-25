import { CheckCircle2, Circle, Clock, Flame, Zap, Battery } from 'lucide-react'
import { cn, formatDate, getTaskTimeCategory } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onToggleComplete?: (task: Task) => void
  onTap?: (task: Task) => void
  compact?: boolean
}

const energyIcons = {
  low: Battery,
  medium: Zap,
  high: Flame,
}

const energyColors = {
  low: 'text-green-500',
  medium: 'text-amber-500',
  high: 'text-red-500',
}

const timeCategoryColors = {
  overdue: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
  now: 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/30',
  soon: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
  later: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
}

export function TaskCard({ task, onToggleComplete, onTap, compact }: TaskCardProps) {
  const isDone = task.status === 'done'
  const timeCategory = getTaskTimeCategory(task.due_date)
  const EnergyIcon = energyIcons[task.energy as keyof typeof energyIcons] || Zap

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl bg-white dark:bg-slate-800 p-3',
        'border border-slate-200 dark:border-slate-700',
        'active:scale-[0.98] transition-transform',
        onTap && 'cursor-pointer',
      )}
      onClick={() => onTap?.(task)}
    >
      <button
        className="mt-0.5 shrink-0"
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete?.(task)
        }}
      >
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-sm font-medium',
          isDone && 'line-through text-slate-400 dark:text-slate-500',
        )}>
          {task.title}
        </p>

        {!compact && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {task.due_date && (
              <span className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                timeCategoryColors[timeCategory],
              )}>
                <Clock className="h-3 w-3" />
                {formatDate(task.due_date)}
              </span>
            )}
            <span className={cn('inline-flex items-center gap-0.5 text-xs', energyColors[task.energy as keyof typeof energyColors])}>
              <EnergyIcon className="h-3 w-3" />
            </span>
            {task.batch_type && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                {task.batch_type}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
