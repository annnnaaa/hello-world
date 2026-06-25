import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { createEvent } from '@/services/events'
import { updateThought } from '@/services/thoughts'
import { eventKeys, thoughtKeys } from '@/lib/queryKeys'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/shared/DatePicker'
import { TimePicker } from '@/components/shared/TimePicker'
import { useToast } from '@/components/ui/Toast'
import type { Thought } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  startDate: z.string().min(1, 'Date is required'),
  startTime: z.string(),
  allDay: z.boolean(),
  location: z.string().max(200).optional(),
})

type FormData = z.infer<typeof schema>

interface ConvertToEventProps {
  thought: Thought
  onSuccess: () => void
  onBack: () => void
}

export function ConvertToEvent({ thought, onSuccess, onBack }: ConvertToEventProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const today = format(new Date(), 'yyyy-MM-dd')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: thought.content.slice(0, 200),
      description: '',
      startDate: today,
      startTime: '09:00',
      allDay: false,
      location: '',
    },
  })

  const isAllDay = watch('allDay')

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error('Not authenticated')
      const startAt = data.allDay
        ? `${data.startDate}T00:00:00`
        : `${data.startDate}T${data.startTime}:00`

      const event = await createEvent(user.id, {
        title: data.title,
        description: data.description || null,
        start_at: new Date(startAt).toISOString(),
        all_day: data.allDay,
        location: data.location || null,
      })
      await updateThought(thought.id, {
        status: 'converted',
        converted_to_type: 'event',
        converted_to_id: event.id,
      })
      return event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
      toast('Converted to event', 'success')
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
          name="allDay"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-5 w-5 rounded border-slate-300 text-accent-600 focus:ring-accent-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                All day
              </span>
            </label>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker label="Date" value={field.value} onChange={field.onChange} />
            )}
          />
          {!isAllDay && (
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TimePicker label="Time" value={field.value} onChange={field.onChange} />
              )}
            />
          )}
        </div>

        <Input
          label="Location"
          placeholder="Add location (optional)"
          {...register('location')}
        />

        <Button type="submit" fullWidth loading={mutation.isPending}>
          Create Event
        </Button>
      </form>
    </div>
  )
}
