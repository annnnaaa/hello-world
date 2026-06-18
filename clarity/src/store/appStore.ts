import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  quickAddOpen: boolean
  setQuickAddOpen: (open: boolean) => void

  brainDumpOpen: boolean
  setBrainDumpOpen: (open: boolean) => void

  toastMessage: string | null
  toastType: 'success' | 'error' | 'info'
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void

  activeTab: string
  setActiveTab: (tab: string) => void

  taskFilters: {
    status: string[]
    energy: string[]
    batch: string[]
  }
  setTaskFilters: (filters: AppState['taskFilters']) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      quickAddOpen: false,
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),

      brainDumpOpen: false,
      setBrainDumpOpen: (open) => set({ brainDumpOpen: open }),

      toastMessage: null,
      toastType: 'success',
      showToast: (msg, type = 'success') => {
        set({ toastMessage: msg, toastType: type })
        setTimeout(() => set({ toastMessage: null }), 3000)
      },
      clearToast: () => set({ toastMessage: null }),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      taskFilters: { status: [], energy: [], batch: [] },
      setTaskFilters: (filters) => set({ taskFilters: filters }),
    }),
    { name: 'clarity-app-store', partialize: (s) => ({ theme: s.theme, taskFilters: s.taskFilters }) }
  )
)
