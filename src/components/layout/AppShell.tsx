import type { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { useUiStore } from '@/stores/uiStore'
import { lazy, Suspense } from 'react'
import { Spinner } from '@/components/ui/Spinner'

const BrainDumpPage = lazy(() =>
  import('@/features/brain-dump/BrainDumpPage').then((m) => ({ default: m.BrainDumpPage }))
)

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const brainDumpOpen = useUiStore((s) => s.brainDumpOpen)

  return (
    <div className="relative min-h-svh bg-slate-50 dark:bg-slate-950">
      {/* Main scrollable area */}
      <main className="pb-20" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Brain dump overlay */}
      <AnimatePresence>
        {brainDumpOpen && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950">
                <Spinner size="lg" />
              </div>
            }
          >
            <BrainDumpPage />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}
