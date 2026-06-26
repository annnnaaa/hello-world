import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { getEventsInRange } from '@/services/events'
import { getTasks } from '@/services/tasks'
import { getBirthdays } from '@/services/birthdays'
import { eventKeys, taskKeys, birthdayKeys } from '@/lib/queryKeys'
import { cn } from '@/lib/utils'
import { DayCell } from './DayCell'
import type { CalendarEvent, Task, Birthday } from '@/types'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MonthView() {
  const user = useAuthStore((s) => s.user)
  const plannerDate = useUiStore((s) => s.plannerDate)
  const setPlannerDate = useUiStore((s) => s.setPlannerDate)
  const setPlannerView = useUiStore((s) => s.setPlannerView)

  const currentDate = useMemo(() => new Date(plannerDate), [plannerDate])
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate])
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate])
  const gridStart = useMemo(() => startOfWeek(monthStart), [monthStart])
  const gridEnd = useMemo(() => endOfWeek(monthEnd), [monthEnd])

  const days = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd],
  )

  const rangeStart = gridStart.toISOString()
  const rangeEnd = gridEnd.toISOString()

  const { data: events = [] } = useQuery({
    queryKey: eventKeys.range(rangeStart, rangeEnd),
    queryFn: () => getEventsInRange(user!.id, rangeStart, rangeEnd),
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

  const goToPrevMonth = () => setPlannerDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setPlannerDate(addMonths(currentDate, 1))

  const handleSelectDay = (date: Date) => {
    setPlannerDate(date)
    setPlannerView('day')
  }

  // Pre-compute per-day data
  const dayData = useMemo(() => {
    const map = new Map<
      string,
      { events: CalendarEvent[]; tasks: Task[]; birthdays: Birthday[] }
    >()

    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      map.set(key, { events: [], tasks: [], birthdays: [] })
    }

    for (const event of events) {
      const key = format(new Date(event.start_at), 'yyyy-MM-dd')
      map.get(key)?.events.push(event)
    }

    for (const task of allTasks) {
      if (task.due_date) {
        const key = task.due_date
        map.get(key)?.tasks.push(task)
      }
    }

    for (const bday of allBirthdays) {
      // Match birthdays by month+day across all visible days
      const birthDate = new Date(bday.birth_date + 'T00:00:00')
      const bMonth = birthDate.getMonth()
      const bDay = birthDate.getDate()

      for (const day of days) {
        if (day.getMonth() === bMonth && day.getDate() === bDay) {
          const key = format(day, 'yyyy-MM-dd')
          map.get(key)?.birthdays.push(bday)
        }
      }
    }

    return map
  }, [days, events, allTasks, allBirthdays])

  return (
    <div className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {format(currentDate, 'MMMM yyyy')}
        </h3>

        <button
          type="button"
          onClick={goToNextMonth}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700',
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-0">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0" role="grid" aria-label="Calendar">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const data = dayData.get(key) || { events: [], tasks: [], birthdays: [] }

          return (
            <DayCell
              key={key}
              date={day}
              events={data.events}
              tasks={data.tasks}
              birthdays={data.birthdays}
              isToday={isToday(day)}
              isCurrentMonth={isSameMonth(day, currentDate)}
              onSelect={handleSelectDay}
            />
          )
        })}
      </div>
    </div>
  )
}
