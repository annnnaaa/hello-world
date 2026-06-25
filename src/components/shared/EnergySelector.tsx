import { cn } from '@/lib/utils'
import type { TaskEnergy } from '@/types'
import { ENERGY_LEVELS } from '@/types'

const energyConfig: Record<TaskEnergy, { label: string; active: string; inactive: string }> = {
  low: {
    label: 'Low',
    active: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    inactive: 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
  },
  medium: {
    label: 'Medium',
    active: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    inactive: 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
  },
  high: {
    label: 'High',
    active: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    inactive: 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400',
  },
}

interface EnergySelectorProps {
  value: TaskEnergy
  onChange: (energy: TaskEnergy) => void
}

export function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <div className="flex gap-2">
      {ENERGY_LEVELS.map((level) => {
        const config = energyConfig[level]
        const isActive = value === level

        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              'touch-manipulation select-none',
              isActive ? config.active : config.inactive,
              !isActive && 'hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            {config.label}
          </button>
        )
      })}
    </div>
  )
}
