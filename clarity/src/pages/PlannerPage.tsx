import { useState } from 'react'
import { useCalendar } from '@/hooks/useCalendar'
import { useTasks } from '@/hooks/useTasks'
import { Header } from '@/components/layout/Header'
import { MonthView } from '@/components/planner/MonthView'
import { DayView } from '@/components/planner/DayView'
import { EventForm } from '@/components/planner/EventForm'
import { BirthdayForm } from '@/components/planner/BirthdayForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { buildPlannerItems } from '@/lib/utils'
import type { PlannerItem } from '@/types'
import { Calendar, Gift, Plus, ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'

type PlannerView = 'month' | 'day'

export function PlannerPage() {
  const { events, birthdays, loading: calLoading } = useCalendar()
  const { tasks, loading: tasksLoading } = useTasks()
  const [view, setView] = useState<PlannerView>('month')
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [eventOpen, setEventOpen] = useState(false)
  const [birthdayOpen, setBirthdayOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PlannerItem | null>(null)

  const plannerItems = buildPlannerItems(events, tasks, birthdays)

  const handleDayClick = (date: Date) => {
    setSelectedDay(date)
    setView('day')
  }

  const handleItemClick = (item: PlannerItem) => {
    setSelectedItem(item)
    if (item.type === 'event') setEventOpen(true)
    else if (item.type === 'birthday') setBirthdayOpen(true)
  }

  if (calLoading || tasksLoading) {
    return (
      <div>
        <Header title="Planner" />
        <LoadingSpinner className="mt-8" />
      </div>
    )
  }

  return (
    <div>
      <Header
        title={view === 'day' ? format(selectedDay, 'MMMM d') : 'Planner'}
        subtitle={view === 'day' ? format(selectedDay, 'yyyy') : undefined}
        right={
          <div className="flex items-center gap-1">
            {view === 'day' && (
              <button
                onClick={() => setView('month')}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Back to month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setBirthdayOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Add birthday"
            >
              <Gift className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setSelectedItem(null); setEventOpen(true) }}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Add event"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="overflow-y-auto">
        {view === 'month' ? (
          <>
            <MonthView items={plannerItems} onDayClick={handleDayClick} />

            <div className="px-4 pb-4">
              <p className="section-title mb-3">Upcoming</p>
              <div className="space-y-1">
                {plannerItems
                  .filter(i => i.date >= new Date().toISOString().split('T')[0])
                  .slice(0, 10)
                  .map(item => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-3 w-full py-2.5 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: item.color ?? (item.type === 'task' ? '#f59e0b' : '#6366f1'),
                        }}
                      />
                      <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">{item.title}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                        {format(new Date(item.date), 'MMM d')}
                      </span>
                    </button>
                  ))}
                {plannerItems.filter(i => i.date >= new Date().toISOString().split('T')[0]).length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">Nothing scheduled — enjoy the calm!</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <DayView date={selectedDay} items={plannerItems} onItemClick={handleItemClick} />
        )}
      </div>

      <EventForm
        open={eventOpen}
        onClose={() => { setEventOpen(false); setSelectedItem(null) }}
        event={selectedItem?.type === 'event' ? events.find(e => e.id === selectedItem.id) : undefined}
        defaultDate={format(selectedDay, 'yyyy-MM-dd')}
      />

      <BirthdayForm
        open={birthdayOpen}
        onClose={() => { setBirthdayOpen(false); setSelectedItem(null) }}
        birthday={selectedItem?.type === 'birthday' ? birthdays.find(b => b.id === selectedItem.id) : undefined}
      />
    </div>
  )
}
