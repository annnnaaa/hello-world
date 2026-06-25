import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TaskFilterState {
  timeCategory: 'all' | 'overdue' | 'now' | 'soon' | 'later'
  energy: 'all' | 'low' | 'medium' | 'high'
  batchType: 'all' | string
  showCompleted: boolean

  setTimeCategory: (category: TaskFilterState['timeCategory']) => void
  setEnergy: (energy: TaskFilterState['energy']) => void
  setBatchType: (batchType: string) => void
  setShowCompleted: (show: boolean) => void
}

export const useTaskFilterStore = create<TaskFilterState>()(
  persist(
    (set) => ({
      timeCategory: 'all',
      energy: 'all',
      batchType: 'all',
      showCompleted: false,

      setTimeCategory: (timeCategory) => {
        set({ timeCategory })
      },

      setEnergy: (energy) => {
        set({ energy })
      },

      setBatchType: (batchType) => {
        set({ batchType })
      },

      setShowCompleted: (showCompleted) => {
        set({ showCompleted })
      },
    }),
    { name: 'clarity-task-filters' },
  ),
)
