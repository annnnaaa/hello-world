import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useBrainDump } from '@/hooks/useBrainDump'
import { useCalendar } from '@/hooks/useCalendar'
import { useAppStore } from '@/store/appStore'
import { Header } from '@/components/layout/Header'
import { TodayCard } from '@/components/dashboard/TodayCard'
import { QuickBrainDump } from '@/components/dashboard/QuickBrainDump'
import { TaskSummaryRow } from '@/components/dashboard/TaskSummaryRow'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BrainDumpModal } from '@/components/braindump/BrainDumpModal'
import { format } from 'date-fns'

export function HomePage() {
  const { user } = useAuth()
  const { tasks, loading: tasksLoading } = useTasks()
  const { unsorted } = useBrainDump()
  const { events, birthdays, loading: calLoading } = useCalendar()
  const { brainDumpOpen, setBrainDumpOpen, setActiveTab } = useAppStore()

  const activeTasks = tasks.filter(t => !t.completed_at)
  const today = format(new Date(), 'yyyy-MM-dd')
  const tasksDueToday = activeTasks.filter(t => t.due_date === today).length

  const profile = user?.user_metadata
  const fullName = profile?.full_name as string | undefined

  if (tasksLoading || calLoading) {
    return (
      <div>
        <Header title="Clarity" subtitle={format(new Date(), 'EEEE, MMMM d')} />
        <LoadingSpinner className="mt-8" />
      </div>
    )
  }

  return (
    <div>
      <Header title="Clarity" subtitle={format(new Date(), 'EEEE, MMMM d')} />

      <div className="px-4 pt-4 space-y-5 pb-4">
        <TodayCard
          name={fullName}
          tasksToday={tasksDueToday}
          completedToday={0}
        />

        <QuickBrainDump />

        {unsorted.length > 0 && (
          <div
            role="button"
            onClick={() => setActiveTab('inbox')}
            className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm">
              {unsorted.length}
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Inbox needs sorting</p>
              <p className="text-xs text-amber-600 dark:text-amber-500">{unsorted.length} thought{unsorted.length !== 1 ? 's' : ''} waiting</p>
            </div>
          </div>
        )}

        <div>
          <p className="section-title">Tasks</p>
          <TaskSummaryRow tasks={activeTasks} onViewTasks={() => setActiveTab('tasks')} />
        </div>

        <div>
          <p className="section-title">Coming up</p>
          <UpcomingEvents
            events={events}
            birthdays={birthdays}
            onViewPlanner={() => setActiveTab('planner')}
          />
        </div>
      </div>

      <BrainDumpModal open={brainDumpOpen} onClose={() => setBrainDumpOpen(false)} />
    </div>
  )
}
