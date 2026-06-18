import { useState, useMemo } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useAppStore } from '@/store/appStore'
import { Header } from '@/components/layout/Header'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { TaskForm } from '@/components/tasks/TaskForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { CheckSquare, Plus, SlidersHorizontal } from 'lucide-react'
import type { Task } from '@/types'

const STATUS_ORDER = { overdue: 0, now: 1, soon: 2, later: 3, hold: 4 }

export function TasksPage() {
  const { tasks, loading } = useTasks()
  const { taskFilters } = useAppStore()
  const [addOpen, setAddOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = tasks.filter(t => !t.completed_at)

    if (taskFilters.status.length > 0) {
      result = result.filter(t => taskFilters.status.includes(t.status))
    }
    if (taskFilters.energy.length > 0) {
      result = result.filter(t => taskFilters.energy.includes(t.energy))
    }
    if (taskFilters.batch.length > 0) {
      result = result.filter(t => taskFilters.batch.includes(t.batch_type))
    }

    return result.sort((a, b) => {
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (statusDiff !== 0) return statusDiff
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date)
      if (a.due_date) return -1
      if (b.due_date) return 1
      return b.priority - a.priority
    })
  }, [tasks, taskFilters])

  const hasFilters = taskFilters.status.length > 0 || taskFilters.energy.length > 0 || taskFilters.batch.length > 0

  return (
    <div>
      <Header
        title="Tasks"
        subtitle={`${tasks.filter(t => !t.completed_at).length} active`}
        right={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`p-2 rounded-xl transition-colors ${showFilters || hasFilters ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Add task"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        }
      />

      {showFilters && <TaskFilters />}

      <div className="px-4 pt-4 space-y-3 pb-4">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="w-8 h-8" />}
            title={hasFilters ? 'No matching tasks' : 'No active tasks'}
            description={hasFilters ? 'Try removing some filters' : "You're all clear! Add a task or brain dump something."}
            action={
              !hasFilters ? (
                <Button onClick={() => setAddOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Add task
                </Button>
              ) : undefined
            }
          />
        ) : (
          filtered.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      <TaskForm open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
