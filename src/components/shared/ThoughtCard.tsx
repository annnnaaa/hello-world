import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Thought } from '@/types'

interface ThoughtCardProps {
  thought: Thought
  onTap?: (thought: Thought) => void
}

export function ThoughtCard({ thought, onTap }: ThoughtCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-slate-800 p-4',
        'border border-slate-200 dark:border-slate-700',
        'active:scale-[0.98] transition-transform cursor-pointer',
      )}
      onClick={() => onTap?.(thought)}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {thought.content}
      </p>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        {formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}
      </p>
    </div>
  )
}
