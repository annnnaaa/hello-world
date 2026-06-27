import { useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  format,
  isToday,
  getHours,
  getMinutes,
  differenceInMinutes,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { getEventsInRange } from '@/services/events'
import { getBirthdays } from '@/services/birthdays'
import { eventKeys, birthdayKeys } from '@/lib/queryKeys'
import { cn } from '@/lib/utils'
import { BirthdayBadge } from './BirthdayBadge'
import type { CalendarEvent, Birthday } from '@/types'

const START_HOUR = 7
const END_HOUR = 22
const HOUR_HEIGHT = 60
const TOTAL_HOURS = END_HOUR - START_HOUR
const MIN_EVENT_HEIGHT = 20

export function WeekView() {
  const user = useAuthStore((s) => s.user)
  const plannerDate = useUiStore((s) => s.plannerDate)
  const setPlannerDate = useUiStore((s) => s.setPlannerDate)
  const setPlannerView = useUiStore((s) => s.setPlannerView)
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentDate = useMemo(() => new Date(plannerDate), [plannerDate])
  const weekStart = useMemo(() => startOfWeek(currentDate), [currentDate])
  const weekEnd = useMemo(() => endOfWeek(currentDate), [currentDate])
  const days = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd],
  )

  const rangeStart = weekStart.toISOString()
  const rangeEnd = weekEnd.toISOString()

  const { data: events = [] } = useQuery({
    queryKey: eventKeys.range(rangeStart, rangeEnd),
    queryFn: () => getEventsInRange(user!.id, rangeStart, rangeEnd),
    enabled: !!user,
  })

  const { data: allBirthdays = [] } = useQuery({
    queryKey: birthdayKeys.all,
    queryFn: () => getBirthdays(user!.id),
    enabled: !!user,
  })

  const goToPrevWeek = () => setPlannerDate(subWeeks(currentDate, 1))
  const goToNextWeek = () => setPlannerDate(addWeeks(currentDate, 1))

  // Split events into all-day and timed
  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay: CalendarEvent[] = []
    const timed: CalendarEvent[] = []
    for (const event of events) {
      if (event.all_day) {
        allDay.push(event)
      } else {
        timed.push(event)
      }
    }
    return { allDayEvents: allDay, timedEvents: timed }
  }, [events])

  // Birthdays mapped by day-of-year
  const birthdaysByDay = useMemo(() => {
    const map = new Map<string, Birthday[]>()
    for (const bday of allBirthdays) {
      const birthDate = new Date(bday.birth_date + 'T00:00:00')
      const bMonth = birthDate.getMonth()
      const bDay = birthDate.getDate()
      for (const day of days) {
        if (day.getMonth() === bMonth && day.getDate() === bDay) {
          const key = format(day, 'yyyy-MM-dd')
          if (!map.has(key)) map.set(key, [])
          map.get(key)!.push(bday)
        }
      }
    }
    return map
  }, [allBirthdays, days])

  // Events grouped by day
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const day of days) {
      map.set(format(day, 'yyyy-MM-dd'), [])
    }
    for (const event of timedEvents) {
      const key = format(new Date(event.start_at), 'yyyy-MM-dd')
      map.get(key)?.push(event)
    }
    return map
  }, [timedEvents, days])

  const allDayByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of allDayEvents) {
      const key = format(new Date(event.start_at), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    }
    return map
  }, [allDayEvents])

  // Compute top/height for a timed event
  function getEventPosition(event: CalendarEvent) {
    const start = new Date(event.start_at)
    const end = event.end_at ? new Date(event.end_at) : new Date(start.getTime() + 60 * 60 * 1000)
    const startH = getHours(start) + getMinutes(start) / 60
    const durationMin = Math.max(differenceInMinutes(end, start), 15)
    const top = (startH - START_HOUR) * HOUR_HEIGHT
    const height = Math.max((durationMin / 60) * HOUR_HEIGHT, MIN_EVENT_HEIGHT)
    return { top: Math.max(top, 0), height }
  }

  // All-day row has content?
  const hasAllDayContent = allDayEvents.length > 0 || allBirthdays.length > 0

  // Hour labels
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i)

  return (
    <div className="space-y-3">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevWeek}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
          )}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h3>

        <button
          type="button"
          onClick={goToNextWeek}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
          )}
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day header row */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-0">
        <div /> {/* spacer for time column */}
        {days.map((day) => {
          const today = isToday(day)
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                setPlannerDate(day)
                setPlannerView('day')
              }}
              className={cn(
                'flex flex-col items-center py-1 rounded-lg transition-colors',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                today && 'bg-accent-50 dark:bg-accent-900/20',
              )}
            >
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                {format(day, 'EEE')}
              </span>
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                  today
                    ? 'bg-accent-600 text-white dark:bg-accent-500'
                    : 'text-slate-900 dark:text-slate-100',
                )}
              >
                {format(day, 'd')}
              </span>
            </button>
          )
        })}
      </div>

      {/* All-day / birthday row */}
      {hasAllDayContent && (
        <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-0 border-b border-slate-200 dark:border-slate-700 pb-2">
          <div className="flex items-start justify-end pr-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">All</span>
          </div>
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayAllDay = allDayByDay.get(key) || []
            const dayBirthdays = birthdaysByDay.get(key) || []
            return (
              <div key={key} className="px-0.5 space-y-0.5 min-h-[24px]">
                {dayAllDay.map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded px-1 py-0.5 text-[9px] font-medium text-white"
                    style={{ backgroundColor: event.color || '#6366f1' }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayBirthdays.map((bday) => (
                  <BirthdayBadge
                    key={bday.id}
                    birthday={bday}
                    className="text-[9px] px-1 py-0.5"
                  />
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div
        ref={scrollRef}
        className="overflow-y-auto max-h-[60vh] relative"
      >
        <div
          className="grid grid-cols-[40px_repeat(7,1fr)] gap-0 relative"
          style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}
        >
          {/* Hour labels column */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute right-2 text-[10px] text-slate-400 dark:text-slate-500 -translate-y-1/2"
                style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
              >
                {format(new Date(2000, 0, 1, hour), 'ha')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayEvents = eventsByDay.get(key) || []
            return (
              <div
                key={key}
                className="relative border-l border-slate-100 dark:border-slate-800"
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t border-slate-100 dark:border-slate-800"
                    style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event)
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'absolute inset-x-0.5 rounded px-1 py-0.5 overflow-hidden',
                        'text-[9px] leading-tight font-medium text-white',
                        'cursor-pointer hover:opacity-90 transition-opacity',
                      )}
                      style={{
                        top,
                        height,
                        backgroundColor: event.color || '#6366f1',
                      }}
                      title={event.title}
                    >
                      <span className="line-clamp-2">{event.title}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
