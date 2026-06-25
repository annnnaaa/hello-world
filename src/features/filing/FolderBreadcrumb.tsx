import { useEffect, useRef } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'

export function FolderBreadcrumb() {
  const folderStack = useUiStore((s) => s.folderStack)
  const navigateFolder = useUiStore((s) => s.navigateFolder)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Navigate to root
  const goHome = () => {
    // Pop the entire stack
    const { folderStack } = useUiStore.getState()
    for (let i = 0; i < folderStack.length; i++) {
      useUiStore.getState().popFolderStack()
    }
  }

  // Navigate to a specific crumb in the stack
  const goToIndex = (index: number) => {
    const { folderStack } = useUiStore.getState()
    const popsNeeded = folderStack.length - 1 - index
    for (let i = 0; i < popsNeeded; i++) {
      useUiStore.getState().popFolderStack()
    }
  }

  // Auto-scroll to end when breadcrumb changes
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    }
  }, [folderStack.length])

  return (
    <nav
      ref={scrollRef}
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1 overflow-x-auto scrollbar-none',
        'pb-1 -mx-1 px-1',
      )}
    >
      <button
        type="button"
        onClick={goHome}
        className={cn(
          'flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors',
          folderStack.length === 0
            ? 'font-medium text-slate-900 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
        )}
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </button>

      {folderStack.map((folder, index) => {
        const isLast = index === folderStack.length - 1
        return (
          <div key={folder.id} className="flex shrink-0 items-center gap-1">
            <ChevronRight
              className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => {
                if (!isLast) goToIndex(index)
              }}
              disabled={isLast}
              className={cn(
                'rounded-md px-2 py-1 text-sm transition-colors',
                isLast
                  ? 'font-medium text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
              )}
            >
              {folder.name}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
