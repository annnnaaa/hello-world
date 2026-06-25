import { BottomSheet } from '@/components/ui/BottomSheet'
import { EventForm } from './EventForm'
import type { CalendarEvent } from '@/types'

interface EventSheetProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent
  defaultDate?: string
}

export function EventSheet({ isOpen, onClose, event, defaultDate }: EventSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'New Event'}
    >
      <EventForm
        key={event?.id ?? 'new'}
        event={event}
        defaultDate={defaultDate}
        onSuccess={onClose}
      />
    </BottomSheet>
  )
}
