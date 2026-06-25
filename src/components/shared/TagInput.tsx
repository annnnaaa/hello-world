import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onChange, placeholder = 'Add a tag...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInputValue('')
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2',
        'border-slate-300 bg-white transition-colors',
        'focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500',
        'dark:border-slate-600 dark:bg-slate-800'
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
            'bg-accent-100 text-accent-800',
            'dark:bg-accent-900/40 dark:text-accent-300'
          )}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors hover:bg-accent-200 dark:hover:bg-accent-800"
            aria-label={`Remove tag ${tag}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className={cn(
          'min-w-[80px] flex-1 bg-transparent text-sm outline-none',
          'text-slate-900 placeholder:text-slate-400',
          'dark:text-slate-100 dark:placeholder:text-slate-500'
        )}
      />
    </div>
  )
}
