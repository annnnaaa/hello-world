import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'

const STATUS_FILTERS = [
  { value: 'overdue', label: '🔴 Overdue' },
  { value: 'now', label: '🟠 Now' },
  { value: 'soon', label: '🟡 Soon' },
  { value: 'later', label: '🔵 Later' },
  { value: 'hold', label: '⏸️ Hold' },
]

const ENERGY_FILTERS = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Med' },
  { value: 'high', label: '🔴 High' },
]

const BATCH_FILTERS = [
  { value: 'paperwork', label: '📄 Admin' },
  { value: 'cleaning', label: '🧹 Clean' },
  { value: 'planning', label: '📋 Plan' },
  { value: 'project', label: '🏗️ Project' },
  { value: 'errands', label: '🚗 Errands' },
]

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 active:scale-95',
        active
          ? 'bg-brand-500 text-white shadow-sm'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
      )}
    >
      {children}
    </button>
  )
}

export function TaskFilters() {
  const { taskFilters, setTaskFilters } = useAppStore()

  const toggle = (group: 'status' | 'energy' | 'batch', value: string) => {
    const current = taskFilters[group]
    setTaskFilters({
      ...taskFilters,
      [group]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
    })
  }

  const clearAll = () => setTaskFilters({ status: [], energy: [], batch: [] })
  const hasFilters = taskFilters.status.length > 0 || taskFilters.energy.length > 0 || taskFilters.batch.length > 0

  return (
    <div className="space-y-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Filter tasks</span>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-brand-500 font-medium">Clear all</button>
        )}
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 pb-1">
          {STATUS_FILTERS.map(f => (
            <FilterChip key={f.value} active={taskFilters.status.includes(f.value)} onClick={() => toggle('status', f.value)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 pb-1">
          {ENERGY_FILTERS.map(f => (
            <FilterChip key={f.value} active={taskFilters.energy.includes(f.value)} onClick={() => toggle('energy', f.value)}>
              {f.label}
            </FilterChip>
          ))}
          {BATCH_FILTERS.map(f => (
            <FilterChip key={f.value} active={taskFilters.batch.includes(f.value)} onClick={() => toggle('batch', f.value)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>
    </div>
  )
}
