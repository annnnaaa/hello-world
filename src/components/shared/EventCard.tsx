import { Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/types'

interface EventCardProps {
  event: CalendarEvent
  onTap?: (event: CalendarEvent) => void
  compact?: boolean
}

export function EventCard({ event, onTap, compact }: EventCardProps) {
  const start = new Date(event.start_at)

  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl bg-white dark:bg-slate-800 p-3',
        'border border-slate-200 dark:border-slate-700',
        'active:scale-[0.98] transition-transform',
        onTap && 'cursor-pointer',
      )}
      onClick={() => onTap?.(event)}
    >
      <div
        className="w-1 shrink-0 rounded-full"
        style={{ backgroundColor: event.color || '#6366f1' }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        {!compact && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.all_day ? 'All day' : format(start, 'h:mm a')}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
