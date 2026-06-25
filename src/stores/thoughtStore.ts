import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PendingThought {
  id: string
  content: string
  createdAt: string
}

interface ThoughtState {
  pendingThoughts: PendingThought[]
  addPending: (content: string) => void
  removePending: (id: string) => void
  getPending: () => PendingThought[]
}

export const useThoughtStore = create<ThoughtState>()(
  persist(
    (set, get) => ({
      pendingThoughts: [],

      addPending: (content: string) => {
        const thought: PendingThought = {
          id: crypto.randomUUID(),
          content,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          pendingThoughts: [...state.pendingThoughts, thought],
        }))
      },

      removePending: (id: string) => {
        set((state) => ({
          pendingThoughts: state.pendingThoughts.filter((t) => t.id !== id),
        }))
      },

      getPending: () => {
        return get().pendingThoughts
      },
    }),
    { name: 'clarity-thought-queue' },
  ),
)
