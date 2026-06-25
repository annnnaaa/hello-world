import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { createEvent, updateEvent, deleteEvent } from '@/services/events'
import { eventKeys } from '@/lib/queryKeys'
import { cn } from '@/lib/utils'
import { EVENT_COLORS } from '@/types'
import type { CalendarEvent } from '@/types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/shared/DatePicker'
import { TimePicker } from '@/components/shared/TimePicker'
import { useToast } from '@/components/ui/Toast'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  allDay: z.boolean(),
  location: z.string().max(200).optional(),
  color: z.string(),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
  event?: CalendarEvent
  defaultDate?: string
  onSuccess: () => void
}

export function EventForm({ event, defaultDate, onSuccess }: EventFormProps) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const today = defaultDate || format(new Date(), 'yyyy-MM-dd')

  const defaultValues: EventFormValues = event
    ? {
        title: event.title,
        description: event.description || '',
        startDate: format(new Date(event.start_at), 'yyyy-MM-dd'),
        startTime: format(new Date(event.start_at), 'HH:mm'),
        endDate: event.end_at
          ? format(new Date(event.end_at), 'yyyy-MM-dd')
          : format(new Date(event.start_at), 'yyyy-MM-dd'),
        endTime: event.end_at
          ? format(new Date(event.end_at), 'HH:mm')
          : format(new Date(event.start_at), 'HH:mm'),
        allDay: event.all_day,
        location: event.location || '',
        color: event.color || EVENT_COLORS[0],
      }
    : {
        title: '',
        description: '',
        startDate: today,
        startTime: '09:00',
        endDate: today,
        endTime: '10:00',
        allDay: false,
        location: '',
        color: EVENT_COLORS[0],
      }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  })

  const isAllDay = watch('allDay')
  const startDate = watch('startDate')

  // Keep end date >= start date
  useEffect(() => {
    const endDate = watch('endDate')
    if (startDate && endDate && startDate > endDate) {
      setValue('endDate', startDate)
    }
  }, [startDate, setValue, watch])

  const createMutation = useMutation({
    mutationFn: (data: EventFormValues) => {
      const startAt = data.allDay
        ? `${data.startDate}T00:00:00`
        : `${data.startDate}T${data.startTime}:00`
      const endAt = data.allDay
        ? `${data.endDate}T23:59:59`
        : `${data.endDate}T${data.endTime}:00`

      return createEvent(user!.id, {
        title: data.title,
        description: data.description || null,
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        all_day: data.allDay,
        location: data.location || null,
        color: data.color,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
      toast('Event created', 'success')
      onSuccess()
    },
    onError: () => {
      toast('Failed to create event', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: EventFormValues) => {
      const startAt = data.allDay
        ? `${data.startDate}T00:00:00`
        : `${data.startDate}T${data.startTime}:00`
      const endAt = data.allDay
        ? `${data.endDate}T23:59:59`
        : `${data.endDate}T${data.endTime}:00`

      return updateEvent(event!.id, {
        title: data.title,
        description: data.description || null,
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        all_day: data.allDay,
        location: data.location || null,
        color: data.color,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
      toast('Event updated', 'success')
      onSuccess()
    },
    onError: () => {
      toast('Failed to update event', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(event!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
      toast('Event deleted', 'success')
      onSuccess()
    },
    onError: () => {
      toast('Failed to delete event', 'error')
    },
  })

  const onSubmit = (data: EventFormValues) => {
    if (event) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Event title"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Add details (optional)"
        rows={3}
        {...register('description')}
      />

      {/* All day toggle */}
      <Controller
        name="allDay"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className={cn(
                'h-5 w-5 rounded border-slate-300 dark:border-slate-600',
                'text-accent-600 focus:ring-accent-500',
                'dark:bg-slate-800',
              )}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              All day
            </span>
          </label>
        )}
      />

      {/* Start date/time */}
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Start date"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {!isAllDay && (
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Start time"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </div>

      {/* End date/time */}
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="End date"
              value={field.value}
              onChange={field.onChange}
              min={startDate}
            />
          )}
        />
        {!isAllDay && (
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="End time"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </div>

      <Input
        label="Location"
        placeholder="Add location (optional)"
        {...register('location')}
      />

      {/* Color picker */}
      <div className="space-y-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Color
        </span>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3" role="radiogroup" aria-label="Event color">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={field.value === color}
                  aria-label={`Color ${color}`}
                  onClick={() => field.onChange(color)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500',
                    'dark:focus-visible:ring-offset-slate-800',
                    field.value === color
                      ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-800 scale-110'
                      : 'hover:scale-105',
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {event && (
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={() => deleteMutation.mutate()}
            loading={deleteMutation.isPending}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={isSubmitting}
          disabled={deleteMutation.isPending}
        >
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}
