import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthGuard } from '@/features/auth/AuthGuard'
import { AuthPage } from '@/features/auth/AuthPage'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { InboxPage } from '@/features/inbox/InboxPage'
import { TasksPage } from '@/features/tasks/TasksPage'
import { PlannerPage } from '@/features/planner/PlannerPage'
import { FilingPage } from '@/features/filing/FilingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <AuthGuard>
              <AppShell>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/filing" element={<FilingPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AppShell>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
