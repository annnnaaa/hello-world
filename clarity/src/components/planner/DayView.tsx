import { format, parseISO, isToday } from 'date-fns'
import { CheckSquare, Calendar as CalIcon, Gift } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { PlannerItem } from '@/types'
import { cn } from '@/lib/utils'

interface DayViewProps {
  date: Date
  items: PlannerItem[]
  onItemClick: (item: PlannerItem) => void
}

function PlannerItemRow({ item, onClick }: { item: PlannerItem; onClick: () => void }) {
  const icons = { task: CheckSquare, event: CalIcon, birthday: Gift }
  const Icon = icons[item.type]

  const colorMap = {
    task: 'text-amber-500',
    event: 'text-brand-500',
    birthday: 'text-pink-500',
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: item.color ? `${item.color}20` : undefined }}
      >
        <Icon className={cn('w-4 h-4', colorMap[item.type])} style={item.color ? { color: item.color } : undefined} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
        {item.type === 'task' && item.status && (
          <Badge variant={item.status as any} className="mt-0.5">{item.status}</Badge>
        )}
      </div>
    </button>
  )
}

export function DayView({ date, items, onItemClick }: DayViewProps) {
  const dayItems = items.filter(item => item.date.startsWith(format(date, 'yyyy-MM-dd')))

  return (
    <div className="px-4 py-4 space-y-3">
      <div className={cn('text-center py-2', isToday(date) && 'text-brand-600 dark:text-brand-400')}>
        <p className="text-lg font-bold">{format(date, 'EEEE')}</p>
        <p className="text-sm text-slate-400">{format(date, 'MMMM d, yyyy')}</p>
        {isToday(date) && <p className="text-xs font-semibold text-brand-500 mt-0.5">Today</p>}
      </div>

      <Card padding="none">
        {dayItems.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">Nothing scheduled. Enjoy the space!</p>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {dayItems.map(item => (
              <PlannerItemRow key={`${item.type}-${item.id}`} item={item} onClick={() => onItemClick(item)} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
