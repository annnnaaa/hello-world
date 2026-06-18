import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useCalendar } from '@/hooks/useCalendar'
import { useAppStore } from '@/store/appStore'
import type { CalendarEvent } from '@/types'

interface EventFormProps {
  open: boolean
  onClose: () => void
  event?: CalendarEvent
  defaultDate?: string
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']

export function EventForm({ open, onClose, event, defaultDate }: EventFormProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar()
  const { showToast } = useAppStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [allDay, setAllDay] = useState(true)
  const [color, setColor] = useState('#6366f1')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description ?? '')
      setStartDate(event.start_date.split('T')[0])
      setEndDate(event.end_date?.split('T')[0] ?? '')
      setAllDay(event.all_day)
      setColor(event.color ?? '#6366f1')
    } else {
      setTitle('')
      setDescription('')
      setStartDate(defaultDate ?? new Date().toISOString().split('T')[0])
      setEndDate('')
      setAllDay(true)
      setColor('#6366f1')
    }
  }, [event, defaultDate, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !startDate) return
    setLoading(true)

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      start_date: allDay ? startDate : `${startDate}T00:00:00`,
      end_date: endDate ? (allDay ? endDate : `${endDate}T23:59:59`) : null,
      all_day: allDay,
      color,
    }

    if (event) {
      await updateEvent(event.id, data)
      showToast('Event updated', 'success')
    } else {
      await addEvent(data)
      showToast('Event added', 'success')
    }

    setLoading(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!event) return
    await deleteEvent(event.id)
    showToast('Event deleted', 'info')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={event ? 'Edit event' : 'New event'} size="full">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <Input
          label="Event title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's the event?"
          required
          autoFocus
        />

        <Textarea
          label="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          placeholder="Details..."
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Start date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          <Input label="End date (optional)" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allDay}
            onChange={e => setAllDay(e.target.checked)}
            className="w-4 h-4 accent-brand-500"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All day event</span>
        </label>

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {event && (
            <Button type="button" variant="danger" onClick={handleDelete} size="md">
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">
            {event ? 'Save' : 'Add event'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
