import { useState, useRef, useCallback } from 'react'
import { Folder as FolderIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Folder } from '@/types'

interface FolderCardProps {
  folder: Folder
  onTap: (folder: Folder) => void
  onLongPress: (folder: Folder) => void
}

const LONG_PRESS_MS = 500

export function FolderCard({ folder, onTap, onLongPress }: FolderCardProps) {
  const [pressing, setPressing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handlePointerDown = () => {
    didLongPress.current = false
    setPressing(true)
    timerRef.current = setTimeout(() => {
      didLongPress.current = true
      setPressing(false)
      onLongPress(folder)
    }, LONG_PRESS_MS)
  }

  const handlePointerUp = () => {
    clearTimer()
    setPressing(false)
    if (!didLongPress.current) {
      onTap(folder)
    }
  }

  const handlePointerCancel = () => {
    clearTimer()
    setPressing(false)
  }

  const tintColor = folder.color ?? undefined

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onTap(folder)
      }}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl p-4',
        'bg-white dark:bg-slate-800',
        'border border-slate-200 dark:border-slate-700',
        'cursor-pointer select-none touch-manipulation',
        'transition-transform',
        pressing && 'scale-95',
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          tintColor
            ? 'bg-opacity-15 dark:bg-opacity-20'
            : 'bg-accent-50 dark:bg-accent-900/30',
        )}
        style={tintColor ? { backgroundColor: `${tintColor}20` } : undefined}
      >
        <FolderIcon
          className="h-6 w-6"
          style={tintColor ? { color: tintColor } : undefined}
          {...(!tintColor && {
            className: 'h-6 w-6 text-accent-500 dark:text-accent-400',
          })}
        />
      </div>
      <p className="w-full truncate text-center text-sm font-medium text-slate-900 dark:text-slate-100">
        {folder.name}
      </p>
    </div>
  )
}
