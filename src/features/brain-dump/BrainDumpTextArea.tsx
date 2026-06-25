import { useState } from 'react'
import { Send } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/Toast'
import { createThought } from '@/services/thoughts'
import { useQueryClient } from '@tanstack/react-query'
import { thoughtKeys } from '@/lib/queryKeys'

export function BrainDumpTextArea() {
  const user = useAuthStore((s) => s.user)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim() || !user) return
    setSaving(true)
    try {
      await createThought(user.id, content.trim())
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
      setContent('')
      toast('Saved to inbox', 'success')
    } catch {
      toast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Quick brain dump..."
        rows={2}
        className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 pr-12 text-sm placeholder-slate-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none"
      />
      {content.trim() && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="absolute right-3 bottom-3 rounded-full bg-accent-600 p-1.5 text-white active:scale-90 transition-transform disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
