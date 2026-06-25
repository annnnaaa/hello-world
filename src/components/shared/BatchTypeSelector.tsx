import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { BATCH_TYPES } from '@/types'

interface BatchTypeSelectorProps {
  value: string | null
  onChange: (batchType: string | null) => void
  customTypes?: string[]
}

export function BatchTypeSelector({
  value,
  onChange,
  customTypes = [],
}: BatchTypeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const allTypes: string[] = [
    ...BATCH_TYPES,
    ...customTypes.filter((t) => !BATCH_TYPES.includes(t as (typeof BATCH_TYPES)[number])),
  ]

  const formatLabel = (type: string) =>
    type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mb-1"
    >
      {allTypes.map((type) => {
        const isActive = value === type

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(isActive ? null : type)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              'touch-manipulation select-none whitespace-nowrap',
              isActive
                ? 'border-accent-300 bg-accent-100 text-accent-800 dark:border-accent-700 dark:bg-accent-900/40 dark:text-accent-300'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            {formatLabel(type)}
          </button>
        )
      })}
    </div>
  )
}
