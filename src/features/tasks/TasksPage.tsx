import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ListChecks } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useTaskFilterStore } from '@/stores/taskFilterStore'
import { getTasks, completeTask } from '@/services/tasks'
import { taskKeys } from '@/lib/queryKeys'
import { getTaskTimeCategory } from '@/lib/utils'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { TaskCard } from '@/components/shared/TaskCard'
import { useToast } from '@/components/ui/Toast'
import { TaskFilterBar } from './TaskFilterBar'
import { TaskSheet } from './TaskSheet'
import type { Task } from '@/types'

export function TasksPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const timeCategory = useTaskFilterStore((s) => s.timeCategory)
  const energy = useTaskFilterStore((s) => s.energy)
  const batchType = useTaskFilterStore((s) => s.batchType)
  const showCompleted = useTaskFilterStore((s) => s.showCompleted)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const filters = useMemo(() => ({
    status: showCompleted ? 'done' as const : 'active' as const,
    energy: energy === 'all' ? undefined : energy,
    batchType: batchType === 'all' ? undefined : batchType,
  }), [showCompleted, energy, batchType])

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: taskKeys.filtered(filters),
    queryFn: () => getTasks(user!.id, {
      status: filters.status,
      energy: filters.energy as 'low' | 'medium' | 'high' | undefined,
      batchType: filters.batchType,
    }),
    enabled: !!user,
  })

  const filteredTasks = useMemo(() => {
    if (showCompleted || timeCategory === 'all') return allTasks
    return allTasks.filter((task) => {
      if (timeCategory === 'overdue') return getTaskTimeCategory(task.due_date) === 'overdue'
      if (timeCategory === 'now') return getTaskTimeCategory(task.due_date) === 'now'
      if (timeCategory === 'soon') return getTaskTimeCategory(task.due_date) === 'soon'
      if (timeCategory === 'later') return getTaskTimeCategory(task.due_date) === 'later'
      return true
    })
  }, [allTasks, timeCategory, showCompleted])

  const completeMutation = useMutation({
    mutationFn: (task: Task) => completeTask(task.id),
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all })
      const key = taskKeys.filtered(filters)
      const prev = queryClient.getQueryData<Task[]>(key)
      queryClient.setQueryData<Task[]>(key, (old) =>
        old?.filter((t) => t.id !== task.id),
      )
      return { prev, key }
    },
    onError: (_err, _task, context) => {
      if (context) {
        queryClient.setQueryData(context.key, context.prev)
      }
      toast('Failed to complete task', 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
    onSuccess: () => {
      toast('Task completed!', 'success')
    },
  })

  const handleOpenNew = () => {
    setEditingTask(undefined)
    setSheetOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setSheetOpen(true)
  }

  return (
    <>
      <TopBar
        title="Tasks"
        right={
          <Button size="sm" onClick={handleOpenNew}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          <TaskFilterBar />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title={showCompleted ? 'No completed tasks' : 'No tasks here'}
              description={
                showCompleted
                  ? 'Completed tasks will show up here.'
                  : 'Add a task to get started, or adjust your filters.'
              }
              action={
                !showCompleted ? (
                  <Button size="sm" onClick={handleOpenNew}>
                    <Plus className="h-4 w-4" />
                    New Task
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                  >
                    <TaskCard
                      task={task}
                      onToggleComplete={(t) => completeMutation.mutate(t)}
                      onTap={handleEditTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </PageContainer>

      <TaskSheet
        isOpen={sheetOpen}
        onClose={() => {
          setSheetOpen(false)
          setEditingTask(undefined)
        }}
        task={editingTask}
      />
    </>
  )
}
