import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'full'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 bg-white dark:bg-slate-900 w-full animate-slide-up',
          'border-t border-slate-100 dark:border-slate-800',
          size === 'full'
            ? 'h-[92vh] rounded-t-3xl'
            : size === 'sm'
            ? 'max-w-sm rounded-t-3xl sm:rounded-3xl max-h-[60vh]'
            : 'max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh]',
          'flex flex-col overflow-hidden'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 absolute top-3 left-1/2 -translate-x-1/2 sm:hidden" />
            <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1 safe-bottom">
          {children}
        </div>
      </div>
    </div>
  )
}
