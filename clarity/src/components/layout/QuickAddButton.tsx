import { Plus, X, Zap, CheckSquare, Calendar, FileText } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const options = [
  { label: 'Brain Dump', icon: Zap, action: 'brain_dump', color: 'bg-brand-500' },
  { label: 'Task', icon: CheckSquare, action: 'task', color: 'bg-amber-500' },
  { label: 'Event', icon: Calendar, action: 'event', color: 'bg-blue-500' },
  { label: 'Note', icon: FileText, action: 'note', color: 'bg-green-500' },
]

interface QuickAddButtonProps {
  onBrainDump?: () => void
  onTask?: () => void
  onEvent?: () => void
  onNote?: () => void
}

export function QuickAddButton({ onBrainDump, onTask, onEvent, onNote }: QuickAddButtonProps) {
  const [expanded, setExpanded] = useState(false)
  const { setBrainDumpOpen } = useAppStore()

  const handlers: Record<string, (() => void) | undefined> = {
    brain_dump: onBrainDump ?? (() => { setBrainDumpOpen(true); setExpanded(false) }),
    task: onTask,
    event: onEvent,
    note: onNote,
  }

  const handleOption = (action: string) => {
    setExpanded(false)
    handlers[action]?.()
  }

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 z-30" onClick={() => setExpanded(false)} aria-hidden="true" />
      )}

      <div className="fixed bottom-[72px] right-4 z-40 flex flex-col-reverse items-end gap-3">
        {expanded && options.map((opt, i) => {
          const Icon = opt.icon
          return (
            <div
              key={opt.action}
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium px-3 py-1.5 rounded-xl shadow-card border border-slate-100 dark:border-slate-800">
                {opt.label}
              </span>
              <button
                onClick={() => handleOption(opt.action)}
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform', opt.color)}
                aria-label={opt.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            </div>
          )
        })}

        <button
          onClick={() => setExpanded(p => !p)}
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-200',
            expanded ? 'bg-slate-600 rotate-45' : 'bg-brand-500 hover:bg-brand-600'
          )}
          aria-label={expanded ? 'Close quick add' : 'Quick add'}
          aria-expanded={expanded}
        >
          {expanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>
    </>
  )
}
