import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { createTask, updateTask, deleteTask, completeTask } from '@/services/tasks'
import { taskKeys } from '@/lib/queryKeys'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/shared/DatePicker'
import { EnergySelector } from '@/components/shared/EnergySelector'
import { BatchTypeSelector } from '@/components/shared/BatchTypeSelector'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import type { Task, TaskEnergy } from '@/types'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  due_date: z.string().optional(),
  energy: z.enum(['low', 'medium', 'high']),
  batch_type: z.string().nullable(),
  status: z.enum(['active', 'hold']),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task
  onSuccess: () => void
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      due_date: task?.due_date ?? '',
      energy: (task?.energy as TaskEnergy) ?? 'medium',
      batch_type: task?.batch_type ?? null,
      status: task?.status === 'hold' ? 'hold' : 'active',
    },
  })

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      due_date: task?.due_date ?? '',
      energy: (task?.energy as TaskEnergy) ?? 'medium',
      batch_type: task?.batch_type ?? null,
      status: task?.status === 'hold' ? 'hold' : 'active',
    })
  }, [task, reset])

  const createMutation = useMutation({
    mutationFn: (data: TaskFormValues) => {
      if (!user) throw new Error('Not authenticated')
      return createTask(user.id, {
        title: data.title,
        description: data.description || null,
        due_date: data.due_date || null,
        energy: data.energy,
        batch_type: data.batch_type,
        status: data.status,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast('Task created', 'success')
      onSuccess()
    },
    onError: () => toast('Failed to create task', 'error'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      updateTask(task!.id, {
        title: data.title,
        description: data.description || null,
        due_date: data.due_date || null,
        energy: data.energy,
        batch_type: data.batch_type,
        status: data.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast('Task updated', 'success')
      onSuccess()
    },
    onError: () => toast('Failed to update task', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast('Task deleted', 'success')
      onSuccess()
    },
    onError: () => toast('Failed to delete task', 'error'),
  })

  const completeMutation = useMutation({
    mutationFn: () => completeTask(task!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast('Task completed!', 'success')
      onSuccess()
    },
    onError: () => toast('Failed to complete task', 'error'),
  })

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    completeMutation.isPending

  const onSubmit = (data: TaskFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="What needs doing?"
        error={errors.title?.message}
        autoFocus
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Add details (optional)"
        rows={3}
        {...register('description')}
      />

      <Controller
        name="due_date"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Due date"
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="energy"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Energy required
            </span>
            <EnergySelector value={field.value} onChange={field.onChange} />
          </div>
        )}
      />

      <Controller
        name="batch_type"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Batch type
            </span>
            <BatchTypeSelector value={field.value} onChange={field.onChange} />
          </div>
        )}
      />

      {/* Hold toggle */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={field.value === 'hold'}
              onChange={(e) => field.onChange(e.target.checked ? 'hold' : 'active')}
              className={cn(
                'h-5 w-5 rounded border-slate-300 dark:border-slate-600',
                'text-accent-600 focus:ring-accent-500 dark:bg-slate-800',
              )}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              On hold
            </span>
          </label>
        )}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {isEditing && task.status !== 'done' && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => completeMutation.mutate()}
            loading={completeMutation.isPending}
            disabled={isSubmitting}
          >
            Done
          </Button>
        )}
        {isEditing && (
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={() => deleteMutation.mutate()}
            loading={deleteMutation.isPending}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={createMutation.isPending || updateMutation.isPending}
          disabled={isSubmitting}
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
