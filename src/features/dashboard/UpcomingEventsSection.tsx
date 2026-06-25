import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { getUpcomingEvents } from '@/services/events'
import { eventKeys } from '@/lib/queryKeys'
import { EventCard } from '@/components/shared/EventCard'
import { Calendar } from 'lucide-react'

export function UpcomingEventsSection() {
  const user = useAuthStore((s) => s.user)
  const { data: events } = useQuery({
    queryKey: eventKeys.upcoming(),
    queryFn: () => getUpcomingEvents(user!.id),
    enabled: !!user,
  })

  if (!events?.length) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-accent-500" />
        <h3 className="text-sm font-semibold">Upcoming</h3>
      </div>
      <div className="space-y-2">
        {events.slice(0, 3).map((event) => (
          <EventCard key={event.id} event={event} compact />
        ))}
      </div>
    </section>
  )
}
