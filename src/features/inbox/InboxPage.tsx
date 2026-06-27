import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Inbox, Trash2, Archive } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { getInboxThoughts, archiveThought, deleteThought } from '@/services/thoughts'
import { thoughtKeys } from '@/lib/queryKeys'
import { TopBar } from '@/components/layout/TopBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { ThoughtCard } from '@/components/shared/ThoughtCard'
import { ConvertSheet } from './ConvertSheet'
import { cn } from '@/lib/utils'
import type { Thought } from '@/types'

export function InboxPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null)

  const { data: thoughts = [], isLoading } = useQuery({
    queryKey: thoughtKeys.inbox(),
    queryFn: () => getInboxThoughts(user!.id),
    enabled: !!user,
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveThought(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: thoughtKeys.inbox() })
      const prev = queryClient.getQueryData<Thought[]>(thoughtKeys.inbox())
      queryClient.setQueryData<Thought[]>(thoughtKeys.inbox(), (old) =>
        old?.filter((t) => t.id !== id),
      )
      return { prev }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(thoughtKeys.inbox(), context?.prev)
      toast('Failed to archive', 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
    },
    onSuccess: () => {
      toast('Archived', 'success')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteThought(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: thoughtKeys.inbox() })
      const prev = queryClient.getQueryData<Thought[]>(thoughtKeys.inbox())
      queryClient.setQueryData<Thought[]>(thoughtKeys.inbox(), (old) =>
        old?.filter((t) => t.id !== id),
      )
      return { prev }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(thoughtKeys.inbox(), context?.prev)
      toast('Failed to delete', 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: thoughtKeys.inbox() })
    },
    onSuccess: () => {
      toast('Deleted', 'success')
    },
  })

  return (
    <>
      <TopBar
        title="Inbox"
        rightAction={
          thoughts.length > 0 ? (
            <Badge>{thoughts.length}</Badge>
          ) : undefined
        }
      />
      <PageContainer>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : thoughts.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Inbox is empty"
            description="Brain dump some thoughts and they'll appear here for sorting."
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought) => (
                <motion.div
                  key={thought.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  className="relative"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <ThoughtCard
                        thought={thought}
                        onTap={() => setSelectedThought(thought)}
                      />
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => archiveMutation.mutate(thought.id)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                          'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
                          'dark:hover:bg-slate-800 dark:hover:text-slate-300',
                        )}
                        aria-label="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(thought.id)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                          'text-slate-400 hover:bg-red-50 hover:text-red-500',
                          'dark:hover:bg-red-900/20 dark:hover:text-red-400',
                        )}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      <ConvertSheet
        thought={selectedThought}
        isOpen={!!selectedThought}
        onClose={() => setSelectedThought(null)}
      />
    </>
  )
}
