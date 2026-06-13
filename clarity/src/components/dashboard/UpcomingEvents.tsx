import { Calendar, Gift } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import type { CalendarEvent, Birthday } from '@/types'
import { isFuture, parseISO, addDays, isAfter } from 'date-fns'

interface UpcomingEventsProps {
  events: CalendarEvent[]
  birthdays: Birthday[]
  onViewPlanner: () => void
}

export function UpcomingEvents({ events, birthdays, onViewPlanner }: UpcomingEventsProps) {
  const now = new Date()
  const soon = addDays(now, 7)
  const thisYear = now.getFullYear()

  const upcomingEvents = events
    .filter(e => isFuture(parseISO(e.start_date)) || e.start_date === now.toISOString().split('T')[0])
    .slice(0, 3)

  const upcomingBirthdays = birthdays
    .map(b => {
      const [, month, day] = b.date.split('-')
      const thisYearDate = parseISO(`${thisYear}-${month}-${day}`)
      const nextDate = isAfter(thisYearDate, now) ? thisYearDate : parseISO(`${thisYear + 1}-${month}-${day}`)
      return { ...b, nextDate }
    })
    .filter(b => isAfter(addDays(b.nextDate, 0), now))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 2)

  const allItems = [
    ...upcomingEvents.map(e => ({ key: `e-${e.id}`, label: e.title, date: e.start_date, icon: Calendar, color: 'text-brand-500' })),
    ...upcomingBirthdays.map(b => ({ key: `b-${b.id}`, label: `${b.name}'s birthday`, date: b.nextDate.toISOString().split('T')[0], icon: Gift, color: 'text-pink-500' })),
  ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)

  if (allItems.length === 0) {
    return (
      <Card padding="md" onClick={onViewPlanner}>
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2">No upcoming events — tap to add one</p>
      </Card>
    )
  }

  return (
    <Card padding="sm">
      <div className="divide-y divide-slate-50 dark:divide-slate-800">
        {allItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={onViewPlanner}
              className="flex items-center gap-3 w-full py-3 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left"
            >
              <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.label}</p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{formatDate(item.date)}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
