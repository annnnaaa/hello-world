import { useTaskFilterStore } from '@/stores/taskFilterStore'
import { EnergySelector } from '@/components/shared/EnergySelector'
import { BatchTypeSelector } from '@/components/shared/BatchTypeSelector'
import { cn } from '@/lib/utils'
import type { TaskEnergy } from '@/types'

const TIME_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'now', label: 'Now' },
  { value: 'soon', label: 'Soon' },
  { value: 'later', label: 'Later' },
] as const

export function TaskFilterBar() {
  const timeCategory = useTaskFilterStore((s) => s.timeCategory)
  const energy = useTaskFilterStore((s) => s.energy)
  const batchType = useTaskFilterStore((s) => s.batchType)
  const showCompleted = useTaskFilterStore((s) => s.showCompleted)
  const setTimeCategory = useTaskFilterStore((s) => s.setTimeCategory)
  const setEnergy = useTaskFilterStore((s) => s.setEnergy)
  const setBatchType = useTaskFilterStore((s) => s.setBatchType)
  const setShowCompleted = useTaskFilterStore((s) => s.setShowCompleted)

  return (
    <div className="space-y-3">
      {/* Time category tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 -mb-1">
        {TIME_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setTimeCategory(cat.value as typeof timeCategory)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              'touch-manipulation select-none',
              timeCategory === cat.value
                ? 'bg-accent-600 text-white dark:bg-accent-500'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
            )}
          >
            {cat.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            'touch-manipulation select-none',
            showCompleted
              ? 'bg-emerald-600 text-white dark:bg-emerald-500'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
          )}
        >
          Done
        </button>

        <button
          type="button"
          onClick={() => setTimeCategory(timeCategory === 'all' ? 'all' : 'all')}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            'touch-manipulation select-none',
            batchType === 'all' && energy === 'all' && timeCategory === 'all' && !showCompleted
              ? ''
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
            // Only show if there are active filters
            (energy !== 'all' || batchType !== 'all') ? '' : 'hidden',
          )}
        >
          Clear
        </button>
      </div>

      {/* Energy filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setEnergy('all')}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
            'touch-manipulation select-none',
            energy === 'all'
              ? 'border-accent-300 bg-accent-100 text-accent-800 dark:border-accent-700 dark:bg-accent-900/40 dark:text-accent-300'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
          )}
        >
          Any energy
        </button>
        {(['low', 'medium', 'high'] as TaskEnergy[]).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setEnergy(energy === level ? 'all' : level)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors',
              'touch-manipulation select-none',
              energy === level
                ? level === 'low'
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : level === 'medium'
                    ? 'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'border-red-300 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900/40 dark:text-red-300'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Batch type filter */}
      <BatchTypeSelector
        value={batchType === 'all' ? null : batchType}
        onChange={(v) => setBatchType(v ?? 'all')}
      />
    </div>
  )
}
