import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  maxLength?: number
  autoGrow?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, maxLength, autoGrow = false, className, id: idProp, value, onChange, ...props },
    ref
  ) => {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const internalRef = useRef<HTMLTextAreaElement | null>(null)

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const adjustHeight = useCallback(() => {
      const textarea = internalRef.current
      if (!textarea || !autoGrow) return
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }, [autoGrow])

    useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const charCount =
      typeof value === 'string' ? value.length : 0

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
        <textarea
          ref={setRefs}
          id={id}
          value={value}
          maxLength={maxLength}
          onChange={(e) => {
            onChange?.(e)
            adjustHeight()
          }}
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2.5',
            'text-[16px] leading-6 text-slate-900 placeholder:text-slate-400',
            'transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500',
            'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            !autoGrow && 'min-h-[100px]',
            error
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 dark:border-slate-600',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            [error && `${id}-error`, maxLength && `${id}-count`]
              .filter(Boolean)
              .join(' ') || undefined
          }
          {...props}
        />
        <div className="flex items-center justify-between">
          {error ? (
            <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : (
            <span />
          )}
          {maxLength != null && (
            <span
              id={`${id}-count`}
              className={cn(
                'text-xs tabular-nums',
                charCount >= maxLength
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-400 dark:text-slate-500'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
