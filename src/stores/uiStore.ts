import { create } from 'zustand'
import type { Folder, PlannerView } from '@/types'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UiState {
  brainDumpOpen: boolean
  activeTab: string
  currentFolderId: string | null
  folderStack: Folder[]
  plannerView: PlannerView
  plannerDate: string
  toasts: Toast[]

  toggleBrainDump: () => void
  setActiveTab: (tab: string) => void
  navigateFolder: (folder: Folder) => void
  popFolderStack: () => void
  setPlannerView: (view: PlannerView) => void
  setPlannerDate: (date: Date) => void
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  brainDumpOpen: false,
  activeTab: 'home',
  currentFolderId: null,
  folderStack: [],
  plannerView: 'month',
  plannerDate: new Date().toISOString(),
  toasts: [],

  toggleBrainDump: () => {
    set((state) => ({ brainDumpOpen: !state.brainDumpOpen }))
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab })
  },

  navigateFolder: (folder: Folder) => {
    set((state) => ({
      currentFolderId: folder.id,
      folderStack: [...state.folderStack, folder],
    }))
  },

  popFolderStack: () => {
    const stack = get().folderStack
    if (stack.length <= 1) {
      set({ currentFolderId: null, folderStack: [] })
      return
    }

    const newStack = stack.slice(0, -1)
    set({
      currentFolderId: newStack[newStack.length - 1].id,
      folderStack: newStack,
    })
  },

  setPlannerView: (view: PlannerView) => {
    set({ plannerView: view })
  },

  setPlannerDate: (date: Date) => {
    set({ plannerDate: date.toISOString() })
  },

  addToast: (message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))

    // Auto-remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))
