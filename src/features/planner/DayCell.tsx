import { cn } from '@/lib/utils'
import type { CalendarEvent, Task, Birthday } from '@/types'
import { TaskDotIndicator } from './TaskDotIndicator'

interface DayCellProps {
  date: Date
  events: CalendarEvent[]
  tasks: Task[]
  birthdays: Birthday[]
  isToday: boolean
  isCurrentMonth: boolean
  onSelect: (date: Date) => void
}

export function DayCell({
  date,
  events,
  tasks,
  birthdays,
  isToday,
  isCurrentMonth,
  onSelect,
}: DayCellProps) {
  const dayNumber = date.getDate()
  const hasBirthday = birthdays.length > 0
  const taskCount = tasks.length
  // Show up to 2 event color dots
  const eventDots = events.slice(0, 2)

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        'min-h-[56px] w-full',
        'active:bg-slate-200 dark:active:bg-slate-700',
        isToday && 'bg-accent-50 dark:bg-accent-900/20',
        !isCurrentMonth && 'opacity-40',
      )}
      aria-label={`${date.toLocaleDateString()}, ${events.length} events, ${tasks.length} tasks${hasBirthday ? ', birthday' : ''}`}
    >
      <span
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full text-sm',
          isToday
            ? 'bg-accent-600 text-white font-bold dark:bg-accent-500'
            : 'text-slate-900 dark:text-slate-100 font-medium',
        )}
      >
        {dayNumber}
      </span>

      <div className="flex items-center gap-0.5 min-h-[8px]">
        {eventDots.map((event) => (
          <span
            key={event.id}
            className="h-[6px] w-[6px] rounded-full"
            style={{ backgroundColor: event.color || '#6366f1' }}
            aria-hidden="true"
          />
        ))}
        {hasBirthday && (
          <span className="text-[8px] leading-none" aria-hidden="true">
            🎂
          </span>
        )}
        {taskCount > 0 && <TaskDotIndicator count={taskCount} />}
      </div>
    </button>
  )
}
