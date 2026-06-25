import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { getRecentNotes } from '@/services/notes'
import { noteKeys } from '@/lib/queryKeys'
import { NoteCard } from '@/components/shared/NoteCard'
import { StickyNote } from 'lucide-react'

export function RecentNotesSection() {
  const user = useAuthStore((s) => s.user)
  const { data: notes } = useQuery({
    queryKey: noteKeys.recent(),
    queryFn: () => getRecentNotes(user!.id),
    enabled: !!user,
  })

  if (!notes?.length) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="h-4 w-4 text-accent-500" />
        <h3 className="text-sm font-semibold">Recent Notes</h3>
      </div>
      <div className="space-y-2">
        {notes.slice(0, 3).map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </section>
  )
}
