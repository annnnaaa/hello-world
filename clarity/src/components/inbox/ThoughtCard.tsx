import { useState } from 'react'
import { CheckSquare, Calendar, FileText, Lightbulb, Trash2, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { UnsortedThought, ThoughtCategory } from '@/types'
import { format, parseISO } from 'date-fns'
import { useBrainDump } from '@/hooks/useBrainDump'
import { useAppStore } from '@/store/appStore'

const categories: { id: ThoughtCategory; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { id: 'task', label: 'Task', icon: CheckSquare, desc: 'Something to do', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  { id: 'event', label: 'Event', icon: Calendar, desc: 'Add to calendar', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { id: 'note', label: 'Note', icon: FileText, desc: 'Keep as a note', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  { id: 'idea', label: 'Idea', icon: Lightbulb, desc: 'Save this idea', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
]

interface ThoughtCardProps {
  thought: UnsortedThought
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  const { sortThought, deleteThought } = useBrainDump()
  const { showToast } = useAppStore()
  const [sortOpen, setSortOpen] = useState(false)
  const [editContent, setEditContent] = useState(thought.content)
  const [loading, setLoading] = useState(false)

  const handleSort = async (cat: ThoughtCategory) => {
    setLoading(true)
    await sortThought(thought.id, cat, editContent)
    showToast(`Moved to ${cat}s`, 'success')
    setSortOpen(false)
    setLoading(false)
  }

  const handleDelete = async () => {
    await deleteThought(thought.id)
    showToast('Thought removed', 'info')
  }

  return (
    <>
      <Card padding="md" className="animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">{thought.content}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              {format(parseISO(thought.created_at), 'MMM d, h:mm a')}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSortOpen(true)}
              className="flex items-center gap-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
            >
              Sort <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </Card>

      <Modal open={sortOpen} onClose={() => setSortOpen(false)} title="Sort this thought">
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">Edit if needed:</p>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="input-base resize-none"
              rows={3}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Send to</p>

          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSort(cat.id)}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95 transition-all ${cat.color}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold text-sm">{cat.label}</span>
                  <span className="text-xs opacity-70">{cat.desc}</span>
                </button>
              )
            })}
          </div>
        </div>
      </Modal>
    </>
  )
}
