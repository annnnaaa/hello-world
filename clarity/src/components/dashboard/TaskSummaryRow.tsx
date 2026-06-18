import { CheckSquare, AlertCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { Task } from '@/types'

interface TaskSummaryRowProps {
  tasks: Task[]
  onViewTasks: () => void
}

export function TaskSummaryRow({ tasks, onViewTasks }: TaskSummaryRowProps) {
  const overdue = tasks.filter(t => t.status === 'overdue').length
  const now = tasks.filter(t => t.status === 'now').length
  const soon = tasks.filter(t => t.status === 'soon').length

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card padding="sm" onClick={onViewTasks} className={overdue > 0 ? 'border-red-200 dark:border-red-800' : ''}>
        <div className="flex flex-col items-center gap-1">
          <AlertCircle className={`w-5 h-5 ${overdue > 0 ? 'text-red-500' : 'text-slate-300 dark:text-slate-600'}`} />
          <span className={`text-xl font-bold ${overdue > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-300 dark:text-slate-600'}`}>
            {overdue}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Overdue</span>
        </div>
      </Card>

      <Card padding="sm" onClick={onViewTasks} className={now > 0 ? 'border-amber-200 dark:border-amber-800' : ''}>
        <div className="flex flex-col items-center gap-1">
          <Clock className={`w-5 h-5 ${now > 0 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
          <span className={`text-xl font-bold ${now > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>
            {now}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Today</span>
        </div>
      </Card>

      <Card padding="sm" onClick={onViewTasks}>
        <div className="flex flex-col items-center gap-1">
          <CheckSquare className={`w-5 h-5 ${soon > 0 ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'}`} />
          <span className={`text-xl font-bold ${soon > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`}>
            {soon}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Soon</span>
        </div>
      </Card>
    </div>
  )
}
