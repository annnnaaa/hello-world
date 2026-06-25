import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ElementType,
} from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ElementType
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className, id: idProp, ...props }, ref) => {
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
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon
                className="h-5 w-5 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'block w-full rounded-lg border bg-white px-3 py-2.5',
              'text-[16px] leading-6 text-slate-900 placeholder:text-slate-400',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
              'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              Icon && 'pl-10',
              error
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 dark:border-slate-600',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
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

Input.displayName = 'Input'
