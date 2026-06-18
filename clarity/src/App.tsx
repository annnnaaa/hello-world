import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store/appStore'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthPage } from '@/components/auth/AuthPage'
import { HomePage } from '@/pages/HomePage'
import { InboxPage } from '@/pages/InboxPage'
import { TasksPage } from '@/pages/TasksPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { FilingPage } from '@/pages/FilingPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const PAGE_MAP: Record<string, React.ComponentType> = {
  home: HomePage,
  inbox: InboxPage,
  tasks: TasksPage,
  planner: PlannerPage,
  filing: FilingPage,
}

export default function App() {
  const { user, loading } = useAuth()
  const { activeTab } = useAppStore()
  useTheme()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">C</span>
          </div>
          <LoadingSpinner size="sm" label="Loading Clarity…" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  const ActivePage = PAGE_MAP[activeTab] ?? HomePage

  return (
    <AppLayout>
      <ActivePage />
    </AppLayout>
  )
}
