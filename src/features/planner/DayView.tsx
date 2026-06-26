import { useMemo, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  format,
  addDays,
  subDays,
  isToday,
  getHours,
  getMinutes,
  differenceInMinutes,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { getEventsInRange } from '@/services/events'
import { getTasks } from '@/services/tasks'
import { getBirthdays } from '@/services/birthdays'
import { eventKeys, taskKeys, birthdayKeys } from '@/lib/queryKeys'
import { cn } from '@/lib/utils'
import { TaskCard } from '@/components/shared/TaskCard'
import { BirthdayBadge } from './BirthdayBadge'
import type { CalendarEvent } from '@/types'

const START_HOUR = 6
const END_HOUR = 23
const HOUR_HEIGHT = 64
const TOTAL_HOURS = END_HOUR - START_HOUR
const MIN_EVENT_HEIGHT = 24

export function DayView() {
  const user = useAuthStore((s) => s.user)
  const plannerDate = useUiStore((s) => s.plannerDate)
  const setPlannerDate = useUiStore((s) => s.setPlannerDate)
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentDate = useMemo(() => new Date(plannerDate), [plannerDate])
  const dateKey = format(currentDate, 'yyyy-MM-dd')
  const dayStart = useMemo(() => {
    const d = new Date(currentDate)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }, [currentDate])
  const dayEnd = useMemo(() => {
    const d = new Date(currentDate)
    d.setHours(23, 59, 59, 999)
    return d.toISOString()
  }, [currentDate])

  const { data: events = [] } = useQuery({
    queryKey: eventKeys.range(dayStart, dayEnd),
    queryFn: () => getEventsInRange(user!.id, dayStart, dayEnd),
    enabled: !!user,
  })

  const { data: allTasks = [] } = useQuery({
    queryKey: taskKeys.all,
    queryFn: () => getTasks(user!.id),
    enabled: !!user,
  })

  const { data: allBirthdays = [] } = useQuery({
    queryKey: birthdayKeys.all,
    queryFn: () => getBirthdays(user!.id),
    enabled: !!user,
  })

  // Scroll to current hour on mount
  useEffect(() => {
    if (scrollRef.current && isToday(currentDate)) {
      const currentHour = new Date().getHours()
      const scrollTo = Math.max(0, (currentHour - START_HOUR - 1) * HOUR_HEIGHT)
      scrollRef.current.scrollTop = scrollTo
    }
  }, [currentDate])

  const goToPrevDay = () => setPlannerDate(subDays(currentDate, 1))
  const goToNextDay = () => setPlannerDate(addDays(currentDate, 1))

  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay: CalendarEvent[] = []
    const timed: CalendarEvent[] = []
    for (const event of events) {
      if (event.all_day) allDay.push(event)
      else timed.push(event)
    }
    return { allDayEvents: allDay, timedEvents: timed }
  }, [events])

  const dayTasks = useMemo(
    () => allTasks.filter((t) => t.due_date === dateKey && t.status === 'active'),
    [allTasks, dateKey],
  )

  const dayBirthdays = useMemo(() => {
    const month = currentDate.getMonth()
    const day = currentDate.getDate()
    return allBirthdays.filter((b) => {
      const bd = new Date(b.birth_date + 'T00:00:00')
      return bd.getMonth() === month && bd.getDate() === day
    })
  }, [allBirthdays, currentDate])

  function getEventPosition(event: CalendarEvent) {
    const start = new Date(event.start_at)
    const end = event.end_at ? new Date(event.end_at) : new Date(start.getTime() + 60 * 60 * 1000)
    const startH = getHours(start) + getMinutes(start) / 60
    const durationMin = Math.max(differenceInMinutes(end, start), 15)
    const top = (startH - START_HOUR) * HOUR_HEIGHT
    const height = Math.max((durationMin / 60) * HOUR_HEIGHT, MIN_EVENT_HEIGHT)
    return { top: Math.max(top, 0), height }
  }

  // Assign columns for overlapping events
  const eventPositions = useMemo(() => {
    const sorted = [...timedEvents].sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
    )

    const positions: { event: CalendarEvent; top: number; height: number; col: number; totalCols: number }[] = []
    const active: typeof positions = []

    for (const event of sorted) {
      const pos = getEventPosition(event)

      // Remove events that end before this one starts
      while (active.length > 0 && active[0].top + active[0].height <= pos.top) {
        active.shift()
      }

      const col = active.length
      const entry = { event, ...pos, col, totalCols: col + 1 }
      active.push(entry)
      positions.push(entry)

      // Update totalCols for all active entries
      for (const a of active) {
        a.totalCols = Math.max(a.totalCols, active.length)
      }
    }

    return positions
  }, [timedEvents])

  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i)
  const today = isToday(currentDate)

  return (
    <div className="space-y-3">
      {/* Day navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevDay}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
          )}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {format(currentDate, 'EEEE, MMMM d')}
          </h3>
          {today && (
            <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">
              Today
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={goToNextDay}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
          )}
          aria-label="Next day"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* All-day events + birthdays */}
      {(allDayEvents.length > 0 || dayBirthdays.length > 0) && (
        <div className="space-y-1 border-b border-slate-200 dark:border-slate-700 pb-3">
          {dayBirthdays.map((bday) => (
            <BirthdayBadge key={bday.id} birthday={bday} />
          ))}
          {allDayEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: event.color || '#6366f1' }}
            >
              {event.title}
            </div>
          ))}
        </div>
      )}

      {/* Tasks due today */}
      {dayTasks.length > 0 && (
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Tasks due
          </h4>
          {dayTasks.map((task) => (
            <TaskCard key={task.id} task={task} compact />
          ))}
        </div>
      )}

      {/* Hour grid */}
      <div
        ref={scrollRef}
        className="overflow-y-auto max-h-[60vh]"
      >
        <div
          className="relative grid grid-cols-[48px_1fr]"
          style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}
        >
          {/* Hour labels */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute right-3 text-xs text-slate-400 dark:text-slate-500 -translate-y-1/2"
                style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
              >
                {format(new Date(2000, 0, 1, hour), 'h a')}
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="relative border-l border-slate-200 dark:border-slate-700">
            {/* Hour grid lines */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute inset-x-0 border-t border-slate-100 dark:border-slate-800"
                style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
              />
            ))}

            {/* Current time indicator */}
            {today && (() => {
              const now = new Date()
              const nowH = getHours(now) + getMinutes(now) / 60
              const top = (nowH - START_HOUR) * HOUR_HEIGHT
              if (top < 0 || top > TOTAL_HOURS * HOUR_HEIGHT) return null
              return (
                <div
                  className="absolute inset-x-0 z-10 flex items-center"
                  style={{ top }}
                >
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="flex-1 border-t border-red-500" />
                </div>
              )
            })()}

            {/* Timed events */}
            {eventPositions.map(({ event, top, height, col, totalCols }) => {
              const widthPercent = 100 / totalCols
              const leftPercent = col * widthPercent
              return (
                <div
                  key={event.id}
                  className={cn(
                    'absolute rounded-lg px-2 py-1 overflow-hidden',
                    'text-xs font-medium text-white',
                    'cursor-pointer hover:opacity-90 transition-opacity',
                    'shadow-sm',
                  )}
                  style={{
                    top,
                    height,
                    left: `calc(${leftPercent}% + 2px)`,
                    width: `calc(${widthPercent}% - 4px)`,
                    backgroundColor: event.color || '#6366f1',
                  }}
                  title={event.title}
                >
                  <span className="line-clamp-2">{event.title}</span>
                  {height > 32 && (
                    <span className="mt-0.5 block text-[10px] opacity-80">
                      {format(new Date(event.start_at), 'h:mm a')}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
