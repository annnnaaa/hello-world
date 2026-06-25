import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TagFilterRowProps {
  tags: string[]
  selectedTags: string[]
  onToggle: (tag: string) => void
}

export function TagFilterRow({ tags, selectedTags, onToggle }: TagFilterRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (tags.length === 0) return null

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1"
      role="group"
      aria-label="Filter by tags"
    >
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              'border select-none touch-manipulation',
              isSelected
                ? 'border-accent-500 bg-accent-500 text-white dark:border-accent-400 dark:bg-accent-500'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500',
            )}
            aria-pressed={isSelected}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
