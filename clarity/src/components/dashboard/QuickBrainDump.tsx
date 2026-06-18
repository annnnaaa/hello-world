import { Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAppStore } from '@/store/appStore'

export function QuickBrainDump() {
  const { setBrainDumpOpen } = useAppStore()

  return (
    <Card
      onClick={() => setBrainDumpOpen(true)}
      className="border-dashed border-2 border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/10 hover:bg-brand-50 dark:hover:bg-brand-900/20"
      padding="md"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-brand-500 dark:text-brand-400" />
        </div>
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">Brain Dump</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Tap to dump what's on your mind</p>
        </div>
        <span className="ml-auto text-xs text-brand-400 font-medium bg-brand-100 dark:bg-brand-900/40 px-2 py-1 rounded-lg">
          Tap
        </span>
      </div>
    </Card>
  )
}
