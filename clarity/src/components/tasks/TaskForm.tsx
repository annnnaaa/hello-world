import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/useTasks'
import { useAppStore } from '@/store/appStore'
import type { Task, TaskStatus, TaskEnergy, BatchType } from '@/types'

interface TaskFormProps {
  open: boolean
  onClose: () => void
  task?: Task
  defaultTitle?: string
}

const STATUS_OPTIONS = [
  { value: 'now', label: '🔴 Now — do it today' },
  { value: 'soon', label: '🟡 Soon — this week' },
  { value: 'later', label: '🔵 Later — someday' },
  { value: 'hold', label: '⏸️ Hold — parked' },
]

const ENERGY_OPTIONS = [
  { value: 'low', label: '🟢 Low energy' },
  { value: 'medium', label: '🟡 Medium energy' },
  { value: 'high', label: '🔴 High energy' },
]

const BATCH_OPTIONS = [
  { value: 'paperwork', label: '📄 Paperwork / Admin' },
  { value: 'cleaning', label: '🧹 Cleaning' },
  { value: 'planning', label: '📋 Planning' },
  { value: 'project', label: '🏗️ Project work' },
  { value: 'errands', label: '🚗 Running errands' },
  { value: 'custom', label: '📦 Custom' },
]

const empty = {
  title: '',
  description: '',
  status: 'later' as TaskStatus,
  energy: 'medium' as TaskEnergy,
  batch_type: 'planning' as BatchType,
  custom_batch: '',
  due_date: '',
  notes: '',
  priority: 3,
}

export function TaskForm({ open, onClose, task, defaultTitle }: TaskFormProps) {
  const { addTask, updateTask } = useTasks()
  const { showToast } = useAppStore()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        energy: task.energy,
        batch_type: task.batch_type,
        custom_batch: task.custom_batch ?? '',
        due_date: task.due_date ?? '',
        notes: task.notes ?? '',
        priority: task.priority,
      })
    } else {
      setForm({ ...empty, title: defaultTitle ?? '' })
    }
  }, [task, defaultTitle, open])

  const set = (k: keyof typeof form) => (v: string | number) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)

    const data = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      energy: form.energy,
      batch_type: form.batch_type,
      custom_batch: form.batch_type === 'custom' ? form.custom_batch.trim() || null : null,
      due_date: form.due_date || null,
      notes: form.notes.trim() || null,
      priority: form.priority,
      completed_at: null,
    }

    if (task) {
      await updateTask(task.id, data)
      showToast('Task updated', 'success')
    } else {
      await addTask(data)
      showToast('Task added', 'success')
    }

    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'New task'} size="full">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <Input
          label="Task title"
          value={form.title}
          onChange={e => set('title')(e.target.value)}
          placeholder="What needs doing?"
          required
          autoFocus
        />

        <Textarea
          label="Description (optional)"
          value={form.description}
          onChange={e => set('description')(e.target.value)}
          placeholder="Any details..."
          rows={2}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={form.status}
            onChange={e => set('status')(e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Select
            label="Energy"
            value={form.energy}
            onChange={e => set('energy')(e.target.value)}
            options={ENERGY_OPTIONS}
          />
        </div>

        <Select
          label="Batch type"
          value={form.batch_type}
          onChange={e => set('batch_type')(e.target.value)}
          options={BATCH_OPTIONS}
        />

        {form.batch_type === 'custom' && (
          <Input
            label="Custom batch name"
            value={form.custom_batch}
            onChange={e => set('custom_batch')(e.target.value)}
            placeholder="e.g. Finance"
          />
        )}

        <Input
          label="Due date (optional)"
          type="date"
          value={form.due_date}
          onChange={e => set('due_date')(e.target.value)}
        />

        <Textarea
          label="Notes (optional)"
          value={form.notes}
          onChange={e => set('notes')(e.target.value)}
          placeholder="Any extra notes..."
          rows={2}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {task ? 'Save changes' : 'Add task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
