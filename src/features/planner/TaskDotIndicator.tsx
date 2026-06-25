import { cn } from '@/lib/utils'

interface TaskDotIndicatorProps {
  count: number
}

export function TaskDotIndicator({ count }: TaskDotIndicatorProps) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'h-4 min-w-[16px] rounded-full',
        'bg-accent-500 dark:bg-accent-400',
        count > 1 ? 'px-1' : '',
      )}
      aria-label={`${count} task${count > 1 ? 's' : ''} due`}
    >
      {count > 1 && (
        <span className="text-[9px] font-bold leading-none text-white dark:text-slate-900">
          {count}
        </span>
      )}
    </span>
  )
}
