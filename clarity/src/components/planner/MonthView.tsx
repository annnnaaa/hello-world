import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlannerItem } from '@/types'

interface MonthViewProps {
  items: PlannerItem[]
  onDayClick: (date: Date) => void
}

export function MonthView({ items, onDayClick }: MonthViewProps) {
  const [month, setMonth] = useState(new Date())

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  const getItemsForDay = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd')
    return items.filter(i => i.date.startsWith(key))
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h2 className="font-bold text-slate-900 dark:text-white">{format(month, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map(day => {
          const dayItems = getItemsForDay(day)
          const inMonth = isSameMonth(day, month)
          const today = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={cn(
                'aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl transition-colors relative text-xs',
                inMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-700',
                today && 'bg-brand-500 text-white font-bold',
                !today && 'hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <span>{format(day, 'd')}</span>
              {dayItems.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-[24px]">
                  {dayItems.slice(0, 3).map(item => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: item.color ?? (item.type === 'task' ? '#f59e0b' : item.type === 'birthday' ? '#ec4899' : '#6366f1'),
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
