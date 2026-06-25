import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id: idProp, ...props }, ref) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'block w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-10',
              'text-[16px] leading-6 text-slate-900',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
              'dark:bg-slate-800 dark:text-slate-100',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 dark:border-slate-600',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown
              className="h-5 w-5 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
          </div>
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
