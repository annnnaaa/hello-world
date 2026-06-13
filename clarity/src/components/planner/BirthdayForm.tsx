import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useCalendar } from '@/hooks/useCalendar'
import { useAppStore } from '@/store/appStore'
import type { Birthday } from '@/types'

interface BirthdayFormProps {
  open: boolean
  onClose: () => void
  birthday?: Birthday
}

export function BirthdayForm({ open, onClose, birthday }: BirthdayFormProps) {
  const { addBirthday, deleteBirthday } = useCalendar()
  const { showToast } = useAppStore()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (birthday) {
      setName(birthday.name)
      setDate(birthday.date)
      setNotes(birthday.notes ?? '')
    } else {
      setName('')
      setDate('')
      setNotes('')
    }
  }, [birthday, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !date) return
    setLoading(true)
    await addBirthday({ name: name.trim(), date, notes: notes.trim() || null })
    showToast(`${name}'s birthday added! 🎂`, 'success')
    setLoading(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!birthday) return
    await deleteBirthday(birthday.id)
    showToast('Birthday removed', 'info')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={birthday ? 'Edit birthday' : 'Add birthday'} size="md">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Whose birthday?" required autoFocus />
        <Input label="Birthday date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <Textarea label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Gift ideas, notes..." />

        <div className="flex gap-3 pt-2">
          {birthday && (
            <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">
            {birthday ? 'Save' : 'Add birthday'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
