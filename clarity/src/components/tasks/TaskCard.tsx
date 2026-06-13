import { useState } from 'react'
import { Check, Trash2, Pencil, Clock, Battery, Tag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Task } from '@/types'
import { formatDate } from '@/lib/utils'
import { useTasks } from '@/hooks/useTasks'
import { useAppStore } from '@/store/appStore'
import { TaskForm } from './TaskForm'

interface TaskCardProps {
  task: Task
}

const batchIcons: Record<string, string> = {
  paperwork: '📄',
  cleaning: '🧹',
  planning: '📋',
  project: '🏗️',
  errands: '🚗',
  custom: '📦',
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTasks()
  const { showToast } = useAppStore()
  const [editOpen, setEditOpen] = useState(false)
  const [completing, setCompleting] = useState(false)

  const handleComplete = async () => {
    setCompleting(true)
    await completeTask(task.id)
    showToast('Task complete! Nice work 🎉', 'success')
  }

  const handleDelete = async () => {
    await deleteTask(task.id)
    showToast('Task deleted', 'info')
  }

  return (
    <>
      <Card padding="md" className={`animate-fade-in transition-opacity ${completing ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-start gap-3">
          <button
            onClick={handleComplete}
            className="mt-0.5 w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 flex items-center justify-center transition-all shrink-0 group"
            aria-label="Complete task"
          >
            <Check className="w-3.5 h-3.5 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <div className="flex-1 min-w-0" onClick={() => setEditOpen(true)} role="button">
            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm leading-snug">{task.title}</p>
            {task.description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Badge variant={task.status}>{task.status}</Badge>
              <Badge variant={task.energy as any}>
                <Battery className="w-3 h-3" />{task.energy}
              </Badge>
              <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {batchIcons[task.batch_type]} {task.custom_batch ?? task.batch_type}
              </span>
              {task.due_date && (
                <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" /> {formatDate(task.due_date)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Card>

      <TaskForm open={editOpen} onClose={() => setEditOpen(false)} task={task} />
    </>
  )
}
