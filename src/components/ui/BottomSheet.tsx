import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

const DRAG_CLOSE_THRESHOLD = 100

export function BottomSheet({ isOpen, onClose, title, children, className }: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > DRAG_CLOSE_THRESHOLD) {
      onClose()
    }
  }

  const portalRoot = document.getElementById('portal-root')
  if (!portalRoot) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(
              'relative z-10 w-full max-w-lg',
              'max-h-[90dvh]',
              'rounded-t-2xl',
              'bg-white dark:bg-slate-800',
              'shadow-xl',
              'flex flex-col',
              className
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex shrink-0 items-center justify-center pb-2 pt-3">
              <div className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            {title && (
              <div className="shrink-0 px-6 pb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h2>
              </div>
            )}

            <div className="overflow-y-auto overscroll-contain px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalRoot
  )
}
