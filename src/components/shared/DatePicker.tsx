import { useId } from 'react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  min?: string
  className?: string
}

export function DatePicker({ value, onChange, label, min, className }: DatePickerProps) {
  const generatedId = useId()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={generatedId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={generatedId}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'block w-full rounded-lg border bg-white px-3 py-2.5',
          'text-[16px] leading-6 text-slate-900',
          'transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
          'border-slate-300',
          'dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600'
        )}
      />
    </div>
  )
}
