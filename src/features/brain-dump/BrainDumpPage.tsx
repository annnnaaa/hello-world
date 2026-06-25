import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X, Send } from 'lucide-react'
import { useUiStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/Toast'
import { createThought } from '@/services/thoughts'
import { useQueryClient } from '@tanstack/react-query'
import { thoughtKeys } from '@/lib/queryKeys'

export function BrainDumpPage() {
  const { brainDumpOpen, toggleBrainDump } = useUiStore()
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
      toggleBrainDump()
      toast('Saved to inbox', 'success')
    } catch {
      toast('Failed to save thought', 'error')
    } finally {
      setSaving(false)
    }
  }

  const portalRoot = document.getElementById('portal-root')
  if (!portalRoot) return null

  return createPortal(
    <AnimatePresence>
      {brainDumpOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-900"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <button onClick={toggleBrainDump} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Brain Dump</h1>
            <button
              onClick={handleSave}
              disabled={!content.trim() || saving}
              className="flex items-center gap-1.5 rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 active:scale-95 transition-transform"
            >
              <Send className="h-4 w-4" />
              Save
            </button>
          </div>

          <div className="flex-1 p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Just dump it here..."
              autoFocus
              className="h-full w-full resize-none bg-transparent text-lg leading-relaxed placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 text-center border-t border-slate-200 dark:border-slate-700">
            {content.length > 0 ? `${content.length} characters` : 'Start typing to capture your thought'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot,
  )
}
