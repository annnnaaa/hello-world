import { StickyNote, Pin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn, truncate } from '@/lib/utils'
import type { Note } from '@/types'

interface NoteCardProps {
  note: Note
  onTap?: (note: Note) => void
}

export function NoteCard({ note, onTap }: NoteCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-slate-800 p-3',
        'border border-slate-200 dark:border-slate-700',
        'active:scale-[0.98] transition-transform cursor-pointer',
      )}
      onClick={() => onTap?.(note)}
    >
      <div className="flex items-start gap-2">
        <StickyNote className="h-4 w-4 shrink-0 text-accent-500 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium truncate">{note.title}</p>
            {note.pinned && <Pin className="h-3 w-3 text-amber-500 shrink-0" />}
          </div>
          {note.content && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {truncate(note.content, 120)}
            </p>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-full bg-accent-50 dark:bg-accent-900/30 px-1.5 py-0.5 text-[10px] text-accent-600 dark:text-accent-400">
                {tag}
              </span>
            ))}
            <span className="text-[10px] text-slate-400">
              {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
