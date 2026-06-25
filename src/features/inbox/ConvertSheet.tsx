import { useState } from 'react'
import { ListTodo, Calendar, StickyNote, Lightbulb } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { cn } from '@/lib/utils'
import { ConvertToTask } from './ConvertForms/ConvertToTask'
import { ConvertToEvent } from './ConvertForms/ConvertToEvent'
import { ConvertToNote } from './ConvertForms/ConvertToNote'
import { ConvertToIdea } from './ConvertForms/ConvertToIdea'
import type { Thought, ConvertType } from '@/types'

interface ConvertSheetProps {
  thought: Thought | null
  isOpen: boolean
  onClose: () => void
}

const CONVERT_OPTIONS: { type: ConvertType; label: string; icon: typeof ListTodo; color: string }[] = [
  { type: 'task', label: 'Task', icon: ListTodo, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
  { type: 'event', label: 'Calendar Event', icon: Calendar, color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30' },
  { type: 'note', label: 'Note', icon: StickyNote, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30' },
  { type: 'idea', label: 'Idea', icon: Lightbulb, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
]

export function ConvertSheet({ thought, isOpen, onClose }: ConvertSheetProps) {
  const [selectedType, setSelectedType] = useState<ConvertType | null>(null)

  const handleClose = () => {
    setSelectedType(null)
    onClose()
  }

  if (!thought) return null

  if (selectedType === 'task') {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="Convert to Task">
        <ConvertToTask thought={thought} onSuccess={handleClose} onBack={() => setSelectedType(null)} />
      </BottomSheet>
    )
  }

  if (selectedType === 'event') {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="Convert to Event">
        <ConvertToEvent thought={thought} onSuccess={handleClose} onBack={() => setSelectedType(null)} />
      </BottomSheet>
    )
  }

  if (selectedType === 'note') {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="Convert to Note">
        <ConvertToNote thought={thought} onSuccess={handleClose} onBack={() => setSelectedType(null)} />
      </BottomSheet>
    )
  }

  if (selectedType === 'idea') {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="Convert to Idea">
        <ConvertToIdea thought={thought} onSuccess={handleClose} onBack={() => setSelectedType(null)} />
      </BottomSheet>
    )
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Convert thought">
      <div className="mb-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3">
        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap line-clamp-3">
          {thought.content}
        </p>
      </div>

      <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
        Convert to...
      </p>

      <div className="grid grid-cols-2 gap-3">
        {CONVERT_OPTIONS.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-4',
              'transition-colors active:scale-[0.97]',
              'hover:bg-slate-50 dark:hover:bg-slate-800',
            )}
          >
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', color)}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
