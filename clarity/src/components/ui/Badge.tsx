import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'overdue' | 'now' | 'soon' | 'later' | 'hold' | 'low' | 'medium' | 'high'
}

const variantMap: Record<string, string> = {
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  now: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  soon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  later: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  hold: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn('badge', variantMap[variant], className)}>
      {children}
    </span>
  )
}
