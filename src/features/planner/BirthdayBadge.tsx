import { cn } from '@/lib/utils'
import type { Birthday } from '@/types'

interface BirthdayBadgeProps {
  birthday: Birthday
  onTap?: (birthday: Birthday) => void
  className?: string
}

export function BirthdayBadge({ birthday, onTap, className }: BirthdayBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onTap?.(birthday)}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
        'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
        'text-xs font-medium',
        'transition-colors hover:bg-pink-200 dark:hover:bg-pink-900/60',
        'active:scale-95 transition-transform',
        className,
      )}
      aria-label={`${birthday.name}'s birthday`}
    >
      <span aria-hidden="true">🎂</span>
      <span className="truncate max-w-[100px]">{birthday.name}</span>
    </button>
  )
}
