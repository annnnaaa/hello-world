import { useState } from 'react'
import { useUiStore } from '@/stores/uiStore'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { PlannerViewToggle } from './PlannerViewToggle'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { DayView } from './DayView'
import { EventSheet } from './EventSheet'
import { format } from 'date-fns'

export function PlannerPage() {
  const plannerView = useUiStore((s) => s.plannerView)
  const plannerDate = useUiStore((s) => s.plannerDate)
  const setPlannerDate = useUiStore((s) => s.setPlannerDate)
  const [eventSheetOpen, setEventSheetOpen] = useState(false)

  const handleToday = () => setPlannerDate(new Date())

  return (
    <>
      <TopBar
        title="Planner"
        rightAction={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleToday}>
              Today
            </Button>
            <Button size="sm" onClick={() => setEventSheetOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          <PlannerViewToggle />

          {plannerView === 'month' && <MonthView />}
          {plannerView === 'week' && <WeekView />}
          {plannerView === 'day' && <DayView />}
        </div>
      </PageContainer>

      <EventSheet
        isOpen={eventSheetOpen}
        onClose={() => setEventSheetOpen(false)}
        defaultDate={format(new Date(plannerDate), 'yyyy-MM-dd')}
      />
    </>
  )
}
