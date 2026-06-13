import { BottomNav } from './BottomNav'
import { Toast } from '@/components/ui/Toast'
import { QuickAddButton } from './QuickAddButton'
import { useAppStore } from '@/store/appStore'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { setBrainDumpOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      <BottomNav />
      <QuickAddButton onBrainDump={() => setBrainDumpOpen(true)} />
      <Toast />
    </div>
  )
}
