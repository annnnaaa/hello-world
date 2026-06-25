import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { getOverdueTasks } from '@/services/tasks'
import { taskKeys } from '@/lib/queryKeys'
import { TaskCard } from '@/components/shared/TaskCard'
import { AlertTriangle } from 'lucide-react'

export function OverdueTasksSection() {
  const user = useAuthStore((s) => s.user)
  const { data: tasks } = useQuery({
    queryKey: taskKeys.overdue(),
    queryFn: () => getOverdueTasks(user!.id),
    enabled: !!user,
  })

  if (!tasks?.length) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
          Overdue ({tasks.length})
        </h3>
      </div>
      <div className="space-y-2">
        {tasks.slice(0, 3).map((task) => (
          <TaskCard key={task.id} task={task} compact />
        ))}
      </div>
    </section>
  )
}
