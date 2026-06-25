import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'
import type { PlannerView } from '@/types'

const views: { value: PlannerView; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export function PlannerViewToggle() {
  const plannerView = useUiStore((s) => s.plannerView)
  const setPlannerView = useUiStore((s) => s.setPlannerView)

  return (
    <div
      className={cn(
        'inline-flex w-full rounded-lg p-1',
        'bg-slate-100 dark:bg-slate-800',
      )}
      role="tablist"
      aria-label="Planner view"
    >
      {views.map(({ value, label }) => {
        const isSelected = plannerView === value
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => setPlannerView(value)}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
              isSelected
                ? 'bg-accent-600 text-white shadow-sm dark:bg-accent-500'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
