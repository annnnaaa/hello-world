import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const variantStyles: Record<ToastVariant, string> = {
  success:
    'bg-emerald-600 text-white dark:bg-emerald-500',
  error:
    'bg-red-600 text-white dark:bg-red-500',
  info:
    'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900',
}

const variantIcons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const AUTO_DISMISS_MS = 3000

/* ------------------------------------------------------------------ */
/*  Toast (single notification)                                        */
/* ------------------------------------------------------------------ */

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const Icon = variantIcons[item.variant]

  return (
    <motion.div
      layout
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 40, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg',
        'text-sm font-medium',
        variantStyles[item.variant]
      )}
      role="status"
      aria-live="polite"
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="flex-1">{item.message}</span>
      <button
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded-full p-0.5 opacity-80 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  ToastProvider                                                      */
/* ------------------------------------------------------------------ */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `toast-${++counterRef.current}`
      setToasts((prev) => [...prev, { id, message, variant }])

      setTimeout(() => {
        dismiss(id)
      }, AUTO_DISMISS_MS)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container - fixed above typical bottom nav (pb-20) */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-20"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <Toast key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
