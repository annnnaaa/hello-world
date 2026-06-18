import { useBrainDump } from '@/hooks/useBrainDump'
import { useAppStore } from '@/store/appStore'
import { Header } from '@/components/layout/Header'
import { ThoughtCard } from '@/components/inbox/ThoughtCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BrainDumpModal } from '@/components/braindump/BrainDumpModal'
import { Inbox, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function InboxPage() {
  const { unsorted, loading } = useBrainDump()
  const { brainDumpOpen, setBrainDumpOpen } = useAppStore()

  return (
    <div>
      <Header
        title="Inbox"
        subtitle={unsorted.length > 0 ? `${unsorted.length} unsorted` : 'All clear'}
        right={
          <Button variant="ghost" size="sm" onClick={() => setBrainDumpOpen(true)}>
            <Zap className="w-4 h-4" />
            Dump
          </Button>
        }
      />

      <div className="px-4 pt-4 space-y-3 pb-4">
        {loading ? (
          <LoadingSpinner />
        ) : unsorted.length === 0 ? (
          <EmptyState
            icon={<Inbox className="w-8 h-8" />}
            title="Inbox is empty"
            description="Brain dump your thoughts and sort them here into tasks, events, notes, or ideas."
            action={
              <Button onClick={() => setBrainDumpOpen(true)}>
                <Zap className="w-4 h-4" />
                Brain Dump
              </Button>
            }
          />
        ) : (
          <>
            <p className="text-xs text-slate-400 dark:text-slate-500 px-1">
              Tap "Sort" on each thought to send it to the right place.
            </p>
            {unsorted.map(thought => (
              <ThoughtCard key={thought.id} thought={thought} />
            ))}
          </>
        )}
      </div>

      <BrainDumpModal open={brainDumpOpen} onClose={() => setBrainDumpOpen(false)} />
    </div>
  )
}
