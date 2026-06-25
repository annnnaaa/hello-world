import { useAuthStore } from '@/stores/authStore'
import { getGreeting } from '@/lib/utils'
import { BrainDumpTextArea } from '@/features/brain-dump/BrainDumpTextArea'
import { OverdueTasksSection } from './OverdueTasksSection'
import { UpcomingEventsSection } from './UpcomingEventsSection'
import { RecentNotesSection } from './RecentNotesSection'
import { QuickActionsRow } from './QuickActionsRow'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'

export function DashboardPage() {
  const profile = useAuthStore((s) => s.profile)
  const firstName = profile?.display_name?.split(' ')[0] || ''

  return (
    <>
      <TopBar title="Clarity" />
      <PageContainer>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              {getGreeting()}{firstName ? `, ${firstName}` : ''}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Here's your day at a glance
            </p>
          </div>

          <BrainDumpTextArea />
          <QuickActionsRow />
          <OverdueTasksSection />
          <UpcomingEventsSection />
          <RecentNotesSection />
        </div>
      </PageContainer>
    </>
  )
}
