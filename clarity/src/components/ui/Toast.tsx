import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

export function Toast() {
  const { toastMessage, toastType, clearToast } = useAppStore()

  if (!toastMessage) return null

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  }

  const bg = {
    success: 'bg-white dark:bg-slate-900 border-green-200 dark:border-green-800',
    error: 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800',
    info: 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800',
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-slide-up">
      <div className={cn('flex items-center gap-3 p-3.5 rounded-2xl border shadow-lg', bg[toastType])}>
        {icons[toastType]}
        <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{toastMessage}</p>
        <button onClick={clearToast} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
