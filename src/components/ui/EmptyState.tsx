import { type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ElementType
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className
      )}
    >
      <Icon
        className="mb-4 h-12 w-12 text-slate-400 dark:text-slate-500"
        aria-hidden="true"
      />
      <h3 className="mb-1 text-base font-medium text-slate-400 dark:text-slate-500">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-xs text-sm text-slate-400 dark:text-slate-500">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
