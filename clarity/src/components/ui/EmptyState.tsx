import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-5 max-w-[220px]">{description}</p>
      {action}
    </div>
  )
}
