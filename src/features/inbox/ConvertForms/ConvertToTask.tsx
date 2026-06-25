import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { createTask } from '@/services/tasks'
import { updateThought } from '@/services/thoughts'
import { taskKeys, thoughtKeys } from '@/lib/queryKeys'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/shared/DatePicker'
import { EnergySelector } from '@/components/shared/EnergySelector'
import { BatchTypeSelector } from '@/components/shared/BatchTypeSelector'
import { useToast } from '@/components/ui/Toast'
import type { Thought, TaskEnergy } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  due_date: z.string().optional(),
  energy: z.enum(['low', 'medium', 'high']),
  batch_type: z.string().nullable(),
})

type FormData = z.infer<typeof schema>

interface ConvertToTaskProps {
  thought: Thought
  onSuccess: () => void
  onBack: () => void
}

export function ConvertToTask({ thought, onSuccess, onBack }: ConvertToTaskProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: thought.content.slice(0, 200),
      description: '',
      due_date: '',
      energy: 'medium' as TaskEnergy,
      batch_type: null,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error('Not authenticated')
      const task = await createTask(user.id, {
        title: data.title,
        description: data.description || null,
        due_date: data.due_date || null,
        energy: data.energy,
        batch_type: data.batch_type,
      })
      await updateThought(thought.id, {
        status: 'converted',
        converted_to_type: 'task',
        converted_to_id: task.id,
      })
      return task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
      toast('Converted to task', 'success')
      onSuccess()
    },
    onError: () => {
      toast('Failed to convert', 'error')
    },
  })

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <Input
          label="Title"
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
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Energy</span>
              <EnergySelector value={field.value} onChange={field.onChange} />
            </div>
          )}
        />

        <Controller
          name="batch_type"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Batch type</span>
              <BatchTypeSelector value={field.value} onChange={field.onChange} />
            </div>
          )}
        />

        <Button type="submit" fullWidth loading={mutation.isPending}>
          Create Task
        </Button>
      </form>
    </div>
  )
}
